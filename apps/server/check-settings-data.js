const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const industries = await prisma.industry.findMany();
    console.log('行业数据:', industries);
    
    const newsTypes = await prisma.newsType.findMany();
    console.log('新闻类型数据:', newsTypes);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

checkData();