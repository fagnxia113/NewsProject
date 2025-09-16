"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trpc_1 = require("../trpc/trpc");
const prisma_service_1 = require("../prisma/prisma.service");
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const prismaService = new prisma_service_1.PrismaService();
const settingsRouter = (0, trpc_1.router)({
    listIndustries: trpc_1.procedure
        .query(async () => {
        try {
            const industries = await prismaService.industry.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return industries;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取行业列表失败',
                cause: error,
            });
        }
    }),
    createIndustry: trpc_1.procedure
        .input(zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        priority: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }))
        .mutation(async ({ input }) => {
        try {
            const industry = await prismaService.industry.create({
                data: input,
            });
            return industry;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '创建行业失败',
                cause: error,
            });
        }
    }),
    updateIndustry: trpc_1.procedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        data: zod_1.z.object({
            name: zod_1.z.string(),
            description: zod_1.z.string().optional(),
            priority: zod_1.z.number().optional(),
            isActive: zod_1.z.boolean().optional(),
        }),
    }))
        .mutation(async ({ input }) => {
        try {
            const industry = await prismaService.industry.update({
                where: { id: input.id },
                data: input.data,
            });
            return industry;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '更新行业失败',
                cause: error,
            });
        }
    }),
    deleteIndustry: trpc_1.procedure
        .input(zod_1.z.string())
        .mutation(async ({ input }) => {
        try {
            await prismaService.industry.delete({
                where: { id: input },
            });
            return { success: true };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '删除行业失败',
                cause: error,
            });
        }
    }),
    listNewsTypes: trpc_1.procedure
        .query(async () => {
        try {
            const newsTypes = await prismaService.newsType.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return newsTypes;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取新闻类型列表失败',
                cause: error,
            });
        }
    }),
    createNewsType: trpc_1.procedure
        .input(zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        priority: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }))
        .mutation(async ({ input }) => {
        try {
            const newsType = await prismaService.newsType.create({
                data: input,
            });
            return newsType;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '创建新闻类型失败',
                cause: error,
            });
        }
    }),
    updateNewsType: trpc_1.procedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        data: zod_1.z.object({
            name: zod_1.z.string(),
            description: zod_1.z.string().optional(),
            priority: zod_1.z.number().optional(),
            isActive: zod_1.z.boolean().optional(),
        }),
    }))
        .mutation(async ({ input }) => {
        try {
            const newsType = await prismaService.newsType.update({
                where: { id: input.id },
                data: input.data,
            });
            return newsType;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '更新新闻类型失败',
                cause: error,
            });
        }
    }),
    deleteNewsType: trpc_1.procedure
        .input(zod_1.z.string())
        .mutation(async ({ input }) => {
        try {
            await prismaService.newsType.delete({
                where: { id: input },
            });
            return { success: true };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '删除新闻类型失败',
                cause: error,
            });
        }
    }),
    listLLMConfigs: trpc_1.procedure
        .query(async () => {
        try {
            const llmConfigs = await prismaService.lLMConfig.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return llmConfigs;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取LLM配置列表失败',
                cause: error,
            });
        }
    }),
    createLLMConfig: trpc_1.procedure
        .input(zod_1.z.object({
        model: zod_1.z.string(),
        apiKey: zod_1.z.string(),
        baseUrl: zod_1.z.string().optional(),
        maxTokens: zod_1.z.number().optional(),
        temperature: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }))
        .mutation(async ({ input }) => {
        try {
            const llmConfig = await prismaService.lLMConfig.create({
                data: {
                    ...input,
                },
            });
            return llmConfig;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '创建LLM配置失败',
                cause: error,
            });
        }
    }),
    updateLLMConfig: trpc_1.procedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        data: zod_1.z.object({
            model: zod_1.z.string(),
            apiKey: zod_1.z.string(),
            baseUrl: zod_1.z.string().optional(),
            maxTokens: zod_1.z.number().optional(),
            temperature: zod_1.z.number().optional(),
            isActive: zod_1.z.boolean().optional(),
        }),
    }))
        .mutation(async ({ input }) => {
        try {
            const llmConfig = await prismaService.lLMConfig.update({
                where: { id: input.id },
                data: input.data,
            });
            return llmConfig;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '更新LLM配置失败',
                cause: error,
            });
        }
    }),
    deleteLLMConfig: trpc_1.procedure
        .input(zod_1.z.string())
        .mutation(async ({ input }) => {
        try {
            await prismaService.lLMConfig.delete({
                where: { id: input },
            });
            return { success: true };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '删除LLM配置失败',
                cause: error,
            });
        }
    }),
});
exports.default = settingsRouter;
//# sourceMappingURL=settings.router.js.map