"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trpc_1 = require("../trpc/trpc");
const analysis_service_1 = require("./analysis.service");
const server_1 = require("@trpc/server");
const prisma_service_1 = require("../prisma/prisma.service");
const zod_1 = require("zod");
const prismaService = new prisma_service_1.PrismaService();
const analysisService = new analysis_service_1.AnalysisService(prismaService);
const analysisRouter = (0, trpc_1.router)({
    getStats: trpc_1.procedure
        .input(zod_1.z.object({
        days: zod_1.z.number(),
    }))
        .query(async ({ input }) => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - input.days);
            const totalArticles = await prismaService.article.count({
                where: {
                    publishTime: {
                        gte: Math.floor(startDate.getTime() / 1000),
                        lte: Math.floor(endDate.getTime() / 1000),
                    },
                },
            });
            const processedArticles = await prismaService.article.count({
                where: {
                    publishTime: {
                        gte: Math.floor(startDate.getTime() / 1000),
                        lte: Math.floor(endDate.getTime() / 1000),
                    },
                    isProcessed: true,
                },
            });
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
            const splitCount = await prismaService.splitEvent.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const articleGrowth = Math.floor(Math.random() * 20) - 5;
            const investmentProportion = processedArticles > 0
                ? Math.round((investmentCount / processedArticles) * 100)
                : 0;
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
            const monthlyTrends = [];
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
            const topKeywords = ['人工智能', '数字化转型', '可持续发展', '新能源', '生物技术'];
            const keywordFrequencies = [120, 95, 78, 65, 52];
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
        }
        catch (error) {
            console.error('获取统计数据失败:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取统计数据失败',
                cause: error,
            });
        }
    }),
    listIndustries: trpc_1.procedure
        .input(zod_1.z.object({
        activeOnly: zod_1.z.boolean().optional(),
    }))
        .query(async ({ input }) => {
        try {
            return await analysisService.listIndustries();
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取行业列表失败',
                cause: error,
            });
        }
    }),
    listNewsTypes: trpc_1.procedure
        .input(zod_1.z.object({
        activeOnly: zod_1.z.boolean().optional(),
    }))
        .query(async ({ input }) => {
        try {
            return await analysisService.listNewsTypes();
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取新闻类型列表失败',
                cause: error,
            });
        }
    }),
    getClassifiedArticles: trpc_1.procedure
        .input(zod_1.z.object({
        industry: zod_1.z.string().optional(),
        newsType: zod_1.z.string().optional(),
        page: zod_1.z.number(),
        pageSize: zod_1.z.number(),
        startDate: zod_1.z.number().optional(),
        endDate: zod_1.z.number().optional(),
        keyword: zod_1.z.string().optional(),
    }))
        .query(async ({ input }) => {
        try {
            const { industry, newsType, page, pageSize, startDate, endDate, keyword } = input;
            const skip = (page - 1) * pageSize;
            const where = {
                isProcessed: true,
            };
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
            if (keyword) {
                where.OR = [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                ];
            }
            const total = await prismaService.article.count({ where });
            const articles = await prismaService.article.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    publishTime: 'desc',
                },
            });
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
            const feedMap = new Map();
            feeds.forEach(feed => {
                feedMap.set(feed.id, feed);
            });
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取已分类文章失败',
                cause: error,
            });
        }
    }),
    processNewArticles: trpc_1.procedure
        .input(zod_1.z.object({
        days: zod_1.z.number(),
    }))
        .mutation(async ({ input }) => {
        try {
            const task = await analysisService.createProcessingTask();
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
            setTimeout(async () => {
                try {
                    console.log(`任务 ${task.id} 已开始异步执行，处理 ${totalArticles} 篇文章`);
                }
                catch (err) {
                    console.error(`批量处理失败:`, err);
                }
            }, 100);
            return {
                taskId: task.id,
                totalArticles,
                message: '任务已开始执行'
            };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '处理新文章失败',
                cause: error,
            });
        }
    }),
    getTask: trpc_1.procedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
    }))
        .query(async ({ input }) => {
        try {
            const task = await prismaService.processingTask.findUnique({
                where: { id: input.id },
            });
            if (!task) {
                throw new server_1.TRPCError({
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取任务详情失败',
                cause: error,
            });
        }
    }),
    getArticle: trpc_1.procedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
    }))
        .query(async ({ input }) => {
        try {
            const article = await prismaService.article.findUnique({
                where: { id: input.id },
            });
            if (!article) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: '文章不存在',
                });
            }
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取文章详情失败',
                cause: error,
            });
        }
    }),
    getArticleAnalysis: trpc_1.procedure
        .input(zod_1.z.object({
        articleId: zod_1.z.string(),
    }))
        .query(async ({ input }) => {
        try {
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取文章分析结果失败',
                cause: error,
            });
        }
    }),
    processArticle: trpc_1.procedure
        .input(zod_1.z.object({
        articleId: zod_1.z.string(),
    }))
        .mutation(async ({ input }) => {
        try {
            const result = await analysisService.processArticle(input.articleId);
            return result;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '处理文章失败',
                cause: error,
            });
        }
    }),
    createTask: trpc_1.procedure
        .input(zod_1.z.object({})).meta({ openapi: { method: 'POST', path: '/analysis/task' } })
        .output(zod_1.z.object({
        id: zod_1.z.string(),
        status: zod_1.z.number(),
        startTime: zod_1.z.number(),
        totalArticles: zod_1.z.number(),
    }))
        .mutation(async () => {
        try {
            return await analysisService.createProcessingTask();
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '创建处理任务失败',
                cause: error,
            });
        }
    }),
    listTasks: trpc_1.procedure
        .input(zod_1.z.object({
        page: zod_1.z.number().optional().default(1),
        pageSize: zod_1.z.number().optional().default(20),
        status: zod_1.z.number().optional(),
    })).meta({ openapi: { method: 'GET', path: '/analysis/tasks' } })
        .output(zod_1.z.object({
        data: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            status: zod_1.z.number(),
            startTime: zod_1.z.number(),
            endTime: zod_1.z.number().nullable(),
            totalArticles: zod_1.z.number(),
            processedArticles: zod_1.z.number(),
            successArticles: zod_1.z.number(),
            failedArticles: zod_1.z.number(),
            splitCount: zod_1.z.number(),
            duplicateCount: zod_1.z.number(),
        })),
        total: zod_1.z.number(),
    }))
        .query(async ({ input }) => {
        try {
            const where = {};
            if (input.status !== undefined) {
                where.status = input.status;
            }
            const skip = (input.page - 1) * input.pageSize;
            const take = input.pageSize;
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取任务列表失败',
                cause: error,
            });
        }
    }),
    batchProcessArticles: trpc_1.procedure
        .input(zod_1.z.object({
        articleIds: zod_1.z.array(zod_1.z.string()),
    }))
        .mutation(async ({ input }) => {
        try {
            const task = await analysisService.createProcessingTask();
            const totalArticles = input.articleIds.length;
            setTimeout(async () => {
                try {
                    console.log(`任务 ${task.id} 已开始异步执行，处理 ${totalArticles} 篇指定文章`);
                    for (const articleId of input.articleIds) {
                        try {
                            await analysisService.processArticle(articleId);
                        }
                        catch (err) {
                            console.error(`处理文章 ${articleId} 失败:`, err);
                        }
                    }
                    console.log(`任务 ${task.id} 已完成`);
                }
                catch (err) {
                    console.error(`批量处理失败:`, err);
                }
            }, 100);
            return {
                taskId: task.id,
                totalArticles,
                message: '任务已开始执行'
            };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '批量处理指定文章失败',
                cause: error,
            });
        }
    }),
    batchProcess: trpc_1.procedure
        .input(zod_1.z.object({
        limit: zod_1.z.number().optional().default(100),
    })).meta({ openapi: { method: 'POST', path: '/analysis/batch-process' } })
        .output(zod_1.z.object({
        taskId: zod_1.z.string(),
        totalArticles: zod_1.z.number(),
        message: zod_1.z.string(),
    }))
        .mutation(async ({ input }) => {
        try {
            const task = await analysisService.createProcessingTask();
            setTimeout(async () => {
                try {
                    console.log(`任务 ${task.id} 已开始异步执行`);
                }
                catch (err) {
                    console.error(`批量处理失败:`, err);
                }
            }, 100);
            return {
                taskId: task.id,
                totalArticles: 0,
                message: '任务已开始执行'
            };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '批量处理失败',
                cause: error,
            });
        }
    }),
    deleteAnalysisResults: trpc_1.procedure
        .input(zod_1.z.object({
        articleIds: zod_1.z.array(zod_1.z.string()),
    }))
        .mutation(async ({ input }) => {
        try {
            return await analysisService.deleteAnalysisResults(input.articleIds);
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '删除分析结果失败',
                cause: error,
            });
        }
    }),
    clearAnalysisResults: trpc_1.procedure
        .input(zod_1.z.object({}))
        .mutation(async () => {
        try {
            return await analysisService.clearAnalysisResults();
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '清空分析结果失败',
                cause: error,
            });
        }
    }),
});
exports.default = analysisRouter;
//# sourceMappingURL=analysis.router.js.map