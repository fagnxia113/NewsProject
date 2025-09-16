// 智能分析模块初始化脚本
// 用于创建必要的数据库表和初始数据
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function initAIAnalysis() {
  try {
    console.log('开始初始化智能分析模块...');

    // 检查并创建必要的行业类型数据
    console.log('初始化行业类型...');
    const industries = [
      '人工智能', '大数据', '区块链', '云计算', '物联网',
      '生物医药', '新能源', '半导体', '智能制造', '元宇宙',
      '虚拟现实', '增强现实', '量子计算', '5G通信', '网络安全',
      '金融科技', '电子商务', '教育科技', '医疗健康', '自动驾驶'
    ];

    for (const industry of industries) {
      const existing = await prisma.industry.findFirst({
        where: { name: industry }
      });
      if (!existing) {
        await prisma.industry.create({
          data: { name: industry, isActive: true }
        });
        console.log(`创建行业: ${industry}`);
      }
    }

    // 检查并创建必要的新闻类型数据
    console.log('初始化新闻类型...');
    const newsTypes = [
      { name: '投融资' },
      { name: '政策' },
      { name: '企业动态' },
      { name: '技术突破' },
      { name: '行业观点' },
      { name: '市场分析' },
      { name: '产品发布' }
    ];

    for (const type of newsTypes) {
      const existing = await prisma.newsType.findFirst({
        where: { name: type.name }
      });
      if (!existing) {
        await prisma.newsType.create({
          data: {
            name: type.name,
            isActive: true
          }
        });
        console.log(`创建新闻类型: ${type.name}`);
      }
    }

    // 检查是否需要创建演示处理任务
    console.log('创建演示处理任务...');
    const demoTaskExists = await prisma.processingTask.findFirst({
      where: {
        // 使用时间范围来查找可能的演示任务
        createdAt: {
          gte: new Date(Date.now() - 86400000) // 24小时内
        }
      }
    });

    if (!demoTaskExists) {
      const demoTask = await prisma.processingTask.create({
        data: {
          status: 0, // 0: 待处理
          startTime: Math.floor(Date.now() / 1000), // 当前时间戳
          totalArticles: 10,
          processedArticles: 0,
          successArticles: 0,
          failedArticles: 0,
          splitCount: 0,
          duplicateCount: 0,
          filterCount: 0
        }
      });

      console.log(`创建演示处理任务成功: ${demoTask.id}`);
    }

    console.log('智能分析模块初始化完成!');
    process.exit(0);
  } catch (error) {
    console.error('初始化智能分析模块时出错:', error);
    process.exit(1);
  }
}

// 执行初始化
initAIAnalysis().finally(() => {
  prisma.$disconnect();
});