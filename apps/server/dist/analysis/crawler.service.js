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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const cheerio = __importStar(require("cheerio"));
let CrawlerService = class CrawlerService {
    constructor(prismaService, configService) {
        this.prismaService = prismaService;
        this.configService = configService;
        this.logger = new common_1.Logger(this.constructor.name);
        this.baseUrl = process.env.CRAWLER_BASE_URL || 'https://mp.weixin.qq.com';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        };
    }
    async crawlArticleContent(articleId) {
        try {
            const existingArticle = await this.prismaService.article.findUnique({
                where: { id: articleId },
            });
            if (!existingArticle) {
                throw new Error(`文章不存在: ${articleId}`);
            }
            if (existingArticle.content && existingArticle.content.length > 0) {
                return {
                    success: true,
                    message: '文章内容已存在',
                    data: existingArticle,
                };
            }
            const url = `${this.baseUrl}/s/${articleId}`;
            const content = await this.fetchArticleContent(url);
            const updatedArticle = await this.prismaService.article.update({
                where: { id: articleId },
                data: {
                    content: content,
                },
            });
            return {
                success: true,
                message: '文章内容爬取成功',
                data: updatedArticle,
            };
        }
        catch (error) {
            this.logger.error(`爬取文章内容失败: ${articleId}`, error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async batchCrawlArticleContent(articleIds) {
        const results = [];
        for (const articleId of articleIds) {
            try {
                const result = await this.crawlArticleContent(articleId);
                results.push(result);
                await this.delay(1000);
            }
            catch (error) {
                this.logger.error(`批量爬取文章内容失败: ${articleId}`, error);
                results.push({
                    success: false,
                    error: error.message,
                    articleId,
                });
            }
        }
        return {
            success: true,
            message: `批量爬取完成，成功: ${results.filter(r => r.success).length}, 失败: ${results.filter(r => !r.success).length}`,
            data: results,
        };
    }
    async crawlMpArticles(mpId, limit = 10) {
        try {
            const feed = await this.prismaService.feed.findUnique({
                where: { id: mpId },
            });
            if (!feed) {
                throw new Error(`公众号不存在: ${mpId}`);
            }
            const articles = await this.fetchMpArticles(mpId, limit);
            const savedArticles = [];
            for (const article of articles) {
                try {
                    const existingArticle = await this.prismaService.article.findUnique({
                        where: { id: article.id },
                    });
                    if (!existingArticle) {
                        const newArticle = await this.prismaService.article.create({
                            data: {
                                id: article.id,
                                mpId: mpId,
                                title: article.title,
                                picUrl: article.picUrl || '',
                                publishTime: article.publishTime,
                                content: article.content || '',
                            },
                        });
                        savedArticles.push(newArticle);
                    }
                    else {
                        const updatedArticle = await this.prismaService.article.update({
                            where: { id: article.id },
                            data: {
                                title: article.title,
                                picUrl: article.picUrl || '',
                                publishTime: article.publishTime,
                                content: article.content || existingArticle.content,
                            },
                        });
                        savedArticles.push(updatedArticle);
                    }
                }
                catch (error) {
                    this.logger.error(`保存文章失败: ${article.id}`, error);
                }
            }
            await this.prismaService.feed.update({
                where: { id: mpId },
                data: {
                    syncTime: Math.floor(Date.now() / 1000),
                },
            });
            return {
                success: true,
                message: `成功爬取 ${savedArticles.length} 篇文章`,
                data: savedArticles,
            };
        }
        catch (error) {
            this.logger.error(`爬取公众号文章失败: ${mpId}`, error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async fetchArticleContent(url) {
        try {
            this.logger.log(`开始爬取文章内容: ${url}`);
            const response = await fetch(url, {
                headers: this.headers,
            });
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            $('script, style, nav, header, footer, .ad, .advertisement, .comment').remove();
            let content = '';
            if (url.includes('mp.weixin.qq.com')) {
                content = $('.rich_media_content').text().trim();
                if (!content) {
                    content = $('#js_content').text().trim();
                }
            }
            else {
                const contentSelectors = [
                    '.article-content',
                    '.post-content',
                    '.entry-content',
                    '.content',
                    '.article-body',
                    '.post-body',
                    'article',
                    '.main-content',
                    '#content',
                    '.text-content',
                ];
                for (const selector of contentSelectors) {
                    const element = $(selector);
                    if (element.length > 0) {
                        content = element.text().trim();
                        if (content.length > 200) {
                            break;
                        }
                    }
                }
                if (!content) {
                    const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();
                    content = paragraphs.join('\n\n');
                }
            }
            content = content
                .replace(/\s+/g, ' ')
                .replace(/\n\s*\n/g, '\n\n')
                .trim();
            if (!content || content.length < 100) {
                throw new Error('无法提取有效的文章内容');
            }
            this.logger.log(`成功爬取文章内容，长度: ${content.length}`);
            return content;
        }
        catch (error) {
            this.logger.error(`爬取文章内容失败: ${url}`, error);
            throw new Error(`获取文章内容失败: ${error.message}`);
        }
    }
    async fetchMpArticles(mpId, limit) {
        try {
            await this.delay(2000);
            const articles = [];
            const now = Math.floor(Date.now() / 1000);
            for (let i = 0; i < limit; i++) {
                articles.push({
                    id: `article_${mpId}_${now - i * 86400}`,
                    title: `模拟文章标题 ${i + 1}`,
                    picUrl: `https://example.com/pic_${i + 1}.jpg`,
                    publishTime: now - i * 86400,
                    content: `这是第 ${i + 1} 篇模拟文章的内容。在实际项目中，这里应该是从微信公众号获取的真实文章内容。`,
                });
            }
            return articles;
        }
        catch (error) {
            this.logger.error('获取公众号文章列表失败', error);
            throw new Error(`获取公众号文章列表失败: ${error.message}`);
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.CrawlerService = CrawlerService;
exports.CrawlerService = CrawlerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], CrawlerService);
//# sourceMappingURL=crawler.service.js.map