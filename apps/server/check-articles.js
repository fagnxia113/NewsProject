const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.article.count();
  console.log(`数据库中有 ${count} 篇文章`);
  
  // 查看前几篇文章的信息
  const articles = await prisma.article.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      isProcessed: true,
      industry: true,
      newsType: true,
    },
  });
  
  console.log('前5篇文章:');
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   ID: ${article.id}`);
    console.log(`   已处理: ${article.isProcessed}`);
    console.log(`   行业: ${article.industry || '未分类'}`);
    console.log(`   类型: ${article.newsType || '未分类'}`);
    console.log('');
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
