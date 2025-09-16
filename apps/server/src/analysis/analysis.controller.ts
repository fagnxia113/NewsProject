import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { LlmService } from './llm.service';
import { CrawlerService } from './crawler.service';
import { DeduplicationService } from './deduplication.service';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly llmService: LlmService,
    private readonly crawlerService: CrawlerService,
    private readonly deduplicationService: DeduplicationService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.analysisService.getStats();
  }

  @Get('industries')
  async listIndustries() {
    return this.analysisService.listIndustries();
  }

  @Get('articles')
  async getClassifiedArticles(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('industry') industry?: string,
    @Query('newsType') newsType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('keyword') keyword?: string,
  ) {
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

  @Post('process-new')
  async processNewArticles() {
    return this.analysisService.processNewArticles();
  }

  @Get('tasks')
  async listTasks(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.analysisService.listTasks({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      status,
    });
  }

  @Get('tasks/:id')
  async getTask(@Param('id') id: string) {
    return this.analysisService.getTask(id);
  }

  @Get('articles/:id')
  async getArticle(@Param('id') id: string) {
    return this.analysisService.getArticle(id);
  }

  @Get('articles/:id/analysis')
  async getArticleAnalysis(@Param('id') id: string) {
    return this.analysisService.getArticleAnalysis(id);
  }

  @Post('articles/:id/process')
  async processArticle(@Param('id') id: string) {
    return this.analysisService.processArticle(id);
  }

  @Post('articles/batch-process')
  async batchProcessArticles(@Body('articleIds') articleIds: string[]) {
    return this.analysisService.batchProcessArticles(articleIds);
  }

  @Post('articles/batch-process-all')
  async batchProcessAllArticles() {
    return this.analysisService.batchProcess();
  }

  @Post('articles/:id/crawl')
  async crawlArticle(@Param('id') id: string) {
    return this.crawlerService.crawlArticleContent(id);
  }

  @Post('articles/batch-crawl')
  async batchCrawlArticles(@Body('articleIds') articleIds: string[]) {
    return this.crawlerService.batchCrawlArticleContent(articleIds);
  }

  @Post('mp/:mpId/crawl')
  async crawlMpArticles(@Param('mpId') mpId: string) {
    return this.crawlerService.crawlMpArticles(mpId);
  }

  @Post('articles/:id/deduplicate')
  async checkDuplicate(@Param('id') id: string) {
    return this.deduplicationService.checkDuplicate(id);
  }

  @Post('articles/batch-deduplicate')
  async batchCheckDuplicates(@Body('articleIds') articleIds: string[]) {
    return this.deduplicationService.batchCheckDuplicates(articleIds);
  }

  @Get('articles/duplicate-stats')
  async getDuplicateStats() {
    return this.deduplicationService.getDuplicateStats();
  }

  @Post('articles/:id/analyze')
  async analyzeArticle(@Param('id') id: string) {
    return this.llmService.analyzeArticle(id);
  }

  @Post('articles/batch-analyze')
  async batchAnalyzeArticles(@Body('articleIds') articleIds: string[]) {
    const results: any[] = [];
    for (const articleId of articleIds) {
      try {
        const result = await this.llmService.analyzeArticle(articleId);
        results.push({
          articleId,
          success: true,
          data: result,
        });
      } catch (error) {
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
}