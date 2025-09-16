"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalysisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalysisService = AnalysisService_1 = class AnalysisService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.logger = new common_1.Logger(AnalysisService_1.name);
    }
    async createProcessingTask() {
        try {
            return {
                id: `task_${Date.now()}`,
                status: 0,
                startTime: Math.floor(Date.now() / 1000),
                totalArticles: 0
            };
        }
        catch (error) {
            this.logger.error('创建处理任务失败:', error);
            throw error;
        }
    }
    async getStats() {
        try {
            const totalArticles = await this.prismaService.article.count();
            const processedArticles = await this.prismaService.article.count({
                where: { isProcessed: true }
            });
            const unprocessedArticles = await this.prismaService.article.count({
                where: { isProcessed: false }
            });
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayArticles = await this.prismaService.article.count({
                where: {
                    publishTime: {
                        gte: Math.floor(today.getTime() / 1000)
                    }
                }
            });
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
        }
        catch (error) {
            this.logger.error('获取统计数据失败:', error);
            throw error;
        }
    }
    async listIndustries() {
        try {
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
        }
        catch (error) {
            this.logger.error('获取行业列表失败:', error);
            throw error;
        }
    }
    async listNewsTypes() {
        try {
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
        }
        catch (error) {
            this.logger.error('获取新闻类型列表失败:', error);
            throw error;
        }
    }
    async getClassifiedArticles(params) {
        try {
            const page = params.page || 1;
            const limit = params.limit || 20;
            const skip = (page - 1) * limit;
            const where = {};
            if (params.industry) {
            }
            if (params.newsType) {
            }
            if (params.keyword) {
            }
            if (params.startDate && params.endDate) {
                const startTimestamp = Math.floor(new Date(params.startDate).getTime() / 1000);
                const endTimestamp = Math.floor(new Date(params.endDate).getTime() / 1000);
                where.publishTime = {
                    gte: startTimestamp,
                    lte: endTimestamp
                };
            }
            else if (params.startDate) {
                const startTimestamp = Math.floor(new Date(params.startDate).getTime() / 1000);
                where.publishTime = {
                    gte: startTimestamp
                };
            }
            else if (params.endDate) {
                const endTimestamp = Math.floor(new Date(params.endDate).getTime() / 1000);
                where.publishTime = {
                    lte: endTimestamp
                };
            }
            const total = await this.prismaService.article.count({ where });
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
        }
        catch (error) {
            this.logger.error('获取分类文章失败:', error);
            throw error;
        }
    }
    async processNewArticles() {
        try {
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
            setTimeout(async () => {
                try {
                    let processedCount = 0;
                    for (const article of unprocessedArticles) {
                        await this.processArticle(article.id);
                        processedCount++;
                        if (processedCount % 10 === 0) {
                            this.logger.debug(`已处理 ${processedCount}/${unprocessedArticles.length} 篇文章`);
                        }
                    }
                    this.logger.debug(`任务 ${task.id} 完成，共处理 ${processedCount} 篇文章`);
                }
                catch (error) {
                    this.logger.error(`处理新文章任务失败:`, error);
                }
            }, 100);
            return {
                taskId: task.id,
                totalArticles: unprocessedArticles.length,
                message: '任务已开始执行'
            };
        }
        catch (error) {
            this.logger.error('处理新文章失败:', error);
            return {
                success: false,
                message: '处理新文章失败',
                error: error.message
            };
        }
    }
    async listTasks(params) {
        try {
            const page = params.page || 1;
            const limit = params.limit || 20;
            const skip = (page - 1) * limit;
            const where = {};
            if (params.status) {
                where.status = parseInt(params.status);
            }
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
        }
        catch (error) {
            this.logger.error('获取任务列表失败:', error);
            throw error;
        }
    }
    async getTask(id) {
        try {
            return {
                id,
                status: 2,
                startTime: Math.floor(Date.now() / 1000) - 3600,
                endTime: Math.floor(Date.now() / 1000),
                totalArticles: 10,
                processedArticles: 10,
                successArticles: 10,
                failedArticles: 0,
                splitCount: 0,
                duplicateCount: 0
            };
        }
        catch (error) {
            this.logger.error('获取任务详情失败:', error);
            throw error;
        }
    }
    async getArticle(id) {
        try {
            const article = await this.prismaService.article.findUnique({
                where: { id }
            });
            if (!article) {
                throw new Error('文章不存在');
            }
            return article;
        }
        catch (error) {
            this.logger.error('获取文章详情失败:', error);
            throw error;
        }
    }
    async getArticleAnalysis(id) {
        try {
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
        }
        catch (error) {
            this.logger.error('获取文章分析结果失败:', error);
            throw error;
        }
    }
    async processArticle(articleId) {
        try {
            const article = await this.prismaService.article.findUnique({ where: { id: articleId } });
            if (!article) {
                return { success: false, error: '文章不存在' };
            }
            if (article.isProcessed) {
                return { success: true, message: '文章已处理' };
            }
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
            const llmService = new (await Promise.resolve().then(() => __importStar(require('./llm.service')))).LlmService(this.prismaService, {
                get: (key) => config[key],
            });
            const analysisResult = await llmService.analyzeArticle(articleId);
            if (!analysisResult.success) {
                return { success: false, error: analysisResult.error };
            }
            const deduplicationService = new (await Promise.resolve().then(() => __importStar(require('./deduplication.service')))).DeduplicationService(this.prismaService, {
                get: (key) => config[key],
            });
            const duplicateResult = await deduplicationService.checkDuplicate(articleId);
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
        }
        catch (error) {
            this.logger.error('处理文章时出错:', error);
            return { success: false, error: error.message };
        }
    }
    async batchProcessArticles(articleIds) {
        try {
            if (articleIds.length === 0) {
                return {
                    success: false,
                    message: '未提供文章ID'
                };
            }
            const task = await this.createProcessingTask();
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
                        if (processedCount % 10 === 0) {
                            this.logger.debug(`已处理 ${processedCount}/${articleIds.length} 篇文章`);
                        }
                    }
                    this.logger.debug(`任务 ${task.id} 完成，共处理 ${processedCount} 篇文章，成功 ${successCount} 篇`);
                }
                catch (error) {
                    this.logger.error(`批量处理文章任务失败:`, error);
                }
            }, 100);
            return {
                taskId: task.id,
                totalArticles: articleIds.length,
                message: '任务已开始执行'
            };
        }
        catch (error) {
            this.logger.error('批量处理文章失败:', error);
            return {
                success: false,
                message: '批量处理文章失败',
                error: error.message
            };
        }
    }
    async performDailyAnalysis(date) {
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
        }
        catch (error) {
            this.logger.error('执行每日分析时出错:', error);
            return null;
        }
    }
    async batchProcess() {
        try {
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
            const results = [];
            for (const article of unprocessedArticles) {
                try {
                    const result = await this.processArticle(article.id);
                    results.push({
                        articleId: article.id,
                        success: result.success,
                        data: result
                    });
                }
                catch (error) {
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
        }
        catch (error) {
            this.logger.error('批量处理文章时出错:', error);
            return {
                success: false,
                message: '批量处理失败',
                error: error.message
            };
        }
    }
    async deleteAnalysisResults(articleIds) {
        try {
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
        }
        catch (error) {
            this.logger.error('删除分析结果时出错:', error);
            return {
                success: false,
                message: '删除分析结果失败',
                error: error.message
            };
        }
    }
    async clearAnalysisResults() {
        try {
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
            await this.prismaService.processingTask.deleteMany({});
            await this.prismaService.splitEvent.deleteMany({});
            return {
                success: true,
                message: `已清空 ${updatedCount.count} 条分析结果`,
            };
        }
        catch (error) {
            this.logger.error('清空分析结果时出错:', error);
            return {
                success: false,
                message: '清空分析结果失败',
                error: error.message
            };
        }
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = AnalysisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map