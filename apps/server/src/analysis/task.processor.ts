import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@server/prisma/prisma.service';
import { AnalysisService } from './analysis.service';

@Injectable()
export class TaskProcessor {
  private readonly logger = new Logger(TaskProcessor.name);

  constructor(
    private readonly analysisService: AnalysisService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 每小时执行一次，处理待处理的分析任务
   */
  // @Cron('0 * * * *')
  // async handleCron() {
  //   this.logger.debug('开始执行定时分析任务');
    
  //   try {
  //     // 获取所有状态为待处理的任务
  //     const pendingTasks = await this.prismaService.processingTask.findMany({
  //       where: {
  //         status: 0, // 0: 待处理
  //       },
  //       orderBy: {
  //         createdAt: 'asc',
  //       },
  //     });

  //     this.logger.debug(`找到${pendingTasks.length}个待处理的任务`);

  //     // 逐个处理任务
  //     for (const task of pendingTasks) {
  //       try {
  //         this.logger.debug(`开始处理任务: ${task.id}`);
          
  //         // 更新任务状态为处理中
  //         await this.prismaService.processingTask.update({
  //           where: { id: task.id },
  //           data: { status: 1 }, // 1: 处理中
  //         });

  //         // 执行批量文章处理
  //         await this.processBatchArticleTask(task);

  //         // 更新任务状态为完成
  //         await this.prismaService.processingTask.update({
  //           where: { id: task.id },
  //           data: { 
  //             status: 2, // 2: 完成
  //             endTime: Math.floor(Date.now() / 1000),
  //           },
  //         });

  //         this.logger.debug(`任务处理完成: ${task.id}`);
  //       } catch (error) {
  //         this.logger.error(`处理任务失败: ${task.id}`, error.stack);
          
  //         // 更新任务状态为失败
  //         await this.prismaService.processingTask.update({
  //           where: { id: task.id },
  //           data: { 
  //             status: 3, // 3: 失败
  //             errorMessage: error.message,
  //             endTime: Math.floor(Date.now() / 1000),
  //           },
  //         });
  //       }
  //     }

  //     // 每天凌晨2点执行一次每日分析
  //     const now = new Date();
  //     if (now.getHours() === 2 && now.getMinutes() < 5) {
  //       await this.performDailyAnalysis();
  //     }

  //   } catch (error) {
  //     this.logger.error('执行定时任务时发生错误', error.stack);
  //   }

  //   this.logger.debug('定时分析任务执行完成');
  // }

  /**
   * 处理批量文章分析任务
   */
  private async processBatchArticleTask(task: any) {
    // 获取未处理的文章
    const unprocessedArticles = await this.prismaService.article.findMany({
      where: { 
        isProcessed: false 
      },
      take: task.totalArticles || 100, // 增加默认处理文章数量
      orderBy: {
        publishTime: 'desc'
      }
    });

    if (unprocessedArticles.length === 0) {
      this.logger.debug('没有需要处理的文章');
      return;
    }

    // 更新任务的总文章数
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

    // 逐个处理文章
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
        
        // 每处理5篇文章更新一次任务进度（更频繁的更新）
        if (processedCount % 5 === 0 || processedCount === unprocessedArticles.length) {
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
          
          // 记录进度日志
          this.logger.debug(`任务 ${task.id} 进度: ${processedCount}/${unprocessedArticles.length}`);
        }
      } catch (error) {
        this.logger.error(`处理文章失败: ${article.id}`, error);
        processedCount++;
        failedCount++;
        
        // 出错时也更新任务进度
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
  }

  /**
   * 执行每日分析
   */
  private async performDailyAnalysis() {
    try {
      this.logger.debug('开始执行每日分析');
      
      // 获取昨天的日期
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // 调用analysisService的performDailyAnalysis方法进行每日分析
      await this.analysisService.performDailyAnalysis(yesterday);
      
      this.logger.debug('每日分析执行完成');
    } catch (error: any) {
      this.logger.error('执行每日分析时发生错误', error.stack);
    }
  }
}
