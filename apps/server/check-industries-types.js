const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    // 获取行业列表
    const industries = await prisma.industry.findMany();
    console.log('行业列表:');
    industries.forEach((industry, index) => {
      console.log(`  ${index + 1}. ${industry.name}`);
    });

    console.log('');

    // 获取新闻类型列表
    const newsTypes = await prisma.newsType.findMany();
    console.log('新闻类型列表:');
    newsTypes.forEach((type, index) => {
      console.log(`  ${index + 1}. ${type.name}`);
    });
  } catch (error) {
    console.error('查询出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
