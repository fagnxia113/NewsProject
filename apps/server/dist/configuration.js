"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration = () => {
    const isProd = process.env.NODE_ENV === 'production';
    const port = process.env.PORT || 4000;
    const host = process.env.HOST || '0.0.0.0';
    const maxRequestPerMinute = parseInt(`${process.env.MAX_REQUEST_PER_MINUTE}|| 60`);
    const authCode = process.env.AUTH_CODE;
    const platformUrl = process.env.PLATFORM_URL || 'https://weread.111965.xyz';
    const originUrl = process.env.SERVER_ORIGIN_URL || '';
    const feedMode = process.env.FEED_MODE;
    const databaseType = process.env.DATABASE_TYPE || 'mysql';
    const updateDelayTime = parseInt(`${process.env.UPDATE_DELAY_TIME} || 60`);
    const enableCleanHtml = process.env.ENABLE_CLEAN_HTML === 'true';
    const llmApiKey = process.env.LLM_API_KEY || '';
    const llmApiUrl = process.env.LLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const llmModel = process.env.LLM_MODEL || 'glm-4';
    const enableLLMDeduplication = process.env.ENABLE_LLM_DEDUPLICATION === 'true';
    return {
        server: { isProd, port, host },
        throttler: { maxRequestPerMinute },
        auth: { code: authCode },
        platform: { url: platformUrl },
        feed: {
            originUrl,
            mode: feedMode,
            updateDelayTime,
            enableCleanHtml,
        },
        database: {
            type: databaseType,
        },
        llm: {
            apiKey: llmApiKey,
            apiUrl: llmApiUrl,
            model: llmModel,
            enableDeduplication: enableLLMDeduplication,
        },
    };
};
exports.default = configuration;
//# sourceMappingURL=configuration.js.map