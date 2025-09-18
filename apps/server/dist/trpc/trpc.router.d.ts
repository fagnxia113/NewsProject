import { INestApplication } from '@nestjs/common';
import { TrpcService } from '@server/trpc/trpc.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class TrpcRouter {
    private readonly trpcService;
    private readonly prismaService;
    private readonly configService;
    constructor(trpcService: TrpcService, prismaService: PrismaService, configService: ConfigService);
    private readonly logger;
    accountRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: {
            serialize: (object: any) => any;
            deserialize: (object: any) => any;
        };
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                limit?: number | null | undefined;
                cursor?: string | null | undefined;
            };
            _input_out: {
                limit?: number | null | undefined;
                cursor?: string | null | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            blocks: string[];
            items: any;
            nextCursor: string | null | undefined;
        }>;
        byId: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        add: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                name: string;
                id: string;
                token: string;
                status?: number | undefined;
            };
            _input_out: {
                name: string;
                id: string;
                status: number;
                token: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        edit: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                data: {
                    name?: string | undefined;
                    status?: number | undefined;
                    token?: string | undefined;
                };
                id: string;
            };
            _input_out: {
                data: {
                    name?: string | undefined;
                    status?: number | undefined;
                    token?: string | undefined;
                };
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, string>;
    }>;
    feedRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: {
            serialize: (object: any) => any;
            deserialize: (object: any) => any;
        };
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                limit?: number | null | undefined;
                cursor?: string | null | undefined;
            };
            _input_out: {
                limit?: number | null | undefined;
                cursor?: string | null | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            items: any;
            nextCursor: string | null | undefined;
        }>;
        byId: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        add: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                id: string;
                mpName: string;
                mpCover: string;
                mpIntro: string;
                updateTime: number;
                status?: number | undefined;
                syncTime?: number | undefined;
            };
            _input_out: {
                id: string;
                mpName: string;
                mpCover: string;
                mpIntro: string;
                status: number;
                syncTime: number;
                updateTime: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        edit: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                data: {
                    mpName?: string | undefined;
                    mpCover?: string | undefined;
                    mpIntro?: string | undefined;
                    status?: number | undefined;
                    syncTime?: number | undefined;
                    updateTime?: number | undefined;
                };
                id: string;
            };
            _input_out: {
                data: {
                    mpName?: string | undefined;
                    mpCover?: string | undefined;
                    mpIntro?: string | undefined;
                    status?: number | undefined;
                    syncTime?: number | undefined;
                    updateTime?: number | undefined;
                };
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, string>;
        refreshArticles: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                mpId?: string | undefined;
            };
            _input_out: {
                mpId?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, void>;
        isRefreshAllMpArticlesRunning: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _ctx_out: object;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, boolean>;
        getHistoryArticles: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                mpId?: string | undefined;
            };
            _input_out: {
                mpId?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, void>;
        getInProgressHistoryMp: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _ctx_out: object;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            id: string;
            page: number;
        }>;
    }>;
    articleRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: {
            serialize: (object: any) => any;
            deserialize: (object: any) => any;
        };
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                industry?: string | null | undefined;
                newsType?: string | null | undefined;
                limit?: number | null | undefined;
                cursor?: string | null | undefined;
                mpId?: string | null | undefined;
                startDate?: number | null | undefined;
                endDate?: number | null | undefined;
                keyword?: string | null | undefined;
            };
            _input_out: {
                industry?: string | null | undefined;
                newsType?: string | null | undefined;
                limit?: number | null | undefined;
                cursor?: string | null | undefined;
                mpId?: string | null | undefined;
                startDate?: number | null | undefined;
                endDate?: number | null | undefined;
                keyword?: string | null | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            items: any;
            nextCursor: string | null | undefined;
        }>;
        byId: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        add: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                id: string;
                mpId: string;
                title: string;
                publishTime: number;
                picUrl?: string | undefined;
            };
            _input_out: {
                id: string;
                mpId: string;
                title: string;
                picUrl: string;
                publishTime: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: string;
            _input_out: string;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, string>;
    }>;
    platformRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: {
            serialize: (object: any) => any;
            deserialize: (object: any) => any;
        };
    }>, {
        getMpArticles: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                mpId: string;
            };
            _input_out: {
                mpId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        getMpInfo: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                wxsLink: string;
            };
            _input_out: {
                wxsLink: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            cover: string;
            name: string;
            intro: string;
            updateTime: number;
        }[]>;
        createLoginUrl: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _ctx_out: object;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            uuid: string;
            scanUrl: string;
        }>;
        getLoginResult: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: {
                    serialize: (object: any) => any;
                    deserialize: (object: any) => any;
                };
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            message: string;
            vid?: number;
            token?: string;
            username?: string;
        }>;
    }>;
    appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: {
            serialize: (object: any) => any;
            deserialize: (object: any) => any;
        };
    }>, {
        feed: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: {
                serialize: (object: any) => any;
                deserialize: (object: any) => any;
            };
        }>, {
            list: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    limit?: number | null | undefined;
                    cursor?: string | null | undefined;
                };
                _input_out: {
                    limit?: number | null | undefined;
                    cursor?: string | null | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                items: any;
                nextCursor: string | null | undefined;
            }>;
            byId: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            add: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    id: string;
                    mpName: string;
                    mpCover: string;
                    mpIntro: string;
                    updateTime: number;
                    status?: number | undefined;
                    syncTime?: number | undefined;
                };
                _input_out: {
                    id: string;
                    mpName: string;
                    mpCover: string;
                    mpIntro: string;
                    status: number;
                    syncTime: number;
                    updateTime: number;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            edit: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    data: {
                        mpName?: string | undefined;
                        mpCover?: string | undefined;
                        mpIntro?: string | undefined;
                        status?: number | undefined;
                        syncTime?: number | undefined;
                        updateTime?: number | undefined;
                    };
                    id: string;
                };
                _input_out: {
                    data: {
                        mpName?: string | undefined;
                        mpCover?: string | undefined;
                        mpIntro?: string | undefined;
                        status?: number | undefined;
                        syncTime?: number | undefined;
                        updateTime?: number | undefined;
                    };
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            delete: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, string>;
            refreshArticles: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    mpId?: string | undefined;
                };
                _input_out: {
                    mpId?: string | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, void>;
            isRefreshAllMpArticlesRunning: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _ctx_out: object;
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
                _meta: object;
            }, boolean>;
            getHistoryArticles: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    mpId?: string | undefined;
                };
                _input_out: {
                    mpId?: string | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, void>;
            getInProgressHistoryMp: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _ctx_out: object;
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
                _meta: object;
            }, {
                id: string;
                page: number;
            }>;
        }>;
        account: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: {
                serialize: (object: any) => any;
                deserialize: (object: any) => any;
            };
        }>, {
            list: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    limit?: number | null | undefined;
                    cursor?: string | null | undefined;
                };
                _input_out: {
                    limit?: number | null | undefined;
                    cursor?: string | null | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                blocks: string[];
                items: any;
                nextCursor: string | null | undefined;
            }>;
            byId: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            add: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    name: string;
                    id: string;
                    token: string;
                    status?: number | undefined;
                };
                _input_out: {
                    name: string;
                    id: string;
                    status: number;
                    token: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            edit: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    data: {
                        name?: string | undefined;
                        status?: number | undefined;
                        token?: string | undefined;
                    };
                    id: string;
                };
                _input_out: {
                    data: {
                        name?: string | undefined;
                        status?: number | undefined;
                        token?: string | undefined;
                    };
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            delete: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, string>;
        }>;
        article: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: {
                serialize: (object: any) => any;
                deserialize: (object: any) => any;
            };
        }>, {
            list: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    industry?: string | null | undefined;
                    newsType?: string | null | undefined;
                    limit?: number | null | undefined;
                    cursor?: string | null | undefined;
                    mpId?: string | null | undefined;
                    startDate?: number | null | undefined;
                    endDate?: number | null | undefined;
                    keyword?: string | null | undefined;
                };
                _input_out: {
                    industry?: string | null | undefined;
                    newsType?: string | null | undefined;
                    limit?: number | null | undefined;
                    cursor?: string | null | undefined;
                    mpId?: string | null | undefined;
                    startDate?: number | null | undefined;
                    endDate?: number | null | undefined;
                    keyword?: string | null | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                items: any;
                nextCursor: string | null | undefined;
            }>;
            byId: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            add: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    id: string;
                    mpId: string;
                    title: string;
                    publishTime: number;
                    picUrl?: string | undefined;
                };
                _input_out: {
                    id: string;
                    mpId: string;
                    title: string;
                    picUrl: string;
                    publishTime: number;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            delete: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, string>;
        }>;
        platform: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: {
                serialize: (object: any) => any;
                deserialize: (object: any) => any;
            };
        }>, {
            getMpArticles: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    mpId: string;
                };
                _input_out: {
                    mpId: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            getMpInfo: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    wxsLink: string;
                };
                _input_out: {
                    wxsLink: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: string;
                cover: string;
                name: string;
                intro: string;
                updateTime: number;
            }[]>;
            createLoginUrl: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _ctx_out: object;
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
                _meta: object;
            }, {
                uuid: string;
                scanUrl: string;
            }>;
            getLoginResult: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: {
                        serialize: (object: any) => any;
                        deserialize: (object: any) => any;
                    };
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    id: string;
                };
                _input_out: {
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                message: string;
                vid?: number;
                token?: string;
                username?: string;
            }>;
        }>;
        analysis: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>, {
            getStats: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    days: number;
                };
                _input_out: {
                    days: number;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                totalArticles: number;
                processedArticles: number;
                investmentCount: number;
                policyCount: number;
                splitCount: number;
                articleGrowth: number;
                investmentProportion: number;
                industryDistribution: {
                    name: string;
                    value: number;
                }[];
                typeDistribution: {
                    name: string;
                    count: number;
                }[];
                monthlyTrends: {
                    month: string;
                    count: number;
                }[];
                topKeywords: string[];
                keywordFrequencies: number[];
                emergingTopics: {
                    name: string;
                    growth: number;
                }[];
            }>;
            listIndustries: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    activeOnly?: boolean | undefined;
                };
                _input_out: {
                    activeOnly?: boolean | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            listNewsTypes: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    activeOnly?: boolean | undefined;
                };
                _input_out: {
                    activeOnly?: boolean | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            getClassifiedArticles: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    page: number;
                    pageSize: number;
                    industry?: string | undefined;
                    newsType?: string | undefined;
                    startDate?: number | undefined;
                    endDate?: number | undefined;
                    keyword?: string | undefined;
                };
                _input_out: {
                    page: number;
                    pageSize: number;
                    industry?: string | undefined;
                    newsType?: string | undefined;
                    startDate?: number | undefined;
                    endDate?: number | undefined;
                    keyword?: string | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                data: any;
                total: number;
                page: number;
                pageSize: number;
            }>;
            processNewArticles: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    days: number;
                };
                _input_out: {
                    days: number;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                taskId: any;
                totalArticles: number;
                message: string;
            }>;
            getTask: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    id: string;
                };
                _input_out: {
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: any;
                status: any;
                startTime: any;
                endTime: any;
                totalArticles: any;
                processedArticles: any;
                successArticles: any;
                failedArticles: any;
                splitCount: any;
                duplicateCount: any;
                filterCount: any;
            }>;
            getArticle: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    id: string;
                };
                _input_out: {
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: any;
                title: any;
                content: any;
                mpName: any;
                mpCover: any;
                industry: any;
                newsType: any;
                publishTime: any;
                isProcessed: any;
            }>;
            getArticleAnalysis: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    articleId: string;
                };
                _input_out: {
                    articleId: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: string;
                articleId: string;
                summary: string;
                keyPoints: string[];
                entities: {
                    name: string;
                    type: string;
                    confidence: number;
                }[];
                sentiment: string;
                createdAt: number;
            }>;
            processArticle: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    articleId: string;
                };
                _input_out: {
                    articleId: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            createTask: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {};
                _input_out: {};
                _output_in: {
                    id: string;
                    status: number;
                    startTime: number;
                    totalArticles: number;
                };
                _output_out: {
                    id: string;
                    status: number;
                    startTime: number;
                    totalArticles: number;
                };
            }, unknown>;
            listTasks: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    status?: number | undefined;
                    page?: number | undefined;
                    pageSize?: number | undefined;
                };
                _input_out: {
                    page: number;
                    pageSize: number;
                    status?: number | undefined;
                };
                _output_in: {
                    data: {
                        id: string;
                        status: number;
                        startTime: number;
                        endTime: number | null;
                        totalArticles: number;
                        processedArticles: number;
                        successArticles: number;
                        failedArticles: number;
                        splitCount: number;
                        duplicateCount: number;
                    }[];
                    total: number;
                };
                _output_out: {
                    data: {
                        id: string;
                        status: number;
                        startTime: number;
                        endTime: number | null;
                        totalArticles: number;
                        processedArticles: number;
                        successArticles: number;
                        failedArticles: number;
                        splitCount: number;
                        duplicateCount: number;
                    }[];
                    total: number;
                };
            }, unknown>;
            batchProcessArticles: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    articleIds: string[];
                };
                _input_out: {
                    articleIds: string[];
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                taskId: any;
                totalArticles: number;
                message: string;
            }>;
            batchProcess: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    limit?: number | undefined;
                };
                _input_out: {
                    limit: number;
                };
                _output_in: {
                    totalArticles: number;
                    message: string;
                    taskId: string;
                };
                _output_out: {
                    totalArticles: number;
                    message: string;
                    taskId: string;
                };
            }, unknown>;
            deleteAnalysisResults: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    articleIds: string[];
                };
                _input_out: {
                    articleIds: string[];
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            clearAnalysisResults: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {};
                _input_out: {};
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
        }>;
        settings: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>, {
            listIndustries: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _ctx_out: object;
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
                _meta: object;
            }, any>;
            createIndustry: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    name: string;
                    priority?: number | undefined;
                    isActive?: boolean | undefined;
                    description?: string | undefined;
                };
                _input_out: {
                    name: string;
                    priority?: number | undefined;
                    isActive?: boolean | undefined;
                    description?: string | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            updateIndustry: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    data: {
                        name: string;
                        priority?: number | undefined;
                        isActive?: boolean | undefined;
                        description?: string | undefined;
                    };
                    id: string;
                };
                _input_out: {
                    data: {
                        name: string;
                        priority?: number | undefined;
                        isActive?: boolean | undefined;
                        description?: string | undefined;
                    };
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            deleteIndustry: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                success: boolean;
            }>;
            listNewsTypes: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _ctx_out: object;
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
                _meta: object;
            }, any>;
            createNewsType: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    name: string;
                    priority?: number | undefined;
                    isActive?: boolean | undefined;
                    description?: string | undefined;
                };
                _input_out: {
                    name: string;
                    priority?: number | undefined;
                    isActive?: boolean | undefined;
                    description?: string | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            updateNewsType: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    data: {
                        name: string;
                        priority?: number | undefined;
                        isActive?: boolean | undefined;
                        description?: string | undefined;
                    };
                    id: string;
                };
                _input_out: {
                    data: {
                        name: string;
                        priority?: number | undefined;
                        isActive?: boolean | undefined;
                        description?: string | undefined;
                    };
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            deleteNewsType: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                success: boolean;
            }>;
            listLLMConfigs: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _ctx_out: object;
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
                _meta: object;
            }, any>;
            createLLMConfig: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    model: string;
                    apiKey: string;
                    baseUrl?: string | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    isActive?: boolean | undefined;
                };
                _input_out: {
                    model: string;
                    apiKey: string;
                    baseUrl?: string | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    isActive?: boolean | undefined;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            updateLLMConfig: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: {
                    data: {
                        model: string;
                        apiKey: string;
                        baseUrl?: string | undefined;
                        maxTokens?: number | undefined;
                        temperature?: number | undefined;
                        isActive?: boolean | undefined;
                    };
                    id: string;
                };
                _input_out: {
                    data: {
                        model: string;
                        apiKey: string;
                        baseUrl?: string | undefined;
                        maxTokens?: number | undefined;
                        temperature?: number | undefined;
                        isActive?: boolean | undefined;
                    };
                    id: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any>;
            deleteLLMConfig: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: object;
                    meta: object;
                    errorShape: import("@trpc/server").DefaultErrorShape;
                    transformer: import("@trpc/server").DefaultDataTransformer;
                }>;
                _meta: object;
                _ctx_out: object;
                _input_in: string;
                _input_out: string;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                success: boolean;
            }>;
        }>;
    }>;
    applyMiddleware(app: INestApplication): Promise<void>;
}
export type AppRouter = TrpcRouter[`appRouter`];
