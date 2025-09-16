const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const industries = await prisma.industry.findMany();
    console.log('行业列表:', industries);
    
    const newsTypes = await prisma.newsType.findMany();
    console.log('新闻类型列表:', newsTypes);
  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
