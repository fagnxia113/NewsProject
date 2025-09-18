"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let LlmService = class LlmService {
    constructor(prismaService, configService) {
        this.prismaService = prismaService;
        this.configService = configService;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    async getActiveLLMConfig() {
        const config = await this.prismaService.lLMConfig.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        if (!config) {
            return {
                model: process.env.LLM_MODEL || 'glm-4',
                apiKey: process.env.LLM_API_KEY || '',
                baseUrl: process.env.LLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                maxTokens: 4000,
                temperature: 0.3,
            };
        }
        return {
            model: config.model,
            apiKey: config.apiKey,
            baseUrl: config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            maxTokens: config.maxTokens || 4000,
            temperature: config.temperature || 0.3,
        };
    }
    async analyzeArticle(articleId) {
        try {
            const article = await this.prismaService.article.findUnique({
                where: { id: articleId },
                select: {
                    id: true,
                    title: true,
                    content: true,
                },
            });
            if (!article) {
                throw new Error(`文章不存在: ${articleId}`);
            }
            const [industries, newsTypes] = await Promise.all([
                this.prismaService.industry.findMany({
                    where: { isActive: true },
                    select: { name: true, description: true }
                }),
                this.prismaService.newsType.findMany({
                    where: { isActive: true },
                    select: { name: true, description: true }
                })
            ]);
            const prompt = this.buildAnalysisPrompt(article.title, article.content || '', industries.map(i => `${i.name}${i.description ? `(${i.description})` : ''}`).join(', '), newsTypes.map(t => `${t.name}${t.description ? `(${t.description})` : ''}`).join(', '));
            const response = await this.callLlmApi(prompt);
            const analysisResult = this.parseAnalysisResponse(response);
            await this.prismaService.article.update({
                where: { id: articleId },
                data: {
                    industry: analysisResult.industry,
                    newsType: analysisResult.newsType,
                    isProcessed: true,
                },
            });
            if (analysisResult.events && analysisResult.events.length > 0) {
                await this.saveEvents(articleId, analysisResult.events);
            }
            return {
                success: true,
                data: analysisResult,
            };
        }
        catch (error) {
            this.logger.error(`分析文章失败: ${articleId}`, error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    buildAnalysisPrompt(title, content, industry, newsType) {
        const industryInfo = industry ? `预设行业：${industry}` : '请自动识别文章所属行业';
        const newsTypeInfo = newsType ? `预设新闻类型：${newsType}` : '请自动识别新闻类型';
        return `
你是一个专业的新闻分析专家，请对以下文章进行分析。

${industryInfo}
${newsTypeInfo}

文章标题：${title}

文章内容：
${content}

请按照以下要求进行分析：

1. 判断文章是否包含与预设行业和类型相关的新闻，如果不相关，请返回空结果。

2. 如果相关，请将文章内容拆分为多个独立的新闻事件（单篇文章可能包含多条新闻），每条新闻需包含：
   - 标题：简洁明了，突出事件核心
   - 简要：从文章中提取关键信息，可进行轻微改写但不得变更原文含义，字数严格控制在200字以内
   - 类型：如"投资融资"、"政策法规"、"企业动态"、"技术突破"等
   - 相关实体：如公司名称、人物、地点等

3. 请以JSON格式返回分析结果，格式如下：
\`\`\`json
{
  "industry": "文章所属行业",
  "newsType": "文章主要类型",
  "isRelevant": true/false,
  "events": [
    {
      "title": "新闻标题1",
      "summary": "新闻简要1，控制在200字以内",
      "type": "新闻类型1",
      "entities": [
        {
          "name": "实体名称1",
          "type": "实体类型1"
        }
      ]
    }
  ]
}
\`\`\`

如果文章与预设行业和类型不相关，请返回：
\`\`\`json
{
  "industry": "文章所属行业",
  "newsType": "文章主要类型",
  "isRelevant": false,
  "events": []
}
\`\`\`
    `;
    }
    async callLlmApi(prompt) {
        try {
            const config = await this.getActiveLLMConfig();
            if (!config.apiKey) {
                throw new Error('LLM API密钥未配置');
            }
            const response = await fetch(config.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${config.apiKey}`,
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: config.temperature,
                    max_tokens: config.maxTokens,
                }),
            });
            if (!response.ok) {
                throw new Error(`LLM API调用失败: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data.choices[0].message.content;
        }
        catch (error) {
            this.logger.error('LLM API调用失败', error);
            throw new Error(`LLM API调用失败: ${error.message}`);
        }
    }
    parseAnalysisResponse(response) {
        try {
            let cleanResponse = response.trim();
            const jsonBlockMatch = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonBlockMatch) {
                cleanResponse = jsonBlockMatch[1];
            }
            const result = JSON.parse(cleanResponse);
            if (!result.industry || !result.newsType) {
                throw new Error('分析结果缺少必要字段');
            }
            const validNewsTypes = ['investment', 'policy', 'company', 'tech'];
            if (!validNewsTypes.includes(result.newsType)) {
                result.newsType = 'company';
            }
            if (!result.events) {
                result.events = [];
            }
            if (result.isRelevant === false) {
                result.events = [];
            }
            return result;
        }
        catch (error) {
            this.logger.error('解析分析响应失败', error);
            this.logger.error('原始响应内容:', response);
            return {
                industry: '其他',
                newsType: 'company',
                isRelevant: false,
                events: [],
            };
        }
    }
    async saveEvents(articleId, events) {
        try {
            for (const event of events) {
                const createdEvent = await this.prismaService.splitEvent.create({
                    data: {
                        title: event.title,
                        summary: event.summary,
                        articleId: articleId,
                        splitIndex: 0,
                        originalLink: '',
                    },
                });
                if (event.entities && event.entities.length > 0) {
                    for (const entity of event.entities) {
                        if (entity.type === '公司') {
                            await this.prismaService.companyElement.create({
                                data: {
                                    companyName: entity.name,
                                    articleId: articleId,
                                },
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            this.logger.error('保存事件数据失败', error);
            throw new Error(`保存事件数据失败: ${error.message}`);
        }
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], LlmService);
//# sourceMappingURL=llm.service.js.map