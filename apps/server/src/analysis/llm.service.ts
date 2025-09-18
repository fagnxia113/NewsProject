import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@server/configuration';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  /**
   * 获取激活的LLM配置
   * @returns LLM配置
   */
  private async getActiveLLMConfig() {
    const config = await this.prismaService.lLMConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      // 如果没有配置，使用环境变量作为默认值
      return {
        model: process.env.LLM_MODEL || 'glm-4',
        apiKey: process.env.LLM_API_KEY || '',
        baseUrl: process.env.LLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        maxTokens: 4000,
        temperature: 0.3,
      };
    }

    return {
      model: config.model,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 0.3,
    };
  }

  /**
   * 分析文章，识别行业类型和新闻类型
   * @param articleId 文章ID
   * @returns 分析结果
   */
  async analyzeArticle(articleId: string) {
    try {
      // 获取文章内容
      const article = await this.prismaService.article.findUnique({
        where: { id: articleId },
        select: {
          id: true,
          title: true,
          content: true,
        },
      });

      if (!article) {
        throw new Error(`文章不存在: ${articleId}`);
      }

      // 获取预设的行业和新闻类型
      const [industries, newsTypes] = await Promise.all([
        this.prismaService.industry.findMany({
          where: { isActive: true },
          select: { name: true, description: true }
        }),
        this.prismaService.newsType.findMany({
          where: { isActive: true },
          select: { name: true, description: true }
        })
      ]);

      // 构建提示词
      const prompt = this.buildAnalysisPrompt(
        article.title, 
        article.content || '', 
        industries.map(i => `${i.name}${i.description ? `(${i.description})` : ''}`).join(', '),
        newsTypes.map(t => `${t.name}${t.description ? `(${t.description})` : ''}`).join(', ')
      );

      // 调用LLM API
      const response = await this.callLlmApi(prompt);

      // 解析响应
      const analysisResult = this.parseAnalysisResponse(response);

      // 更新文章分析结果
      await this.prismaService.article.update({
        where: { id: articleId },
        data: {
          industry: analysisResult.industry,
          newsType: analysisResult.newsType,
          isProcessed: true,
        },
      });

      // 如果有事件拆分，保存事件数据
      if (analysisResult.events && analysisResult.events.length > 0) {
        await this.saveEvents(articleId, analysisResult.events);
      }

      return {
        success: true,
        data: analysisResult,
      };
    } catch (error) {
      this.logger.error(`分析文章失败: ${articleId}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 构建分析提示词
   * @param title 文章标题
   * @param content 文章内容
   * @param industry 预设行业列表
   * @param newsType 预设新闻类型列表
   * @returns 提示词
   */
  private buildAnalysisPrompt(
    title: string, 
    content: string, 
    industry?: string, 
    newsType?: string
  ): string {
    // 获取预设行业和类型信息
    const industryInfo = industry ? `预设行业：${industry}` : '请自动识别文章所属行业';
    const newsTypeInfo = newsType ? `预设新闻类型：${newsType}` : '请自动识别新闻类型';
    
    return `
你是一个专业的新闻分析专家，请对以下文章进行分析。

${industryInfo}
${newsTypeInfo}

文章标题：${title}

文章内容：
${content}

请按照以下要求进行分析：

1. 判断文章是否包含与预设行业和类型相关的新闻，如果不相关，请返回空结果。

2. 如果相关，请将文章内容拆分为多个独立的新闻事件（单篇文章可能包含多条新闻），每条新闻需包含：
   - 标题：简洁明了，突出事件核心
   - 简要：从文章中提取关键信息，可进行轻微改写但不得变更原文含义，字数严格控制在200字以内
   - 类型：如"投资融资"、"政策法规"、"企业动态"、"技术突破"等
   - 相关实体：如公司名称、人物、地点等

3. 请以JSON格式返回分析结果，格式如下：
\`\`\`json
{
  "industry": "文章所属行业",
  "newsType": "文章主要类型",
  "isRelevant": true/false,
  "events": [
    {
      "title": "新闻标题1",
      "summary": "新闻简要1，控制在200字以内",
      "type": "新闻类型1",
      "entities": [
        {
          "name": "实体名称1",
          "type": "实体类型1"
        }
      ]
    }
  ]
}
\`\`\`

如果文章与预设行业和类型不相关，请返回：
\`\`\`json
{
  "industry": "文章所属行业",
  "newsType": "文章主要类型",
  "isRelevant": false,
  "events": []
}
\`\`\`
    `;
  }

  /**
   * 调用LLM API
   * @param prompt 提示词
   * @returns LLM响应
   */
  private async callLlmApi(prompt: string): Promise<string> {
    try {
      const config = await this.getActiveLLMConfig();
      
      if (!config.apiKey) {
        throw new Error('LLM API密钥未配置');
      }

      const response = await fetch(config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API调用失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('LLM API调用失败', error);
      throw new Error(`LLM API调用失败: ${error.message}`);
    }
  }

  /**
   * 解析分析响应
   * @param response LLM响应
   * @returns 分析结果
   */
  private parseAnalysisResponse(response: string): any {
    try {
      // 清理响应内容，提取JSON部分
      let cleanResponse = response.trim();
      
      // 如果响应包含代码块标记，提取其中的JSON
      const jsonBlockMatch = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        cleanResponse = jsonBlockMatch[1];
      }
      
      // 尝试解析JSON
      const result = JSON.parse(cleanResponse);
      
      // 验证必要字段
      if (!result.industry || !result.newsType) {
        throw new Error('分析结果缺少必要字段');
      }
      
      // 验证newsType是否为有效值
      const validNewsTypes = ['investment', 'policy', 'company', 'tech'];
      if (!validNewsTypes.includes(result.newsType)) {
        result.newsType = 'company'; // 默认值
      }
      
      // 确保events字段存在
      if (!result.events) {
        result.events = [];
      }
      
      // 如果isRelevant为false，清空events
      if (result.isRelevant === false) {
        result.events = [];
      }
      
      return result;
    } catch (error) {
      this.logger.error('解析分析响应失败', error);
      this.logger.error('原始响应内容:', response);
      // 返回默认值
      return {
        industry: '其他',
        newsType: 'company',
        isRelevant: false,
        events: [],
      };
    }
  }

  /**
   * 保存事件数据
   * @param articleId 文章ID
   * @param events 事件列表
   */
  private async saveEvents(articleId: string, events: any[]) {
    try {
      for (const event of events) {
        // 创建事件
        const createdEvent = await this.prismaService.splitEvent.create({
          data: {
            title: event.title,
            summary: event.summary,
            articleId: articleId,
            splitIndex: 0, // 默认值
            originalLink: '', // 必需字段，暂时设为空字符串
          },
        });

        // 保存事件相关实体
        if (event.entities && event.entities.length > 0) {
          for (const entity of event.entities) {
            // 根据实体类型创建对应的要素
            if (entity.type === '公司') {
              await this.prismaService.companyElement.create({
                data: {
                  companyName: entity.name,
                  articleId: articleId,
                },
              });
            }
            // 可以根据需要添加其他实体类型的处理
          }
        }
      }
    } catch (error) {
      this.logger.error('保存事件数据失败', error);
      throw new Error(`保存事件数据失败: ${error.message}`);
    }
  }
}
