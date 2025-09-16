import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@server/configuration';
export declare class LlmService {
    private readonly prismaService;
    private readonly configService;
    private readonly logger;
    constructor(prismaService: PrismaService, configService: ConfigService<ConfigurationType>);
    private getActiveLLMConfig;
    analyzeArticle(articleId: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    private buildAnalysisPrompt;
    private callLlmApi;
    private parseAnalysisResponse;
    private saveEvents;
}
