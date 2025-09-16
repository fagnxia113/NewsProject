import { Module } from '@nestjs/common';
import { PrismaModule } from '@server/prisma/prisma.module';
import { AnalysisService } from './analysis.service';
import { TaskProcessor } from './task.processor';
import { LlmService } from './llm.service';
import { CrawlerService } from './crawler.service';
import { DeduplicationService } from './deduplication.service';
import { AnalysisController } from './analysis.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    AnalysisService, 
    TaskProcessor, 
    LlmService, 
    CrawlerService, 
    DeduplicationService
  ],
  controllers: [AnalysisController],
  exports: [
    AnalysisService, 
    LlmService, 
    CrawlerService, 
    DeduplicationService
  ],
})
export class AnalysisModule {}