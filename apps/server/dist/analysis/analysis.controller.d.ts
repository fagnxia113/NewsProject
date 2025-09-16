import { AnalysisService } from './analysis.service';
import { LlmService } from './llm.service';
import { CrawlerService } from './crawler.service';
import { DeduplicationService } from './deduplication.service';
export declare class AnalysisController {
    private readonly analysisService;
    private readonly llmService;
    private readonly crawlerService;
    private readonly deduplicationService;
    constructor(analysisService: AnalysisService, llmService: LlmService, crawlerService: CrawlerService, deduplicationService: DeduplicationService);
    getStats(): Promise<any>;
    listIndustries(): Promise<any>;
    getClassifiedArticles(page?: number, limit?: number, industry?: string, newsType?: string, startDate?: string, endDate?: string, keyword?: string): Promise<any>;
    processNewArticles(): Promise<any>;
    listTasks(page?: number, limit?: number, status?: string): Promise<any>;
    getTask(id: string): Promise<any>;
    getArticle(id: string): Promise<any>;
    getArticleAnalysis(id: string): Promise<any>;
    processArticle(id: string): Promise<any>;
    batchProcessArticles(articleIds: string[]): Promise<any>;
    batchProcessAllArticles(): Promise<any>;
    crawlArticle(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            mpId: string;
            title: string;
            content: string | null;
            picUrl: string;
            publishTime: number;
            summary: string | null;
            industry: string | null;
            newsType: string | null;
            confidence: number | null;
            isDuplicate: boolean;
            duplicateGroupId: string | null;
            isProcessed: boolean;
            processedTime: number | null;
            createdAt: Date;
            updatedAt: Date | null;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        data?: undefined;
    }>;
    batchCrawlArticles(articleIds: string[]): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    crawlMpArticles(mpId: string): Promise<{
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        data?: undefined;
    }>;
    checkDuplicate(id: string): Promise<{
        success: boolean;
        isDuplicate: boolean;
        duplicateGroupId: string | null;
        message: string;
        similarity?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        isDuplicate: boolean;
        duplicateGroupId: any;
        similarity: number;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        isDuplicate: boolean;
        message: string;
        duplicateGroupId?: undefined;
        similarity?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        isDuplicate?: undefined;
        duplicateGroupId?: undefined;
        message?: undefined;
        similarity?: undefined;
    }>;
    batchCheckDuplicates(articleIds: string[]): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    getDuplicateStats(): Promise<{
        success: boolean;
        data: {
            totalArticles: number;
            duplicateArticles: number;
            uniqueArticles: number;
            duplicateRate: number;
            topDuplicateGroups: any[];
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    analyzeArticle(id: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    batchAnalyzeArticles(articleIds: string[]): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
}
