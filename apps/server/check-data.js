import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:../data/wewe-rss.db',
    },
  },
});

async function main() {
  try {
    // 查询文章总数
    const articleCount = await prisma.article.count();
    console.log(`文章总数: ${articleCount}`);

    // 查询前5篇文章
    const articles = await prisma.article.findMany({
      take: 5,
    });
    
    console.log('\n前5篇文章:');
    for (const [index, article] of articles.entries()) {
      console.log(`${index + 1}. ID: ${article.id}`);
      console.log(`   标题: ${article.title}`);
      
      // 单独查询公众号信息
      if (article.mpId) {
        const feed = await prisma.feed.findUnique({
          where: { id: article.mpId },
        });
        console.log(`   公众号: ${feed?.mpName || '未知'}`);
      } else {
        console.log(`   公众号: 未知`);
      }
      
      console.log(`   发布时间: ${new Date(article.publishTime * 1000).toLocaleString()}`);
      console.log(`   行业: ${article.industry || '未分类'}`);
      console.log(`   新闻类型: ${article.newsType || '未分类'}`);
      console.log(`   是否重复: ${article.isDuplicate}`);
      console.log(`   是否处理: ${article.isProcessed}`);
      console.log('---');
    }

    // 查询所有公众号
    const feeds = await prisma.feed.findMany();
    console.log(`\n公众号总数: ${feeds.length}`);
    feeds.forEach((feed, index) => {
      console.log(`${index + 1}. ID: ${feed.id}, 名称: ${feed.mpName}`);
    });
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();