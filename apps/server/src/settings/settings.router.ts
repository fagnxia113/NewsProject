import { router, procedure } from '@server/trpc/trpc';
import { PrismaService } from '@server/prisma/prisma.service';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

// 创建服务实例
const prismaService = new PrismaService();

// 设置中心相关的TRPC路由
const settingsRouter = router({
  // 获取行业列表
  listIndustries: procedure
    .query(async () => {
      try {
        const industries = await prismaService.industry.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        return industries;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取行业列表失败',
          cause: error,
        });
      }
    }),

  // 创建行业
  createIndustry: procedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      priority: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const industry = await prismaService.industry.create({
          data: input,
        });
        return industry;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '创建行业失败',
          cause: error,
        });
      }
    }),

  // 更新行业
  updateIndustry: procedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string(),
        description: z.string().optional(),
        priority: z.number().optional(),
        isActive: z.boolean().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      try {
        const industry = await prismaService.industry.update({
          where: { id: input.id },
          data: input.data,
        });
        return industry;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '更新行业失败',
          cause: error,
        });
      }
    }),

  // 删除行业
  deleteIndustry: procedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        await prismaService.industry.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '删除行业失败',
          cause: error,
        });
      }
    }),

  // 获取新闻类型列表
  listNewsTypes: procedure
    .query(async () => {
      try {
        const newsTypes = await prismaService.newsType.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        return newsTypes;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取新闻类型列表失败',
          cause: error,
        });
      }
    }),

  // 创建新闻类型
  createNewsType: procedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      priority: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const newsType = await prismaService.newsType.create({
          data: input,
        });
        return newsType;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '创建新闻类型失败',
          cause: error,
        });
      }
    }),

  // 更新新闻类型
  updateNewsType: procedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string(),
        description: z.string().optional(),
        priority: z.number().optional(),
        isActive: z.boolean().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      try {
        const newsType = await prismaService.newsType.update({
          where: { id: input.id },
          data: input.data,
        });
        return newsType;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '更新新闻类型失败',
          cause: error,
        });
      }
    }),

  // 删除新闻类型
  deleteNewsType: procedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        await prismaService.newsType.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '删除新闻类型失败',
          cause: error,
        });
      }
    }),

  // 获取LLM配置列表
  listLLMConfigs: procedure
    .query(async () => {
      try {
        const llmConfigs = await prismaService.lLMConfig.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        return llmConfigs;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取LLM配置列表失败',
          cause: error,
        });
      }
    }),

  // 创建LLM配置
  createLLMConfig: procedure
    .input(z.object({
      model: z.string(),
      apiKey: z.string(),
      baseUrl: z.string().optional(),
      maxTokens: z.number().optional(),
      temperature: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const llmConfig = await prismaService.lLMConfig.create({
          data: {
            ...input,
          },
        });
        return llmConfig;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '创建LLM配置失败',
          cause: error,
        });
      }
    }),

  // 更新LLM配置
  updateLLMConfig: procedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        model: z.string(),
        apiKey: z.string(),
        baseUrl: z.string().optional(),
        maxTokens: z.number().optional(),
        temperature: z.number().optional(),
        isActive: z.boolean().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      try {
        const llmConfig = await prismaService.lLMConfig.update({
          where: { id: input.id },
          data: input.data,
        });
        return llmConfig;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '更新LLM配置失败',
          cause: error,
        });
      }
    }),

  // 删除LLM配置
  deleteLLMConfig: procedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        await prismaService.lLMConfig.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '删除LLM配置失败',
          cause: error,
        });
      }
    }),
});

export default settingsRouter;