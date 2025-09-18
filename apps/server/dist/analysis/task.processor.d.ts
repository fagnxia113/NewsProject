import { PrismaService } from '@server/prisma/prisma.service';
import { AnalysisService } from './analysis.service';
export declare class TaskProcessor {
    private readonly analysisService;
    private readonly prismaService;
    private readonly logger;
    constructor(analysisService: AnalysisService, prismaService: PrismaService);
    private processBatchArticleTask;
    private performDailyAnalysis;
}
