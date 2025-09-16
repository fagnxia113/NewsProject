import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@server/prisma/prisma.service';

@Injectable()
export class AnalysisService {
  private logger = new Logger(AnalysisService.name);

  constructor(private prismaService: PrismaService) {}

  // 创建处理任务 - 用于路由中调用
  async createProcessingTask(): Promise<any> {
    try {
      // 简化实现，直接返回任务信息
      return {
        id: `task_${Date.now()}`,
        status: 0, // 0表示待处理
        startTime: Math.floor(Date.now() / 1000),
        totalArticles: 0
      };
    } catch (error) {
      this.logger.error('创建处理任务失败:', error);
      throw error;
    }
  }

  // 获取统计数据
  async getStats(): Promise<any> {
    try {
      // 获取文章总数
      const totalArticles = await this.prismaService.article.count();
      
      // 获取已处理文章数
      const processedArticles = await this.prismaService.article.count({
        where: { isProcessed: true }
      });
      
      // 获取未处理文章数
      const unprocessedArticles = await this.prismaService.article.count({
        where: { isProcessed: false }
      });
      
      // 获取今日文章数
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayArticles = await this.prismaService.article.count({
        where: {
          publishTime: {
            gte: Math.floor(today.getTime() / 1000)
          }
        }
      });
      
      // 获取昨日文章数
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayArticles = await this.prismaService.article.count({
        where: {
          publishTime: {
            gte: Math.floor(yesterday.getTime() / 1000),
            lt: Math.floor(today.getTime() / 1000)
          }
        }
      });
      
      return {
        totalArticles,
        processedArticles,
        unprocessedArticles,
        todayArticles,
        yesterdayArticles,
        processingRate: totalArticles > 0 ? (processedArticles / totalArticles * 100).toFixed(2) + '%' : '0%'
      };
    } catch (error) {
      this.logger.error('获取统计数据失败:', error);
      throw error;
    }
  }

