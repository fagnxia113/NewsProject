"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrpcRouter = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const trpc_service_1 = require("./trpc.service");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const server_1 = require("@trpc/server");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("../constants");
const config_1 = require("@nestjs/config");
const analysis_router_1 = __importDefault(require("../analysis/analysis.router"));
const settings_router_1 = __importDefault(require("../settings/settings.router"));
let TrpcRouter = class TrpcRouter {
    constructor(trpcService, prismaService, configService) {
        this.trpcService = trpcService;
        this.prismaService = prismaService;
        this.configService = configService;
        this.logger = new common_1.Logger(this.constructor.name);
        this.accountRouter = this.trpcService.router({
            list: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                limit: zod_1.z.number().min(1).max(1000).nullish(),
                cursor: zod_1.z.string().nullish(),
            }))
                .query(async ({ input }) => {
                const limit = input.limit ?? 1000;
                const { cursor } = input;
                const items = await this.prismaService.account.findMany({
                    take: limit + 1,
                    where: {},
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        token: false,
                    },
                    cursor: cursor
                        ? {
                            id: cursor,
                        }
                        : undefined,
                    orderBy: {
                        createdAt: 'asc',
                    },
                });
                let nextCursor = undefined;
                if (items.length > limit) {
                    const nextItem = items.pop();
                    nextCursor = nextItem.id;
                }
                const disabledAccounts = this.trpcService.getBlockedAccountIds();
                return {
                    blocks: disabledAccounts,
                    items,
                    nextCursor,
                };
            }),
            byId: this.trpcService.publicProcedure
                .input(zod_1.z.string())
                .query(async ({ input: id }) => {
                const account = await this.prismaService.account.findUnique({
                    where: { id },
                });
                if (!account) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: `No account with id '${id}'`,
                    });
                }
                return account;
            }),
            add: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                id: zod_1.z.string().min(1).max(32),
                token: zod_1.z.string().min(1),
                name: zod_1.z.string().min(1),
                status: zod_1.z.number().default(constants_1.statusMap.ENABLE),
            }))
                .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const account = await this.prismaService.account.upsert({
                    where: {
                        id,
                    },
                    update: data,
                    create: input,
                });
                this.trpcService.removeBlockedAccount(id);
                return account;
            }),
            edit: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                id: zod_1.z.string(),
                data: zod_1.z.object({
                    token: zod_1.z.string().min(1).optional(),
                    name: zod_1.z.string().min(1).optional(),
                    status: zod_1.z.number().optional(),
                }),
            }))
                .mutation(async ({ input }) => {
                const { id, data } = input;
                const account = await this.prismaService.account.update({
                    where: { id },
                    data,
                });
                this.trpcService.removeBlockedAccount(id);
                return account;
            }),
            delete: this.trpcService.publicProcedure
                .input(zod_1.z.string())
                .mutation(async ({ input: id }) => {
                await this.prismaService.account.delete({ where: { id } });
                this.trpcService.removeBlockedAccount(id);
                return id;
            }),
        });
        this.feedRouter = this.trpcService.router({
            list: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                limit: zod_1.z.number().min(1).max(1000).nullish(),
                cursor: zod_1.z.string().nullish(),
            }))
                .query(async ({ input }) => {
                const limit = input.limit ?? 1000;
                const { cursor } = input;
                const items = await this.prismaService.feed.findMany({
                    take: limit + 1,
                    where: {},
                    cursor: cursor
                        ? {
                            id: cursor,
                        }
                        : undefined,
                    orderBy: {
                        createdAt: 'asc',
                    },
                });
                let nextCursor = undefined;
                if (items.length > limit) {
                    const nextItem = items.pop();
                    nextCursor = nextItem.id;
                }
                return {
                    items: items,
                    nextCursor,
                };
            }),
            byId: this.trpcService.publicProcedure
                .input(zod_1.z.string())
                .query(async ({ input: id }) => {
                const feed = await this.prismaService.feed.findUnique({
                    where: { id },
                });
                if (!feed) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: `No feed with id '${id}'`,
                    });
                }
                return feed;
            }),
            add: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                id: zod_1.z.string(),
                mpName: zod_1.z.string(),
                mpCover: zod_1.z.string(),
                mpIntro: zod_1.z.string(),
                syncTime: zod_1.z
                    .number()
                    .optional()
                    .default(Math.floor(Date.now() / 1e3)),
                updateTime: zod_1.z.number(),
                status: zod_1.z.number().default(constants_1.statusMap.ENABLE),
            }))
                .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const feed = await this.prismaService.feed.upsert({
                    where: {
                        id,
                    },
                    update: data,
                    create: input,
                });
                return feed;
            }),
            edit: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                id: zod_1.z.string(),
                data: zod_1.z.object({
                    mpName: zod_1.z.string().optional(),
                    mpCover: zod_1.z.string().optional(),
                    mpIntro: zod_1.z.string().optional(),
                    syncTime: zod_1.z.number().optional(),
                    updateTime: zod_1.z.number().optional(),
                    status: zod_1.z.number().optional(),
                }),
            }))
                .mutation(async ({ input }) => {
                const { id, data } = input;
                const feed = await this.prismaService.feed.update({
                    where: { id },
                    data,
                });
                return feed;
            }),
            delete: this.trpcService.publicProcedure
                .input(zod_1.z.string())
                .mutation(async ({ input: id }) => {
                await this.prismaService.feed.delete({ where: { id } });
                return id;
            }),
            refreshArticles: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                mpId: zod_1.z.string().optional(),
            }))
                .mutation(async ({ input: { mpId } }) => {
                if (mpId) {
                    await this.trpcService.refreshMpArticlesAndUpdateFeed(mpId);
                }
                else {
                    await this.trpcService.refreshAllMpArticlesAndUpdateFeed();
                }
            }),
            isRefreshAllMpArticlesRunning: this.trpcService.publicProcedure.query(async () => {
                return this.trpcService.isRefreshAllMpArticlesRunning;
            }),
            getHistoryArticles: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                mpId: zod_1.z.string().optional(),
            }))
                .mutation(async ({ input: { mpId = '' } }) => {
                this.trpcService.getHistoryMpArticles(mpId);
            }),
            getInProgressHistoryMp: this.trpcService.publicProcedure.query(async () => {
                return this.trpcService.inProgressHistoryMp;
            }),
        });
        this.articleRouter = this.trpcService.router({
            list: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                limit: zod_1.z.number().min(1).max(1000).nullish(),
                cursor: zod_1.z.string().nullish(),
                mpId: zod_1.z.string().nullish(),
                keyword: zod_1.z.string().nullish(),
                industry: zod_1.z.string().nullish(),
                newsType: zod_1.z.string().nullish(),
                startDate: zod_1.z.number().nullish(),
                endDate: zod_1.z.number().nullish(),
            }))
                .query(async ({ input }) => {
                const limit = input.limit ?? 1000;
                const { cursor, mpId, keyword, industry, newsType, startDate, endDate } = input;
                const where = {};
                if (mpId) {
                    where.mpId = mpId;
                }
                if (keyword) {
                    where.OR = [
                        { title: { contains: keyword } },
                        { content: { contains: keyword } }
                    ];
                }
                if (industry) {
                    where.industry = industry;
                }
                if (newsType) {
                    where.newsType = newsType;
                }
                if (startDate && endDate) {
                    where.publishTime = {
                        gte: startDate,
                        lte: endDate
                    };
                }
                else if (startDate) {
                    where.publishTime = {
                        gte: startDate
                    };
                }
                else if (endDate) {
                    where.publishTime = {
                        lte: endDate
                    };
                }
                const items = await this.prismaService.article.findMany({
                    orderBy: [
                        {
                            publishTime: 'desc',
                        },
                    ],
                    take: limit + 1,
                    where: Object.keys(where).length > 0 ? where : undefined,
                    cursor: cursor
                        ? {
                            id: cursor,
                        }
                        : undefined,
                    select: {
                        id: true,
                        mpId: true,
                        title: true,
                        content: true,
                        picUrl: true,
                        publishTime: true,
                        industry: true,
                        newsType: true,
                        isProcessed: true,
                    },
                });
                let nextCursor = undefined;
                if (items.length > limit) {
                    const nextItem = items.pop();
                    nextCursor = nextItem.id;
                }
                const formattedItems = items.map(item => ({
                    ...item,
                    mpName: null
                }));
                return {
                    items: formattedItems,
                    nextCursor,
                };
            }),
            byId: this.trpcService.publicProcedure
                .input(zod_1.z.string())
                .query(async ({ input: id }) => {
                const article = await this.prismaService.article.findUnique({
                    where: { id },
                });
                if (!article) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: `No article with id '${id}'`,
                    });
                }
                return article;
            }),
            add: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                id: zod_1.z.string(),
                mpId: zod_1.z.string(),
                title: zod_1.z.string(),
                picUrl: zod_1.z.string().optional().default(''),
                publishTime: zod_1.z.number(),
            }))
                .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const article = await this.prismaService.article.upsert({
                    where: {
                        id,
                    },
                    update: data,
                    create: input,
                });
                return article;
            }),
            delete: this.trpcService.publicProcedure.input(zod_1.z.string()).mutation(async ({ input: id }) => {
                await this.prismaService.article.delete({ where: { id } });
                return id;
            }),
        });
        this.platformRouter = this.trpcService.router({
            getMpArticles: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                mpId: zod_1.z.string(),
            }))
                .mutation(async ({ input: { mpId } }) => {
                try {
                    const results = await this.trpcService.getMpArticles(mpId);
                    return results;
                }
                catch (err) {
                    this.logger.log('getMpArticles err: ', err);
                    throw new server_1.TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.response?.data?.message || err.message,
                        cause: err.stack,
                    });
                }
            }),
            getMpInfo: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                wxsLink: zod_1.z
                    .string()
                    .refine((v) => v.startsWith('https://mp.weixin.qq.com/s/')),
            }))
                .mutation(async ({ input: { wxsLink: url } }) => {
                try {
                    const results = await this.trpcService.getMpInfo(url);
                    return results;
                }
                catch (err) {
                    this.logger.log('getMpInfo err: ', err);
                    throw new server_1.TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.response?.data?.message || err.message,
                        cause: err.stack,
                    });
                }
            }),
            createLoginUrl: this.trpcService.publicProcedure.mutation(async () => {
                return this.trpcService.createLoginUrl();
            }),
            getLoginResult: this.trpcService.publicProcedure
                .input(zod_1.z.object({
                id: zod_1.z.string(),
            }))
                .mutation(async ({ input }) => {
                return this.trpcService.getLoginResult(input.id);
            }),
        });
        this.appRouter = this.trpcService.router({
            feed: this.feedRouter,
            account: this.accountRouter,
            article: this.articleRouter,
            platform: this.platformRouter,
            analysis: analysis_router_1.default,
            settings: settings_router_1.default,
        });
    }
    async applyMiddleware(app) {
        app.use(`/trpc`, trpcExpress.createExpressMiddleware({
            router: this.appRouter,
            createContext: ({ req }) => {
                return {};
            },
            middleware: (req, res, next) => {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                next();
            },
        }));
    }
};
exports.TrpcRouter = TrpcRouter;
exports.TrpcRouter = TrpcRouter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [trpc_service_1.TrpcService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], TrpcRouter);
//# sourceMappingURL=trpc.router.js.map