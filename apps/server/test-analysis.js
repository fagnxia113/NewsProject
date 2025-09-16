const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 获取一些未处理的文章
  const articles = await prisma.article.findMany({
    where: {
      isProcessed: false,
    },
    take: 3, // 只处理3篇文章进行测试
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
  
  console.log(`找到 ${articles.length} 篇未处理的文章`);
  
  // 显示文章标题
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
  });
  
  // 模拟处理文章
  console.log('\n开始处理文章...');
  for (const article of articles) {
    console.log(`处理文章: ${article.title}`);
    
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 更新文章状态为已处理
    await prisma.article.update({
      where: { id: article.id },
      data: {
        isProcessed: true,
        industry: '科技',
        newsType: '企业动态',
        processedTime: Math.floor(Date.now() / 1000),
      },
    });
    
    console.log(`文章处理完成: ${article.title}`);
  }
  
  console.log('\n所有文章处理完成!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
