import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@server/configuration';
export declare class CrawlerService {
    private readonly prismaService;
    private readonly configService;
    private readonly logger;
    private readonly baseUrl;
    private readonly headers;
    constructor(prismaService: PrismaService, configService: ConfigService<ConfigurationType>);
    crawlArticleContent(articleId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        data?: undefined;
    }>;
    batchCrawlArticleContent(articleIds: string[]): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    crawlMpArticles(mpId: string, limit?: number): Promise<{
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
    private fetchArticleContent;
    private fetchMpArticles;
    private delay;
}
