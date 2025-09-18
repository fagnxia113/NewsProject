declare const analysisRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
export default analysisRouter;