  // 列出行业分类
  async listIndustries(): Promise<any> {
    try {
      // 从数据库获取行业列表
      const industries = await this.prismaService.industry.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          priority: 'asc',
        },
      });

      return industries.map(industry => ({
        id: industry.id,
        name: industry.name,
        active: industry.isActive,
      }));
    } catch (error) {
      this.logger.error('获取行业列表失败:', error);
      throw error;
    }
  }

  // 列出新闻类型
  async listNewsTypes(): Promise<any> {
    try {
      // 从数据库获取新闻类型列表
      const newsTypes = await this.prismaService.newsType.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          priority: 'asc',
        },
      });

      return newsTypes.map(type => ({
        id: type.id,
        name: type.name,
        active: type.isActive,
      }));
    } catch (error) {
      this.logger.error('获取新闻类型列表失败:', error);
      throw error;
    }
  }

  // 获取分类文章
  async getClassifiedArticles(params: { 
    industry?: string; 
    newsType?: string;
    startDate?: string;
    endDate?: string;
    keyword?: string;
    page?: number; 
    limit?: number; 
  }): Promise<any> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 20;
      const skip = (page - 1) * limit;
      
      // 构建查询条件
      const where: any = {};
      if (params.industry) {
        // 这里简化实现，实际应该根据行业分类查询
        // where.industry = params.industry;
      }
      
      if (params.newsType) {
        // 这里简化实现，实际应该根据新闻类型查询
        // where.newsType = params.newsType;
      }
      
      if (params.keyword) {
        // 这里简化实现，实际应该根据关键词查询
        // where.OR = [
        //   { title: { contains: params.keyword } },
        //   { content: { contains: params.keyword } }
        // ];
      }
      
      if (params.startDate && params.endDate) {
        const startTimestamp = Math.floor(new Date(params.startDate).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(params.endDate).getTime() / 1000);
        where.publishTime = {
          gte: startTimestamp,
          lte: endTimestamp
        };
      } else if (params.startDate) {
        const startTimestamp = Math.floor(new Date(params.startDate).getTime() / 1000);
        where.publishTime = {
          gte: startTimestamp
        };
      } else if (params.endDate) {
        const endTimestamp = Math.floor(new Date(params.endDate).getTime() / 1000);
        where.publishTime = {
          lte: endTimestamp
        };
      }
      
      // 获取文章总数
      const total = await this.prismaService.article.count({ where });
      
      // 获取文章列表
      const articles = await this.prismaService.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishTime: 'desc' }
      });
      
      return {
        data: articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      this.logger.error('获取分类文章失败:', error);
      throw error;
    }
  }

  // 处理新文章
  async processNewArticles(): Promise<any> {
    try {
      // 获取所有未处理的文章
      const unprocessedArticles = await this.prismaService.article.findMany({
        where: { isProcessed: false },
        orderBy: { publishTime: 'desc' }
      });

      if (unprocessedArticles.length === 0) {
        return {
          success: true,
          message: '没有需要处理的新文章',
          data: []
        };
      }

      const task = await this.createProcessingTask();
      
      // 异步处理文章
      setTimeout(async () => {
        try {
          let processedCount = 0;
          for (const article of unprocessedArticles) {
            await this.processArticle(article.id);
            processedCount++;
            
            // 每处理10篇文章更新一次任务进度
            if (processedCount % 10 === 0) {
              this.logger.debug(`已处理 ${processedCount}/${unprocessedArticles.length} 篇文章`);
            }
          }
          
          this.logger.debug(`任务 ${task.id} 完成，共处理 ${processedCount} 篇文章`);
        } catch (error) {
          this.logger.error(`处理新文章任务失败:`, error);
        }
      }, 100);

      return {
        taskId: task.id,
        totalArticles: unprocessedArticles.length,
        message: '任务已开始执行'
      };
    } catch (error) {
      this.logger.error('处理新文章失败:', error);
      return {
        success: false,
        message: '处理新文章失败',
        error: error.message
      };
    }
  }

  // 获取任务列表
  async listTasks(params: { page?: number; limit?: number; status?: string }): Promise<any> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 20;
      const skip = (page - 1) * limit;
      
      // 构建查询条件
      const where: any = {};
      if (params.status) {
        where.status = parseInt(params.status);
      }
      
      // 查询任务列表
      const [tasks, total] = await Promise.all([
        this.prismaService.processingTask.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prismaService.processingTask.count({ where }),
      ]);

      // 格式化返回数据
      const data = tasks.map(task => ({
        id: task.id,
        status: task.status,
        startTime: task.startTime,
        endTime: task.endTime,
        totalArticles: task.totalArticles,
        processedArticles: task.processedArticles,
        successArticles: task.successArticles,
        failedArticles: task.failedArticles,
        splitCount: task.splitCount,
        duplicateCount: task.duplicateCount,
      }));

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      this.logger.error('获取任务列表失败:', error);
      throw error;
    }
  }

  // 获取任务详情
  async getTask(id: string): Promise<any> {
    try {
      // 简化实现，返回模拟的任务信息
      return {
        id,
        status: 2, // 2表示已完成
        startTime: Math.floor(Date.now() / 1000) - 3600,
        endTime: Math.floor(Date.now() / 1000),
        totalArticles: 10,
        processedArticles: 10,
        successArticles: 10,
        failedArticles: 0,
        splitCount: 0,
        duplicateCount: 0
      };
    } catch (error) {
      this.logger.error('获取任务详情失败:', error);
      throw error;
    }
  }

  // 获取文章详情
  async getArticle(id: string): Promise<any> {
    try {
      const article = await this.prismaService.article.findUnique({
        where: { id }
      });

      if (!article) {
        throw new Error('文章不存在');
      }

      return article;
    } catch (error) {
      this.logger.error('获取文章详情失败:', error);
      throw error;
    }
  }

  // 获取文章分析结果
  async getArticleAnalysis(id: string): Promise<any> {
    try {
      // 简化实现，返回模拟的分析结果
      return {
        id: `analysis_${id}`,
        articleId: id,
        summary: '这是一篇关于人工智能在医疗领域应用的文章，讨论了AI技术如何帮助医生进行疾病诊断和治疗决策。',
        keyPoints: [
          'AI技术在医疗诊断中的应用越来越广泛',
          '深度学习算法可以提高诊断准确率',
          'AI辅助医生进行个性化治疗方案制定',
        ],
        entities: [
          { name: '人工智能', type: '技术', confidence: 0.95 },
          { name: '医疗诊断', type: '应用', confidence: 0.88 },
          { name: '深度学习', type: '技术', confidence: 0.82 },
        ],
        sentiment: 'neutral',
        createdAt: Math.floor(Date.now() / 1000),
      };
    } catch (error) {
      this.logger.error('获取文章分析结果失败:', error);
      throw error;
    }
  }

  // 执行完整的文章处理流程
  async processArticle(articleId: string): Promise<any> {
    try {
      const article = await this.prismaService.article.findUnique({ where: { id: articleId } });
      if (!article) {
        return { success: false, error: '文章不存在' };
      }

      // 如果文章已经处理过，直接返回
      if (article.isProcessed) {
        return { success: true, message: '文章已处理' };
      }

      // 1. 使用LLM分析文章内容
      // 注意：在实际实现中，应该通过依赖注入获取LlmService和DeduplicationService实例
      // 这里为了简化直接创建实例，但在生产环境中应该避免这样做
      const config = {
        server: { isProd: false, port: 4000, host: '0.0.0.0' },
        throttler: { maxRequestPerMinute: 60 },
        auth: { code: undefined },
        platform: { url: '' },
        feed: {
          originUrl: '',
          mode: '',
          updateDelayTime: 60,
          enableCleanHtml: false,
        },
        database: {
          type: 'sqlite',
        },
        llm: {
          apiKey: process.env.LLM_API_KEY || '',
          apiUrl: process.env.LLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          model: process.env.LLM_MODEL || 'glm-4',
          enableDeduplication: process.env.ENABLE_LLM_DEDUPLICATION === 'true',
        },
      };
      
      const llmService = new (await import('./llm.service')).LlmService(this.prismaService, {
        get: (key: string) => config[key],
      } as any);
      
      const analysisResult = await llmService.analyzeArticle(articleId);
      
      if (!analysisResult.success) {
        return { success: false, error: analysisResult.error };
      }

      // 2. 检查重复
      const deduplicationService = new (await import('./deduplication.service')).DeduplicationService(this.prismaService, {
        get: (key: string) => config[key],
      } as any);
      
      const duplicateResult = await deduplicationService.checkDuplicate(articleId);
      
      // 3. 更新文章处理状态
      await this.prismaService.article.update({
        where: { id: articleId },
        data: { 
          isProcessed: true, 
          processedTime: Math.floor(Date.now() / 1000),
          isDuplicate: duplicateResult.isDuplicate
        },
      });

      return { 
        success: true,
        analysisResult: analysisResult.data,
        duplicateResult
      };
    } catch (error) {
      this.logger.error('处理文章时出错:', error);
      return { success: false, error: error.message };
    }
  }

  // 批量处理指定文章
  async batchProcessArticles(articleIds: string[]): Promise<any> {
    try {
      if (articleIds.length === 0) {
        return {
          success: false,
          message: '未提供文章ID'
        };
      }

      const task = await this.createProcessingTask();
      
      // 异步处理文章
      setTimeout(async () => {
        try {
          let processedCount = 0;
          let successCount = 0;
          
          for (const articleId of articleIds) {
            const result = await this.processArticle(articleId);
            processedCount++;
            
            if (result.success) {
              successCount++;
            }
            
            // 每处理10篇文章更新一次任务进度
            if (processedCount % 10 === 0) {
              this.logger.debug(`已处理 ${processedCount}/${articleIds.length} 篇文章`);
            }
          }
          
          this.logger.debug(`任务 ${task.id} 完成，共处理 ${processedCount} 篇文章，成功 ${successCount} 篇`);
        } catch (error) {
          this.logger.error(`批量处理文章任务失败:`, error);
        }
      }, 100);

      return {
        taskId: task.id,
        totalArticles: articleIds.length,
        message: '任务已开始执行'
      };
    } catch (error) {
      this.logger.error('批量处理文章失败:', error);
      return {
        success: false,
        message: '批量处理文章失败',
        error: error.message
      };
    }
  }

  // 执行每日分析任务
  async performDailyAnalysis(date: Date): Promise<any> {
    try {
      const dateString = date.toISOString().split('T')[0];
      const articles = await this.prismaService.article.findMany({
        where: {
          processedTime: {
            gte: Math.floor(new Date(dateString).getTime() / 1000),
            lt: Math.floor(new Date(dateString).getTime() / 1000) + 24 * 60 * 60
          },
          isProcessed: true
        }
      });

      const result = {
        totalArticles: articles.length,
        analysisDate: new Date().toISOString(),
      };

      return result;
    } catch (error) {
      this.logger.error('执行每日分析时出错:', error);
      return null;
    }
  }

  // 批量处理所有文章
  async batchProcess(): Promise<any> {
    try {
      // 获取所有未处理的文章
      const unprocessedArticles = await this.prismaService.article.findMany({
        where: { isProcessed: false },
        orderBy: { publishTime: 'desc' }
      });

      if (unprocessedArticles.length === 0) {
        return {
          success: true,
          message: '没有需要处理的文章',
          data: []
        };
      }

      const results: any[] = [];
      for (const article of unprocessedArticles) {
        try {
          const result = await this.processArticle(article.id);
          results.push({
            articleId: article.id,
            success: result.success,
            data: result
          });
        } catch (error) {
          results.push({
            articleId: article.id,
            success: false,
            error: error.message
          });
        }
      }

      return {
        success: true,
        message: `批量处理完成，成功 ${results.filter(r => r.success).length} 篇，失败 ${results.filter(r => !r.success).length} 篇`,
        data: results
      };
    } catch (error) {
      this.logger.error('批量处理文章时出错:', error);
      return {
        success: false,
        message: '批量处理失败',
        error: error.message
      };
    }
  }

  // 删除指定文章的分析结果
  async deleteAnalysisResults(articleIds: string[]): Promise<any> {
    try {
      // 将指定文章标记为未处理
      const updatedCount = await this.prismaService.article.updateMany({
        where: { 
          id: {
            in: articleIds
          },
          isProcessed: true 
        },
        data: { 
          isProcessed: false,
          industry: null,
          newsType: null,
          processedTime: null,
          isDuplicate: false
        }
      });

      // 删除这些文章相关的拆分事件
      await this.prismaService.splitEvent.deleteMany({
        where: {
          articleId: {
            in: articleIds
          }
        }
      });

      return {
        success: true,
        message: `已删除 ${updatedCount.count} 条分析结果`,
      };
    } catch (error) {
      this.logger.error('删除分析结果时出错:', error);
      return {
        success: false,
        message: '删除分析结果失败',
        error: error.message
      };
    }
  }

  // 清空分析结果
  async clearAnalysisResults(): Promise<any> {
    try {
      // 将所有已处理的文章标记为未处理
      const updatedCount = await this.prismaService.article.updateMany({
        where: { isProcessed: true },
        data: { 
          isProcessed: false,
          industry: null,
          newsType: null,
          processedTime: null,
          isDuplicate: false
        }
      });

      // 删除所有处理任务
      await this.prismaService.processingTask.deleteMany({});

      // 删除所有拆分事件
      await this.prismaService.splitEvent.deleteMany({});

      return {
        success: true,
        message: `已清空 ${updatedCount.count} 条分析结果`,
      };
    } catch (error) {
      this.logger.error('清空分析结果时出错:', error);
      return {
        success: false,
        message: '清空分析结果失败',
        error: error.message
      };
    }
  }
}
