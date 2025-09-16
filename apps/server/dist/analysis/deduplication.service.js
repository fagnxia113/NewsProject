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
exports.DeduplicationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let DeduplicationService = class DeduplicationService {
    constructor(prismaService, configService) {
        this.prismaService = prismaService;
        this.configService = configService;
        this.logger = new common_1.Logger(this.constructor.name);
        this.similarityThreshold = 0.8;
        const llmConfig = this.configService.get('llm');
        this.enableLLMDeduplication = llmConfig?.enableDeduplication || false;
    }
    async checkDuplicate(articleId) {
        try {
            const currentArticle = await this.prismaService.article.findUnique({
                where: { id: articleId },
            });
            if (!currentArticle) {
                throw new Error(`文章不存在: ${articleId}`);
            }
            if (currentArticle.isDuplicate) {
                return {
                    success: true,
                    isDuplicate: true,
                    duplicateGroupId: currentArticle.duplicateGroupId,
                    message: '文章已标记为重复',
                };
            }
            const potentialDuplicates = await this.prismaService.article.findMany({
                where: {
                    id: { not: articleId },
                    isDuplicate: false,
                },
                orderBy: {
                    publishTime: 'desc',
                },
            });
            let duplicateArticle = null;
            let maxSimilarity = 0;
            if (this.enableLLMDeduplication && potentialDuplicates.length > 0) {
                const llmResult = await this.checkDuplicateWithLLM(currentArticle.title, currentArticle.content || '', potentialDuplicates);
                if (llmResult.isDuplicate && llmResult.duplicateArticleId) {
                    duplicateArticle = potentialDuplicates.find(a => a.id === llmResult.duplicateArticleId);
                    maxSimilarity = llmResult.similarity || 0.8;
                }
            }
            if (!duplicateArticle) {
                for (const article of potentialDuplicates) {
                    const similarity = await this.calculateSimilarity(currentArticle.title, article.title, currentArticle.content || '', article.content || '');
                    if (similarity > this.similarityThreshold && similarity > maxSimilarity) {
                        maxSimilarity = similarity;
                        duplicateArticle = article;
                    }
                }
            }
            if (duplicateArticle) {
                const groupId = duplicateArticle.duplicateGroupId || duplicateArticle.id;
                await this.prismaService.article.update({
                    where: { id: articleId },
                    data: {
                        isDuplicate: true,
                        duplicateGroupId: groupId,
                    },
                });
                if (!duplicateArticle.duplicateGroupId) {
                    await this.prismaService.article.update({
                        where: { id: duplicateArticle.id },
                        data: {
                            duplicateGroupId: groupId,
                        },
                    });
                }
                return {
                    success: true,
                    isDuplicate: true,
                    duplicateGroupId: groupId,
                    similarity: maxSimilarity,
                    message: '发现重复文章',
                };
            }
            return {
                success: true,
                isDuplicate: false,
                message: '未发现重复文章',
            };
        }
        catch (error) {
            this.logger.error(`检查文章重复失败: ${articleId}`, error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async batchCheckDuplicates(articleIds) {
        const results = [];
        for (const articleId of articleIds) {
            try {
                const result = await this.checkDuplicate(articleId);
                results.push({
                    articleId,
                    ...result,
                });
            }
            catch (error) {
                this.logger.error(`批量检查文章重复失败: ${articleId}`, error);
                results.push({
                    articleId,
                    success: false,
                    error: error.message,
                });
            }
        }
        const duplicateCount = results.filter(r => r.isDuplicate).length;
        return {
            success: true,
            message: `批量检查完成，发现 ${duplicateCount} 篇重复文章`,
            data: results,
        };
    }
    async calculateSimilarity(title1, title2, content1, content2) {
        try {
            const titleWeight = 0.6;
            const contentWeight = 0.4;
            const titleSimilarity = this.calculateTextSimilarity(title1, title2);
            const contentSimilarity = this.calculateTextSimilarity(content1, content2);
            const totalSimilarity = titleSimilarity * titleWeight + contentSimilarity * contentWeight;
            return totalSimilarity;
        }
        catch (error) {
            this.logger.error('计算相似度失败', error);
            return 0;
        }
    }
    calculateTextSimilarity(text1, text2) {
        if (!text1 || !text2) {
            return 0;
        }
        const words1 = this.extractWords(text1);
        const words2 = this.extractWords(text2);
        const intersection = words1.filter(word => words2.includes(word));
        const union = [...new Set([...words1, ...words2])];
        const jaccardSimilarity = intersection.length / union.length;
        const lcsSimilarity = this.calculateLCSSimilarity(text1, text2);
        const combinedSimilarity = (jaccardSimilarity + lcsSimilarity) / 2;
        return combinedSimilarity;
    }
    extractWords(text) {
        const cleanedText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
        const words = cleanedText.split(/\s+/).filter(word => word.length > 1);
        return words;
    }
    calculateLCSSimilarity(text1, text2) {
        const m = text1.length;
        const n = text2.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (text1[i - 1] === text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }
                else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        const lcsLength = dp[m][n];
        const maxLength = Math.max(m, n);
        return maxLength > 0 ? lcsLength / maxLength : 0;
    }
    async checkDuplicateWithLLM(title, content, articles) {
        try {
            const llmConfig = this.configService.get('llm');
            const apiKey = llmConfig?.apiKey || '';
            if (!apiKey) {
                this.logger.warn('LLM_API_KEY未配置，使用传统方法进行去重');
                return this.checkDuplicateWithTraditionalMethod(title, content, articles);
            }
            const apiUrl = llmConfig?.apiUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
            const model = llmConfig?.model || 'glm-4';
            const prompt = this.buildDuplicateCheckPrompt(title, content, articles);
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    max_tokens: 1000,
                    temperature: 0.1,
                }),
            });
            if (!response.ok) {
                throw new Error(`LLM API请求失败: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            const result = data.choices?.[0]?.message?.content;
            if (!result) {
                throw new Error('LLM返回结果为空');
            }
            return this.parseDuplicateCheckResult(result, articles);
        }
        catch (error) {
            this.logger.error(`使用大模型检查重复失败: ${error.message}`, error);
            return this.checkDuplicateWithTraditionalMethod(title, content, articles);
        }
    }
    buildDuplicateCheckPrompt(title, content, articles) {
        const maxArticles = 5;
        const limitedArticles = articles.slice(0, maxArticles);
        const articlesText = limitedArticles.map((article, index) => `
文章${index + 1}:
标题: ${article.title}
内容: ${article.content ? article.content.substring(0, 500) + '...' : '(无内容)'}
ID: ${article.id}
`).join('\n');
        return `
请判断以下文章是否与提供的文章列表中的任何一篇重复。

当前文章:
标题: ${title}
内容: ${content.substring(0, 1000)}...

已分析的文章:
${articlesText}

请以JSON格式返回判断结果，格式如下：
{
  "isDuplicate": true/false,
  "duplicateArticleId": "重复文章的ID（如果不重复则为空）",
  "similarity": 0.8,
  "reason": "判断原因"
}

判断标准：
1. 如果两篇文章报道的是同一事件，即使表达方式不同，也应视为重复
2. 如果两篇文章内容相似度超过80%，应视为重复
3. 如果只是主题相似但报道的事件不同，不应视为重复
4. 请确保返回的是有效的JSON格式
`;
    }
    parseDuplicateCheckResult(result, articles) {
        try {
            const parsedResult = JSON.parse(result);
            if (typeof parsedResult.isDuplicate !== 'boolean') {
                throw new Error('无效的isDuplicate字段');
            }
            if (parsedResult.isDuplicate && parsedResult.duplicateArticleId) {
                const duplicateArticle = articles.find(a => a.id === parsedResult.duplicateArticleId);
                if (!duplicateArticle) {
                    throw new Error('无效的duplicateArticleId');
                }
            }
            return {
                isDuplicate: parsedResult.isDuplicate,
                duplicateArticleId: parsedResult.duplicateArticleId,
                similarity: parsedResult.similarity || 0.8,
            };
        }
        catch (error) {
            this.logger.error('解析重复检查结果失败', error);
            return {
                isDuplicate: false,
            };
        }
    }
    async checkDuplicateWithTraditionalMethod(title, content, articles) {
        let maxSimilarity = 0;
        let duplicateArticleId;
        for (const article of articles) {
            const similarity = await this.calculateSimilarity(title, article.title, content, article.content || '');
            if (similarity > this.similarityThreshold && similarity > maxSimilarity) {
                maxSimilarity = similarity;
                duplicateArticleId = article.id;
            }
        }
        return {
            isDuplicate: !!duplicateArticleId,
            duplicateArticleId,
            similarity: maxSimilarity,
        };
    }
    async getDuplicateStats() {
        try {
            const totalArticles = await this.prismaService.article.count();
            const duplicateArticles = await this.prismaService.article.count({
                where: { isDuplicate: true },
            });
            const uniqueArticles = totalArticles - duplicateArticles;
            const duplicateGroups = await this.prismaService.article.groupBy({
                by: ['duplicateGroupId'],
                where: {
                    isDuplicate: true,
                    duplicateGroupId: { not: null },
                },
                _count: {
                    id: true,
                },
                orderBy: {
                    _count: {
                        id: 'desc',
                    },
                },
                take: 10,
            });
            const duplicateGroupDetails = [];
            for (const group of duplicateGroups) {
                if (group.duplicateGroupId) {
                    const originalArticle = await this.prismaService.article.findFirst({
                        where: {
                            duplicateGroupId: group.duplicateGroupId,
                            isDuplicate: false
                        },
                        select: {
                            id: true,
                            title: true,
                            publishTime: true,
                        },
                    });
                    duplicateGroupDetails.push({
                        originalArticle,
                        duplicateCount: group._count?.id || 0,
                    });
                }
            }
            return {
                success: true,
                data: {
                    totalArticles,
                    duplicateArticles,
                    uniqueArticles,
                    duplicateRate: totalArticles > 0 ? (duplicateArticles / totalArticles) * 100 : 0,
                    topDuplicateGroups: duplicateGroupDetails,
                },
            };
        }
        catch (error) {
            this.logger.error('获取重复文章统计失败', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
};
exports.DeduplicationService = DeduplicationService;
exports.DeduplicationService = DeduplicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], DeduplicationService);
//# sourceMappingURL=deduplication.service.js.map