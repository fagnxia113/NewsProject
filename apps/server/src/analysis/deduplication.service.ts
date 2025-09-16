import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@server/configuration';

@Injectable()
export class DeduplicationService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly similarityThreshold = 0.8; // 相似度阈值
  private enableLLMDeduplication: boolean; // 是否启用LLM去重

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {
    // 从配置中获取是否启用LLM去重
    const llmConfig = this.configService.get('llm');
    this.enableLLMDeduplication = llmConfig?.enableDeduplication || false;
  }

  /**
   * 检查文章是否重复
   * @param articleId 文章ID
   * @returns 检查结果
   */
  async checkDuplicate(articleId: string) {
    try {
      // 获取当前文章
      const currentArticle = await this.prismaService.article.findUnique({
        where: { id: articleId },
      });

      if (!currentArticle) {
        throw new Error(`文章不存在: ${articleId}`);
      }

      // 如果文章已经标记为重复，直接返回
      if (currentArticle.isDuplicate) {
        return {
          success: true,
          isDuplicate: true,
          duplicateGroupId: currentArticle.duplicateGroupId,
          message: '文章已标记为重复',
        };
      }

      // 获取所有可能重复的文章（排除当前文章）
      const potentialDuplicates = await this.prismaService.article.findMany({
        where: {
          id: { not: articleId },
          isDuplicate: false, // 只检查未被标记为重复的文章
        },
        orderBy: {
          publishTime: 'desc',
        },
      });

      // 检查是否有重复文章
      let duplicateArticle: any = null;
      let maxSimilarity = 0;

      // 根据配置选择去重方法
      if (this.enableLLMDeduplication && potentialDuplicates.length > 0) {
        // 使用大模型检查重复
        const llmResult = await this.checkDuplicateWithLLM(
          currentArticle.title,
          currentArticle.content || '',
          potentialDuplicates
        );

        if (llmResult.isDuplicate && llmResult.duplicateArticleId) {
          duplicateArticle = potentialDuplicates.find(a => a.id === llmResult.duplicateArticleId);
          maxSimilarity = llmResult.similarity || 0.8;
        }
      }

      // 如果大模型未找到重复或未启用大模型去重，使用传统方法
      if (!duplicateArticle) {
        for (const article of potentialDuplicates) {
          const similarity = await this.calculateSimilarity(
            currentArticle.title,
            article.title,
            currentArticle.content || '',
            article.content || ''
          );

          if (similarity > this.similarityThreshold && similarity > maxSimilarity) {
            maxSimilarity = similarity;
            duplicateArticle = article;
          }
        }
      }

      // 如果找到重复文章，标记当前文章为重复
      if (duplicateArticle) {
        // 生成或使用重复文章的组ID
        const groupId = duplicateArticle.duplicateGroupId || duplicateArticle.id;
        
        // 更新当前文章
        await this.prismaService.article.update({
          where: { id: articleId },
          data: {
            isDuplicate: true,
            duplicateGroupId: groupId,
          },
        });
        
        // 如果原始文章还没有组ID，也更新它
        if (!duplicateArticle.duplicateGroupId) {
          await this.prismaService.article.update({
            where: { id: duplicateArticle.id },
            data: {
              duplicateGroupId: groupId,
            },
          });
        }

        return {
          success: true,
          isDuplicate: true,
          duplicateGroupId: groupId,
          similarity: maxSimilarity,
          message: '发现重复文章',
        };
      }

      return {
        success: true,
        isDuplicate: false,
        message: '未发现重复文章',
      };
    } catch (error) {
      this.logger.error(`检查文章重复失败: ${articleId}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 批量检查文章重复
   * @param articleIds 文章ID列表
   * @returns 检查结果
   */
  async batchCheckDuplicates(articleIds: string[]) {
    const results: any[] = [];
    
    for (const articleId of articleIds) {
      try {
        const result = await this.checkDuplicate(articleId);
        results.push({
          articleId,
          ...result,
        });
      } catch (error) {
        this.logger.error(`批量检查文章重复失败: ${articleId}`, error);
        results.push({
          articleId,
          success: false,
          error: error.message,
        });
      }
    }
    
    const duplicateCount = results.filter(r => r.isDuplicate).length;
    
    return {
      success: true,
      message: `批量检查完成，发现 ${duplicateCount} 篇重复文章`,
      data: results,
    };
  }

  /**
   * 计算两篇文章的相似度
   * @param title1 文章1标题
   * @param title2 文章2标题
   * @param content1 文章1内容
   * @param content2 文章2内容
   * @returns 相似度（0-1之间）
   */
  private async calculateSimilarity(
    title1: string,
    title2: string,
    content1: string,
    content2: string
  ): Promise<number> {
    try {
      // 标题相似度权重更高
      const titleWeight = 0.6;
      const contentWeight = 0.4;

      // 计算标题相似度
      const titleSimilarity = this.calculateTextSimilarity(title1, title2);

      // 计算内容相似度
      const contentSimilarity = this.calculateTextSimilarity(content1, content2);

      // 综合相似度
      const totalSimilarity = titleSimilarity * titleWeight + contentSimilarity * contentWeight;

      return totalSimilarity;
    } catch (error) {
      this.logger.error('计算相似度失败', error);
      return 0;
    }
  }

  /**
   * 计算两个文本的相似度
   * @param text1 文本1
   * @param text2 文本2
   * @returns 相似度（0-1之间）
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    // 如果任一文本为空，相似度为0
    if (!text1 || !text2) {
      return 0;
    }

    // 简单的相似度计算算法
    // 在实际项目中，可以使用更复杂的算法，如余弦相似度、编辑距离等
    
    // 1. 计算公共词组
    const words1 = this.extractWords(text1);
    const words2 = this.extractWords(text2);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    // 2. 计算Jaccard相似度
    const jaccardSimilarity = intersection.length / union.length;
    
    // 3. 计算最长公共子序列（LCS）相似度
    const lcsSimilarity = this.calculateLCSSimilarity(text1, text2);
    
    // 4. 综合相似度
    const combinedSimilarity = (jaccardSimilarity + lcsSimilarity) / 2;
    
    return combinedSimilarity;
  }

  /**
   * 提取文本中的词组
   * @param text 文本
   * @returns 词组数组
   */
  private extractWords(text: string): string[] {
    // 简单的中文分词
    // 在实际项目中，可以使用专业的分词库，如jieba等
    
    // 移除标点符号和特殊字符
    const cleanedText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
    
    // 分割成词组
    const words = cleanedText.split(/\s+/).filter(word => word.length > 1);
    
    return words;
  }

  /**
   * 计算最长公共子序列（LCS）相似度
   * @param text1 文本1
   * @param text2 文本2
   * @returns LCS相似度（0-1之间）
   */
  private calculateLCSSimilarity(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    
    // 创建DP表
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    // 填充DP表
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // 计算相似度
    const lcsLength = dp[m][n];
    const maxLength = Math.max(m, n);
    
    return maxLength > 0 ? lcsLength / maxLength : 0;
  }

  /**
   * 使用大模型检查文章重复
   * @param title 当前文章标题
   * @param content 当前文章内容
   * @param articles 已分析的文章列表
   * @returns 重复检查结果
   */
  private async checkDuplicateWithLLM(title: string, content: string, articles: any[]): Promise<{
    isDuplicate: boolean;
    duplicateArticleId?: string;
    similarity?: number;
  }> {
    try {
      // 获取LLM配置
    const llmConfig = this.configService.get('llm');
    const apiKey = llmConfig?.apiKey || '';
    
    if (!apiKey) {
      this.logger.warn('LLM_API_KEY未配置，使用传统方法进行去重');
      // 回退到传统方法
      return this.checkDuplicateWithTraditionalMethod(title, content, articles);
    }

    const apiUrl = llmConfig?.apiUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const model = llmConfig?.model || 'glm-4';

      // 构建提示词
      const prompt = this.buildDuplicateCheckPrompt(title, content, articles);

      // 调用LLM API
      const response = await fetch(apiUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content;

      if (!result) {
        throw new Error('LLM返回结果为空');
      }

      // 解析LLM返回结果
      return this.parseDuplicateCheckResult(result, articles);
    } catch (error) {
      this.logger.error(`使用大模型检查重复失败: ${error.message}`, error);
      // 回退到传统方法
      return this.checkDuplicateWithTraditionalMethod(title, content, articles);
    }
  }

  /**
   * 构建重复检查提示词
   * @param title 当前文章标题
   * @param content 当前文章内容
   * @param articles 已分析的文章列表
   * @returns 提示词
   */
  private buildDuplicateCheckPrompt(title: string, content: string, articles: any[]): string {
    // 限制文章数量，避免提示词过长
    const maxArticles = 5;
    const limitedArticles = articles.slice(0, maxArticles);

    const articlesText = limitedArticles.map((article, index) => `
文章${index + 1}:
标题: ${article.title}
内容: ${article.content ? article.content.substring(0, 500) + '...' : '(无内容)'}
ID: ${article.id}
`).join('\n');

    return `
请判断以下文章是否与提供的文章列表中的任何一篇重复。

当前文章:
标题: ${title}
内容: ${content.substring(0, 1000)}...

已分析的文章:
${articlesText}

请以JSON格式返回判断结果，格式如下：
{
  "isDuplicate": true/false,
  "duplicateArticleId": "重复文章的ID（如果不重复则为空）",
  "similarity": 0.8,
  "reason": "判断原因"
}

判断标准：
1. 如果两篇文章报道的是同一事件，即使表达方式不同，也应视为重复
2. 如果两篇文章内容相似度超过80%，应视为重复
3. 如果只是主题相似但报道的事件不同，不应视为重复
4. 请确保返回的是有效的JSON格式
`;
  }

  /**
   * 解析重复检查结果
   * @param result LLM返回结果
   * @param articles 已分析的文章列表
   * @returns 解析后的结果
   */
  private parseDuplicateCheckResult(result: string, articles: any[]): {
    isDuplicate: boolean;
    duplicateArticleId?: string;
    similarity?: number;
  } {
    try {
      // 尝试解析JSON
      const parsedResult = JSON.parse(result);
      
      // 验证结果格式
      if (typeof parsedResult.isDuplicate !== 'boolean') {
        throw new Error('无效的isDuplicate字段');
      }

      // 如果是重复文章，验证duplicateArticleId
      if (parsedResult.isDuplicate && parsedResult.duplicateArticleId) {
        const duplicateArticle = articles.find(a => a.id === parsedResult.duplicateArticleId);
        if (!duplicateArticle) {
          throw new Error('无效的duplicateArticleId');
        }
      }

      return {
        isDuplicate: parsedResult.isDuplicate,
        duplicateArticleId: parsedResult.duplicateArticleId,
        similarity: parsedResult.similarity || 0.8,
      };
    } catch (error) {
      this.logger.error('解析重复检查结果失败', error);
      // 返回默认值
      return {
        isDuplicate: false,
      };
    }
  }

  /**
   * 使用传统方法检查文章重复
   * @param title 当前文章标题
   * @param content 当前文章内容
   * @param articles 已分析的文章列表
   * @returns 重复检查结果
   */
  private async checkDuplicateWithTraditionalMethod(title: string, content: string, articles: any[]): Promise<{
    isDuplicate: boolean;
    duplicateArticleId?: string;
    similarity?: number;
  }> {
    let maxSimilarity = 0;
    let duplicateArticleId: string | undefined;

    for (const article of articles) {
      const similarity = await this.calculateSimilarity(
        title,
        article.title,
        content,
        article.content || ''
      );

      if (similarity > this.similarityThreshold && similarity > maxSimilarity) {
        maxSimilarity = similarity;
        duplicateArticleId = article.id;
      }
    }

    return {
      isDuplicate: !!duplicateArticleId,
      duplicateArticleId,
      similarity: maxSimilarity,
    };
  }

  /**
   * 获取重复文章统计
   * @returns 统计结果
   */
  async getDuplicateStats() {
    try {
      // 获取总文章数
      const totalArticles = await this.prismaService.article.count();
      
      // 获取重复文章数
      const duplicateArticles = await this.prismaService.article.count({
        where: { isDuplicate: true },
      });
      
      // 获取非重复文章数
      const uniqueArticles = totalArticles - duplicateArticles;
      
      // 获取重复文章分组统计
      const duplicateGroups = await this.prismaService.article.groupBy({
        by: ['duplicateGroupId'],
        where: {
          isDuplicate: true,
          duplicateGroupId: { not: null },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10, // 取前10组
      });
      
      // 获取每组重复文章的详细信息
      const duplicateGroupDetails: any[] = [];
      for (const group of duplicateGroups) {
        if (group.duplicateGroupId) {
          // 获取原始文章（该组中isDuplicate为false的文章）
          const originalArticle = await this.prismaService.article.findFirst({
            where: { 
              duplicateGroupId: group.duplicateGroupId,
              isDuplicate: false 
            },
            select: {
              id: true,
              title: true,
              publishTime: true,
            },
          });
          
          duplicateGroupDetails.push({
            originalArticle,
            duplicateCount: (group._count as any)?.id || 0,
          });
        }
      }
      
      return {
        success: true,
        data: {
          totalArticles,
          duplicateArticles,
          uniqueArticles,
          duplicateRate: totalArticles > 0 ? (duplicateArticles / totalArticles) * 100 : 0,
          topDuplicateGroups: duplicateGroupDetails,
        },
      };
    } catch (error) {
      this.logger.error('获取重复文章统计失败', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}