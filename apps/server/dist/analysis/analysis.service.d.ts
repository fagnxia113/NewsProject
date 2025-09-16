import { PrismaService } from '@server/prisma/prisma.service';
export declare class AnalysisService {
    private prismaService;
    private logger;
    constructor(prismaService: PrismaService);
    createProcessingTask(): Promise<any>;
    getStats(): Promise<any>;
    listIndustries(): Promise<any>;
    listNewsTypes(): Promise<any>;
    getClassifiedArticles(params: {
        industry?: string;
        newsType?: string;
        startDate?: string;
        endDate?: string;
        keyword?: string;
        page?: number;
        limit?: number;
    }): Promise<any>;
    processNewArticles(): Promise<any>;
    listTasks(params: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<any>;
    getTask(id: string): Promise<any>;
    getArticle(id: string): Promise<any>;
    getArticleAnalysis(id: string): Promise<any>;
    processArticle(articleId: string): Promise<any>;
    batchProcessArticles(articleIds: string[]): Promise<any>;
    performDailyAnalysis(date: Date): Promise<any>;
    batchProcess(): Promise<any>;
    deleteAnalysisResults(articleIds: string[]): Promise<any>;
    clearAnalysisResults(): Promise<any>;
}
