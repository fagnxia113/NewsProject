declare const settingsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
    }, {
        id: string;
        name: string;
        description: string | null;
        priority: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }[]>;
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
    }, {
        id: string;
        name: string;
        description: string | null;
        priority: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
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
    }, {
        id: string;
        name: string;
        description: string | null;
        priority: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
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
    }, {
        id: string;
        name: string;
        description: string | null;
        priority: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }[]>;
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
    }, {
        id: string;
        name: string;
        description: string | null;
        priority: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
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
    }, {
        id: string;
        name: string;
        description: string | null;
        priority: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
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
    }, {
        id: string;
        model: string;
        apiKey: string;
        baseUrl: string | null;
        maxTokens: number | null;
        temperature: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }[]>;
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
    }, {
        id: string;
        model: string;
        apiKey: string;
        baseUrl: string | null;
        maxTokens: number | null;
        temperature: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
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
    }, {
        id: string;
        model: string;
        apiKey: string;
        baseUrl: string | null;
        maxTokens: number | null;
        temperature: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
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
export default settingsRouter;
