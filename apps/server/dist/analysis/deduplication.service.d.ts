import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@server/configuration';
export declare class DeduplicationService {
    private readonly prismaService;
    private readonly configService;
    private readonly logger;
    private readonly similarityThreshold;
    private enableLLMDeduplication;
    constructor(prismaService: PrismaService, configService: ConfigService<ConfigurationType>);
    checkDuplicate(articleId: string): Promise<{
        success: boolean;
        isDuplicate: boolean;
        duplicateGroupId: any;
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
    private calculateSimilarity;
    private calculateTextSimilarity;
    private extractWords;
    private calculateLCSSimilarity;
    private checkDuplicateWithLLM;
    private buildDuplicateCheckPrompt;
    private parseDuplicateCheckResult;
    private checkDuplicateWithTraditionalMethod;
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
}
