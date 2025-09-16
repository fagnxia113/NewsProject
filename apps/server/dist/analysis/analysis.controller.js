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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisController = void 0;
const common_1 = require("@nestjs/common");
const analysis_service_1 = require("./analysis.service");
const llm_service_1 = require("./llm.service");
const crawler_service_1 = require("./crawler.service");
const deduplication_service_1 = require("./deduplication.service");
let AnalysisController = class AnalysisController {
    constructor(analysisService, llmService, crawlerService, deduplicationService) {
        this.analysisService = analysisService;
        this.llmService = llmService;
        this.crawlerService = crawlerService;
        this.deduplicationService = deduplicationService;
    }
    async getStats() {
        return this.analysisService.getStats();
    }
    async listIndustries() {
        return this.analysisService.listIndustries();
    }
    async getClassifiedArticles(page, limit, industry, newsType, startDate, endDate, keyword) {
        return this.analysisService.getClassifiedArticles({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            industry,
            newsType,
            startDate,
            endDate,
            keyword,
        });
    }
    async processNewArticles() {
        return this.analysisService.processNewArticles();
    }
    async listTasks(page, limit, status) {
        return this.analysisService.listTasks({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            status,
        });
    }
    async getTask(id) {
        return this.analysisService.getTask(id);
    }
    async getArticle(id) {
        return this.analysisService.getArticle(id);
    }
    async getArticleAnalysis(id) {
        return this.analysisService.getArticleAnalysis(id);
    }
    async processArticle(id) {
        return this.analysisService.processArticle(id);
    }
    async batchProcessArticles(articleIds) {
        return this.analysisService.batchProcessArticles(articleIds);
    }
    async batchProcessAllArticles() {
        return this.analysisService.batchProcess();
    }
    async crawlArticle(id) {
        return this.crawlerService.crawlArticleContent(id);
    }
    async batchCrawlArticles(articleIds) {
        return this.crawlerService.batchCrawlArticleContent(articleIds);
    }
    async crawlMpArticles(mpId) {
        return this.crawlerService.crawlMpArticles(mpId);
    }
    async checkDuplicate(id) {
        return this.deduplicationService.checkDuplicate(id);
    }
    async batchCheckDuplicates(articleIds) {
        return this.deduplicationService.batchCheckDuplicates(articleIds);
    }
    async getDuplicateStats() {
        return this.deduplicationService.getDuplicateStats();
    }
    async analyzeArticle(id) {
        return this.llmService.analyzeArticle(id);
    }
    async batchAnalyzeArticles(articleIds) {
        const results = [];
        for (const articleId of articleIds) {
            try {
                const result = await this.llmService.analyzeArticle(articleId);
                results.push({
                    articleId,
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                results.push({
                    articleId,
                    success: false,
                    error: error.message,
                });
            }
        }
        return {
            success: true,
            message: `批量分析完成，成功 ${results.filter(r => r.success).length} 篇，失败 ${results.filter(r => !r.success).length} 篇`,
            data: results,
        };
    }
};
exports.AnalysisController = AnalysisController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('industries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "listIndustries", null);
__decorate([
    (0, common_1.Get)('articles'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('industry')),
    __param(3, (0, common_1.Query)('newsType')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getClassifiedArticles", null);
__decorate([
    (0, common_1.Post)('process-new'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "processNewArticles", null);
__decorate([
    (0, common_1.Get)('tasks'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "listTasks", null);
__decorate([
    (0, common_1.Get)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getTask", null);
__decorate([
    (0, common_1.Get)('articles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getArticle", null);
__decorate([
    (0, common_1.Get)('articles/:id/analysis'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getArticleAnalysis", null);
__decorate([
    (0, common_1.Post)('articles/:id/process'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "processArticle", null);
__decorate([
    (0, common_1.Post)('articles/batch-process'),
    __param(0, (0, common_1.Body)('articleIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "batchProcessArticles", null);
__decorate([
    (0, common_1.Post)('articles/batch-process-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "batchProcessAllArticles", null);
__decorate([
    (0, common_1.Post)('articles/:id/crawl'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "crawlArticle", null);
__decorate([
    (0, common_1.Post)('articles/batch-crawl'),
    __param(0, (0, common_1.Body)('articleIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "batchCrawlArticles", null);
__decorate([
    (0, common_1.Post)('mp/:mpId/crawl'),
    __param(0, (0, common_1.Param)('mpId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "crawlMpArticles", null);
__decorate([
    (0, common_1.Post)('articles/:id/deduplicate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "checkDuplicate", null);
__decorate([
    (0, common_1.Post)('articles/batch-deduplicate'),
    __param(0, (0, common_1.Body)('articleIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "batchCheckDuplicates", null);
__decorate([
    (0, common_1.Get)('articles/duplicate-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getDuplicateStats", null);
__decorate([
    (0, common_1.Post)('articles/:id/analyze'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "analyzeArticle", null);
__decorate([
    (0, common_1.Post)('articles/batch-analyze'),
    __param(0, (0, common_1.Body)('articleIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "batchAnalyzeArticles", null);
exports.AnalysisController = AnalysisController = __decorate([
    (0, common_1.Controller)('analysis'),
    __metadata("design:paramtypes", [analysis_service_1.AnalysisService,
        llm_service_1.LlmService,
        crawler_service_1.CrawlerService,
        deduplication_service_1.DeduplicationService])
], AnalysisController);
//# sourceMappingURL=analysis.controller.js.map