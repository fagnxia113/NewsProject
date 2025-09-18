import { router, procedure } from '@server/trpc/trpc';
import { AnalysisService } from './analysis.service';
import { TRPCError } from '@trpc/server';
import { PrismaService } from '@server/prisma/prisma.service';
import { z } from 'zod';

// 创建服务实例
const prismaService = new PrismaService();
const analysisService = new AnalysisService(prismaService);

// 文章分析相关的TRPC路由
const analysisRouter = router({
  // 获取统计数据
  getStats: procedure
    .input(z.object({
      days: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        // 获取指定天数内的统计数据
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - input.days);

        // 获取文章总数
        const totalArticles = await prismaService.article.count({
          where: {
            publishTime: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(endDate.getTime() / 1000),
            },
          },
        });

        // 获取已处理文章数
        const processedArticles = await prismaService.article.count({
          where: {
            publishTime: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(endDate.getTime() / 1000),
            },
            isProcessed: true,
          },
        });

        // 获取投融资事件数
        const investmentCount = await prismaService.article.count({
          where: {
            publishTime: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(endDate.getTime() / 1000),
            },
            newsType: 'investment',
            isProcessed: true,
          },
        });

        // 获取政策事件数
        const policyCount = await prismaService.article.count({
          where: {
            publishTime: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(endDate.getTime() / 1000),
            },
            newsType: 'policy',
            isProcessed: true,
          },
        });

        // 获取拆分事件数
        const splitCount = await prismaService.splitEvent.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        // 计算增长率（这里使用模拟数据）
        const articleGrowth = Math.floor(Math.random() * 20) - 5; // -5% 到 15%
        
        // 计算投融资占比
        const investmentProportion = processedArticles > 0 
          ? Math.round((investmentCount / processedArticles) * 100) 
          : 0;

        // 行业分布数据
        const industryDistribution = await prismaService.article.groupBy({
          by: ['industry'],
          where: {
            publishTime: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(endDate.getTime() / 1000),
            },
            isProcessed: true,
            industry: {
              not: null,
            },
          },
          _count: {
            id: true,
          },
        });

        // 类型分布数据
        const typeDistribution = await prismaService.article.groupBy({
          by: ['newsType'],
          where: {
            publishTime: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(endDate.getTime() / 1000),
            },
            isProcessed: true,
            newsType: {
              not: null,
            },
          },
          _count: {
            id: true,
          },
        });

        // 月度趋势数据
        const monthlyTrends: Array<{month: string, count: number}> = [];
        for (let i = input.days; i >= 0; i -= 30) {
          const monthStart = new Date();
          monthStart.setDate(monthStart.getDate() - i);
          
          const monthEnd = new Date(monthStart);
          monthEnd.setDate(monthEnd.getDate() + 30);
          
          const count = await prismaService.article.count({
            where: {
              publishTime: {
                gte: Math.floor(monthStart.getTime() / 1000),
                lte: Math.floor(monthEnd.getTime() / 1000),
              },
              isProcessed: true,
            },
          });
          
          monthlyTrends.push({
            month: monthStart.toLocaleDateString('zh-CN', { month: 'short' }),
            count,
          });
        }

        // 关键词数据（模拟）
        const topKeywords = ['人工智能', '数字化转型', '可持续发展', '新能源', '生物技术'];
        const keywordFrequencies = [120, 95, 78, 65, 52];
        
        // 新兴话题（模拟）
        const emergingTopics = [
          { name: '量子计算', growth: 45 },
          { name: '元宇宙', growth: 32 },
          { name: '自动驾驶', growth: 28 },
          { name: '区块链', growth: 15 },
        ];

        return {
          totalArticles,
          processedArticles,
          investmentCount,
          policyCount,
          splitCount,
          articleGrowth,
          investmentProportion,
          industryDistribution: industryDistribution.map(item => ({
            name: item.industry || '未分类',
            value: item._count.id,
          })),
          typeDistribution: typeDistribution.map(item => ({
            name: item.newsType || '未分类',
            count: item._count.id,
          })),
          monthlyTrends,
          topKeywords,
          keywordFrequencies,
          emergingTopics,
        };
      } catch (error) {
        console.error('获取统计数据失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取统计数据失败',
          cause: error,
        });
      }
    }),

  // 获取行业列表
  listIndustries: procedure
    .input(z.object({
      activeOnly: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await analysisService.listIndustries();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取行业列表失败',
          cause: error,
        });
      }
    }),

  // 获取新闻类型列表
  listNewsTypes: procedure
    .input(z.object({
      activeOnly: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await analysisService.listNewsTypes();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取新闻类型列表失败',
          cause: error,
        });
      }
    }),

  // 获取已分类文章
  getClassifiedArticles: procedure
    .input(z.object({
      industry: z.string().optional(),
      newsType: z.string().optional(),
      page: z.number(),
      pageSize: z.number(),
      startDate: z.number().optional(),
      endDate: z.number().optional(),
      keyword: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const { industry, newsType, page, pageSize, startDate, endDate, keyword } = input;
        const skip = (page - 1) * pageSize;

        // 构建查询条件
        const where: any = {
          isProcessed: true,
        };

        // 添加时间范围筛选
        if (startDate && endDate) {
          where.publishTime = {
            gte: startDate,
            lte: endDate,
          };
        }

        if (industry && industry !== 'all') {
          where.industry = industry;
        }

        if (newsType && newsType !== 'all') {
          where.newsType = newsType;
        }

        // 添加关键词筛选
        if (keyword) {
          where.OR = [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ];
        }

        // 获取文章总数
        const total = await prismaService.article.count({ where });

        // 获取文章列表
        const articles = await prismaService.article.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: {
            publishTime: 'desc',
          },
        });

        // 获取所有文章的Feed信息
        const feedIds = articles.map(article => article.mpId).filter(Boolean);
        const feeds = await prismaService.feed.findMany({
          where: {
            id: {
              in: feedIds,
            },
          },
          select: {
            id: true,
            mpName: true,
            mpCover: true,
          },
        });

        // 创建Feed映射
        const feedMap = new Map();
        feeds.forEach(feed => {
          feedMap.set(feed.id, feed);
        });

        // 格式化返回数据
        const data = articles.map(article => {
          const feed = feedMap.get(article.mpId);
          return {
            id: article.id,
            title: article.title,
            mpName: feed?.mpName,
            mpCover: feed?.mpCover,
            industry: article.industry,
            newsType: article.newsType,
            publishTime: article.publishTime,
            isDuplicate: article.isDuplicate,
            confidence: article.confidence,
            processedTime: article.processedTime,
          };
        });

        return {
          data,
          total,
          page,
          pageSize,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取已分类文章失败',
          cause: error,
        });
      }
    }),

  // 处理新文章
  processNewArticles: procedure
    .input(z.object({
      days: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 创建处理任务
        const task = await analysisService.createProcessingTask();
        
        // 计算时间范围内的文章数
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - input.days);
        
        const totalArticles = await prismaService.article.count({
          where: {
            publishTime: {
              gte: Math.floor(startDate.getTime() / 1000),
              lte: Math.floor(endDate.getTime() / 1000),
            },
            isProcessed: false,
          },
        });
        
        // 异步执行批量处理
        setTimeout(async () => {
          try {
            // 这里简化实现，不实际执行批量处理
            console.log(`任务 ${task.id} 已开始异步执行，处理 ${totalArticles} 篇文章`);
          } catch (err) {
            console.error(`批量处理失败:`, err);
          }
        }, 100);
        
        return {
          taskId: task.id,
          totalArticles,
          message: '任务已开始执行'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '处理新文章失败',
          cause: error,
        });
      }
    }),

  // 获取任务详情
  getTask: procedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        // 从数据库获取真实的任务数据
        const task = await prismaService.processingTask.findUnique({
          where: { id: input.id },
        });
        
        if (!task) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '任务不存在',
          });
        }
        
        return {
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
          filterCount: task.filterCount,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取任务详情失败',
          cause: error,
        });
      }
    }),

  // 获取文章详情
  getArticle: procedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const article = await prismaService.article.findUnique({
          where: { id: input.id },
        });

        if (!article) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '文章不存在',
          });
        }

        // 获取关联的Feed信息
        const feed = await prismaService.feed.findUnique({
          where: { id: article.mpId },
          select: {
            id: true,
            mpName: true,
            mpCover: true,
          },
        });

        return {
          id: article.id,
          title: article.title,
          content: article.content,
          mpName: feed?.mpName,
          mpCover: feed?.mpCover,
          industry: article.industry,
          newsType: article.newsType,
          publishTime: article.publishTime,
          isProcessed: article.isProcessed,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取文章详情失败',
          cause: error,
        });
      }
    }),

  // 获取文章分析结果
  getArticleAnalysis: procedure
    .input(z.object({
      articleId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        // 这里简化实现，返回模拟的分析结果
        return {
          id: `analysis_${input.articleId}`,
          articleId: input.articleId,
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取文章分析结果失败',
          cause: error,
        });
      }
    }),

  // 处理单篇文章
  processArticle: procedure
    .input(z.object({
      articleId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await analysisService.processArticle(input.articleId);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '处理文章失败',
          cause: error,
        });
      }
    }),
  // 创建处理任务
  createTask: procedure
    .input(z.object({})).meta({ openapi: { method: 'POST', path: '/analysis/task' } })
    .output(z.object({
      id: z.string(),
      status: z.number(),
      startTime: z.number(),
      totalArticles: z.number(),
    }))
    .mutation(async () => {
      try {
        return await analysisService.createProcessingTask();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '创建处理任务失败',
          cause: error,
        });
      }
    }),

  // 获取任务列表
  listTasks: procedure
    .input(z.object({
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      status: z.number().optional(),
    })).meta({ openapi: { method: 'GET', path: '/analysis/tasks' } })
    .output(z.object({
      data: z.array(z.object({
        id: z.string(),
        status: z.number(),
        startTime: z.number(),
        endTime: z.number().nullable(),
        totalArticles: z.number(),
        processedArticles: z.number(),
        successArticles: z.number(),
        failedArticles: z.number(),
        splitCount: z.number(),
        duplicateCount: z.number(),
      })),
      total: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        // 构建查询条件
        const where: any = {};
        if (input.status !== undefined) {
          where.status = input.status;
        }

        // 计算分页参数
        const skip = (input.page - 1) * input.pageSize;
        const take = input.pageSize;

        // 查询任务列表
        const [tasks, total] = await Promise.all([
          prismaService.processingTask.findMany({
            where,
            skip,
            take,
            orderBy: {
              createdAt: 'desc',
            },
          }),
          prismaService.processingTask.count({ where }),
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
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取任务列表失败',
          cause: error,
        });
      }
    }),

  // 批量处理指定文章
  batchProcessArticles: procedure
    .input(z.object({
      articleIds: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      try {
        // 创建处理任务
        const task = await analysisService.createProcessingTask();
        
        // 获取要处理的文章数量
        const totalArticles = input.articleIds.length;
        
        // 异步执行批量处理
        setTimeout(async () => {
          try {
            console.log(`任务 ${task.id} 已开始异步执行，处理 ${totalArticles} 篇指定文章`);
            
            // 这里简化实现，实际应该调用分析服务处理每篇文章
            for (const articleId of input.articleIds) {
              try {
                await analysisService.processArticle(articleId);
              } catch (err) {
                console.error(`处理文章 ${articleId} 失败:`, err);
              }
            }
            
            console.log(`任务 ${task.id} 已完成`);
          } catch (err) {
            console.error(`批量处理失败:`, err);
          }
        }, 100);
        
        return {
          taskId: task.id,
          totalArticles,
          message: '任务已开始执行'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '批量处理指定文章失败',
          cause: error,
        });
      }
    }),

  // 批量处理文章 - 简化版
  batchProcess: procedure
    .input(z.object({
      limit: z.number().optional().default(100),
    })).meta({ openapi: { method: 'POST', path: '/analysis/batch-process' } })
    .output(z.object({
      taskId: z.string(),
      totalArticles: z.number(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 创建任务
        const task = await analysisService.createProcessingTask();
        
        // 异步执行批量处理
        setTimeout(async () => {
          try {
            // 这里简化实现，不实际执行批量处理
            console.log(`任务 ${task.id} 已开始异步执行`);
          } catch (err) {
            console.error(`批量处理失败:`, err);
          }
        }, 100);
        
        return {
          taskId: task.id,
          totalArticles: 0,
          message: '任务已开始执行'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '批量处理失败',
          cause: error,
        });
      }
    }),

  // 删除分析结果
  deleteAnalysisResults: procedure
    .input(z.object({
      articleIds: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      try {
        return await analysisService.deleteAnalysisResults(input.articleIds);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '删除分析结果失败',
          cause: error,
        });
      }
    }),

  // 清空分析结果
  clearAnalysisResults: procedure
    .input(z.object({}))
    .mutation(async () => {
      try {
        return await analysisService.clearAnalysisResults();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '清空分析结果失败',
          cause: error,
        });
      }
    }),
});

export default analysisRouter;
