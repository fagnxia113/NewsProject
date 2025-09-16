"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TaskProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskProcessor = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const analysis_service_1 = require("./analysis.service");
let TaskProcessor = TaskProcessor_1 = class TaskProcessor {
    constructor(analysisService, prismaService) {
        this.analysisService = analysisService;
        this.prismaService = prismaService;
        this.logger = new common_1.Logger(TaskProcessor_1.name);
    }
    async handleCron() {
        this.logger.debug('开始执行定时分析任务');
        try {
            const pendingTasks = await this.prismaService.processingTask.findMany({
                where: {
                    status: 0,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            this.logger.debug(`找到${pendingTasks.length}个待处理的任务`);
            for (const task of pendingTasks) {
                try {
                    this.logger.debug(`开始处理任务: ${task.id}`);
                    await this.prismaService.processingTask.update({
                        where: { id: task.id },
                        data: { status: 1 },
                    });
                    await this.processBatchArticleTask(task);
                    await this.prismaService.processingTask.update({
                        where: { id: task.id },
                        data: {
                            status: 2,
                            endTime: Math.floor(Date.now() / 1000),
                        },
                    });
                    this.logger.debug(`任务处理完成: ${task.id}`);
                }
                catch (error) {
                    this.logger.error(`处理任务失败: ${task.id}`, error.stack);
                    await this.prismaService.processingTask.update({
                        where: { id: task.id },
                        data: {
                            status: 3,
                            errorMessage: error.message,
                            endTime: Math.floor(Date.now() / 1000),
                        },
                    });
                }
            }
            const now = new Date();
            if (now.getHours() === 2 && now.getMinutes() < 5) {
                await this.performDailyAnalysis();
            }
        }
        catch (error) {
            this.logger.error('执行定时任务时发生错误', error.stack);
        }
        this.logger.debug('定时分析任务执行完成');
    }
    async processBatchArticleTask(task) {
        const unprocessedArticles = await this.prismaService.article.findMany({
            where: {
                isProcessed: false
            },
            take: task.totalArticles || 10,
            orderBy: {
                publishTime: 'desc'
            }
        });
        if (unprocessedArticles.length === 0) {
            this.logger.debug('没有需要处理的文章');
            return;
        }
        await this.prismaService.processingTask.update({
            where: { id: task.id },
            data: {
                totalArticles: unprocessedArticles.length,
            },
        });
        let processedCount = 0;
        let successCount = 0;
        let failedCount = 0;
        let splitCount = 0;
        let duplicateCount = 0;
        let filterCount = 0;
        for (const article of unprocessedArticles) {
            try {
                const result = await this.analysisService.processArticle(article.id);
                processedCount++;
                if (result.success) {
                    successCount++;
                    if (result.splitEvents) {
                        splitCount += result.splitEvents.length;
                    }
                    if (result.isDuplicate) {
                        duplicateCount++;
                    }
                    if (result.isFiltered) {
                        filterCount++;
                    }
                }
                if (processedCount % 10 === 0) {
                    await this.prismaService.processingTask.update({
                        where: { id: task.id },
                        data: {
                            processedArticles: processedCount,
                            successArticles: successCount,
                            failedArticles: failedCount,
                            splitCount: splitCount,
                            duplicateCount: duplicateCount,
                            filterCount: filterCount,
                        },
                    });
                }
            }
            catch (error) {
                this.logger.error(`处理文章失败: ${article.id}`, error);
                processedCount++;
                failedCount++;
            }
        }
        await this.prismaService.processingTask.update({
            where: { id: task.id },
            data: {
                processedArticles: processedCount,
                successArticles: successCount,
                failedArticles: failedCount,
                splitCount: splitCount,
                duplicateCount: duplicateCount,
                filterCount: filterCount,
            },
        });
    }
    async performDailyAnalysis() {
        try {
            this.logger.debug('开始执行每日分析');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            await this.analysisService.performDailyAnalysis(yesterday);
            this.logger.debug('每日分析执行完成');
        }
        catch (error) {
            this.logger.error('执行每日分析时发生错误', error.stack);
        }
    }
};
exports.TaskProcessor = TaskProcessor;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskProcessor.prototype, "handleCron", null);
exports.TaskProcessor = TaskProcessor = TaskProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [analysis_service_1.AnalysisService,
        prisma_service_1.PrismaService])
], TaskProcessor);
//# sourceMappingURL=task.processor.js.map