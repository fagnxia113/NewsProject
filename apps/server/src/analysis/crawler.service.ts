import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@server/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@server/configuration';
import * as cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {
    this.baseUrl = process.env.CRAWLER_BASE_URL || 'https://mp.weixin.qq.com';
    
    // 设置请求头
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };
  }

  /**
   * 爬取文章内容
   * @param articleId 文章ID
   * @returns 爬取结果
   */
  async crawlArticleContent(articleId: string) {
    try {
      // 检查文章是否已存在
      const existingArticle = await this.prismaService.article.findUnique({
        where: { id: articleId },
      });

      if (!existingArticle) {
        throw new Error(`文章不存在: ${articleId}`);
      }

      // 如果文章已有内容，则直接返回
      if (existingArticle.content && existingArticle.content.length > 0) {
        return {
          success: true,
          message: '文章内容已存在',
          data: existingArticle,
        };
      }

      // 构建文章URL
      const url = `${this.baseUrl}/s/${articleId}`;

      // 爬取文章内容
      const content = await this.fetchArticleContent(url);

      // 更新文章内容
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
    } catch (error) {
      this.logger.error(`爬取文章内容失败: ${articleId}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 批量爬取文章内容
   * @param articleIds 文章ID列表
   * @returns 爬取结果
   */
  async batchCrawlArticleContent(articleIds: string[]) {
    const results: any[] = [];
    
    for (const articleId of articleIds) {
      try {
        const result = await this.crawlArticleContent(articleId);
        results.push(result);
        
        // 添加延迟，避免请求过于频繁
        await this.delay(1000 + Math.random() * 2000); // 1-3秒随机延迟
      } catch (error) {
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

  /**
   * 爬取公众号文章列表
   * @param mpId 公众号ID
   * @param limit 获取数量限制
   * @returns 爬取结果
   */
  async crawlMpArticles(mpId: string, limit: number = 10) {
    try {
      // 检查公众号是否存在
      const feed = await this.prismaService.feed.findUnique({
        where: { id: mpId },
      });

      if (!feed) {
        throw new Error(`公众号不存在: ${mpId}`);
      }

      // 这里使用模拟的爬取逻辑
      // 在实际项目中，需要实现真实的爬取逻辑，可能需要处理登录、验证码等问题
      const articles = await this.fetchMpArticles(mpId, limit);

      // 保存文章到数据库
      const savedArticles: any[] = [];
      for (const article of articles) {
        try {
          // 检查文章是否已存在
          const existingArticle = await this.prismaService.article.findUnique({
            where: { id: article.id },
          });

          if (!existingArticle) {
            // 创建新文章
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
          } else {
            // 更新现有文章
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
        } catch (error) {
          this.logger.error(`保存文章失败: ${article.id}`, error);
        }
      }

      // 更新公众号的同步时间
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
    } catch (error) {
      this.logger.error(`爬取公众号文章失败: ${mpId}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 获取文章内容
   * @param url 文章URL
   * @returns 文章内容
   */
  private async fetchArticleContent(url: string): Promise<string> {
    try {
      this.logger.log(`开始爬取文章内容: ${url}`);
      
      // 添加随机延迟，避免请求过于频繁
      await this.delay(500 + Math.random() * 1000);
      
      // 使用fetch获取网页内容
      const response = await fetch(url, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const html = await response.text();
      
      // 使用cheerio解析HTML
      const $ = cheerio.load(html);
      
      // 移除不需要的元素
      $('script, style, nav, header, footer, .ad, .advertisement, .comment').remove();
      
      // 尝试提取文章内容
      let content = '';
      
      // 针对微信公众号文章的特殊处理
      if (url.includes('mp.weixin.qq.com')) {
        // 微信公众号文章内容通常在.rich_media_content类中
        content = $('.rich_media_content').text().trim();
        
        // 如果没有找到内容，尝试其他选择器
        if (!content) {
          content = $('#js_content').text().trim();
        }
      } else {
        // 通用网站内容提取
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
            if (content.length > 200) { // 确保内容足够长
              break;
            }
          }
        }
        
        // 如果没有找到内容，尝试提取整个页面的主要内容
        if (!content) {
          // 提取所有段落
          const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();
          content = paragraphs.join('\n\n');
        }
      }
      
      // 清理内容
      content = content
        .replace(/\s+/g, ' ') // 替换多个空白字符为单个空格
        .replace(/\n\s*\n/g, '\n\n') // 清理多余的换行
        .trim();
      
      if (!content || content.length < 100) {
        throw new Error('无法提取有效的文章内容');
      }
      
      this.logger.log(`成功爬取文章内容，长度: ${content.length}`);
      return content;
    } catch (error) {
      this.logger.error(`爬取文章内容失败: ${url}`, error);
      throw new Error(`获取文章内容失败: ${error.message}`);
    }
  }

  /**
   * 获取公众号文章列表
   * @param mpId 公众号ID
   * @param limit 获取数量限制
   * @returns 文章列表
   */
  private async fetchMpArticles(mpId: string, limit: number): Promise<any[]> {
    try {
      // 这里使用模拟的文章列表获取
      // 在实际项目中，需要实现真实的文章列表获取逻辑
      
      // 模拟API调用延迟
      await this.delay(2000);
      
      // 模拟返回文章列表
      const articles: any[] = [];
      const now = Math.floor(Date.now() / 1000);
      
      for (let i = 0; i < limit; i++) {
        articles.push({
          id: `article_${mpId}_${now - i * 86400}`, // 模拟文章ID
          title: `模拟文章标题 ${i + 1}`,
          picUrl: `https://example.com/pic_${i + 1}.jpg`,
          publishTime: now - i * 86400, // 模拟发布时间，每天一篇
          content: `这是第 ${i + 1} 篇模拟文章的内容。在实际项目中，这里应该是从微信公众号获取的真实文章内容。`,
        });
      }
      
      return articles;
      
      // 实际文章列表获取示例（可能需要使用puppeteer等工具）：
      /*
      // 使用puppeteer模拟浏览器行为
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      // 设置请求头
      await page.setExtraHTTPHeaders(this.headers);
      
      // 访问公众号主页
      await page.goto(`https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=${mpId}&scene=124#wechat_redirect`);
      
      // 等待页面加载
      await page.waitForSelector('.weui_media_box');
      
      // 获取文章列表
      const articles = await page.evaluate(() => {
        const items = document.querySelectorAll('.weui_media_box');
        return Array.from(items).map(item => {
          const link = item.querySelector('.weui_media_title')?.getAttribute('hrefs') || '';
          const articleId = link.match(/s\/([^?]*)/)?.[1] || '';
          
          return {
            id: articleId,
            title: item.querySelector('.weui_media_title')?.innerText || '',
            picUrl: item.querySelector('.weui_media_appmsg_thumb')?.getAttribute('data-src') || '',
            publishTime: item.querySelector('.weui_media_extra_info')?.innerText || '',
            content: '', // 内容需要单独获取
          };
        });
      });
      
      await browser.close();
      
      return articles.slice(0, limit);
      */
    } catch (error) {
      this.logger.error('获取公众号文章列表失败', error);
      throw new Error(`获取公众号文章列表失败: ${error.message}`);
    }
  }

  /**
   * 延迟函数
   * @param ms 延迟毫秒数
   * @returns Promise
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
