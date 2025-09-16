const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== 新闻分析系统最终测试 ===\n');
  
  // 1. 检查总体统计
  const totalArticles = await prisma.article.count();
  const processedArticles = await prisma.article.count({
    where: { isProcessed: true }
  });
  const unprocessedArticles = await prisma.article.count({
    where: { isProcessed: false }
  });
  
  console.log('文章统计:');
  console.log(`  总文章数: ${totalArticles}`);
  console.log(`  已处理文章数: ${processedArticles}`);
  console.log(`  未处理文章数: ${unprocessedArticles}`);
  console.log(`  处理率: ${((processedArticles / totalArticles) * 100).toFixed(2)}%\n`);
  
  // 2. 检查行业分布
  const industryDistribution = await prisma.article.groupBy({
    by: ['industry'],
    where: { isProcessed: true },
    _count: { id: true }
  });
  
  console.log('行业分布:');
  industryDistribution.forEach(item => {
    console.log(`  ${item.industry || '未分类'}: ${item._count.id} 篇`);
  });
  console.log('');
  
  // 3. 检查新闻类型分布
  const typeDistribution = await prisma.article.groupBy({
    by: ['newsType'],
    where: { isProcessed: true },
    _count: { id: true }
  });
  
  console.log('新闻类型分布:');
  typeDistribution.forEach(item => {
    console.log(`  ${item.newsType || '未分类'}: ${item._count.id} 篇`);
  });
  console.log('');
  
  // 4. 显示最近处理的5篇文章
  const recentArticles = await prisma.article.findMany({
    where: { isProcessed: true },
    orderBy: { processedTime: 'desc' },
    take: 5,
    select: {
      title: true,
      industry: true,
      newsType: true,
      processedTime: true
    }
  });
  
  console.log('最近处理的5篇文章:');
  recentArticles.forEach((article, index) => {
    const processTime = new Date(article.processedTime * 1000).toLocaleString();
    console.log(`  ${index + 1}. ${article.title}`);
    console.log(`     行业: ${article.industry || '未分类'}, 类型: ${article.newsType || '未分类'}`);
    console.log(`     处理时间: ${processTime}\n`);
  });
  
  console.log('=== 测试完成 ===');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
