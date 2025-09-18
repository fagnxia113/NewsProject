const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // 添加更多行业配置
    const industries = [
      { name: '人工智能', description: 'AI技术及相关产业发展' },
      { name: '生物科技', description: '生物医药、基因技术等领域' },
      { name: '新能源', description: '太阳能、风能、储能等清洁能源' },
      { name: '金融科技', description: '区块链、数字货币、数字支付等' },
      { name: '智能制造', description: '工业4.0、机器人、自动化生产' },
      { name: '数字经济', description: '电子商务、数字营销、平台经济' },
      { name: '智慧城市', description: '物联网、城市管理、智慧交通' },
      { name: '绿色科技', description: '环保技术、循环经济、碳中和' },
      { name: '半导体', description: '芯片设计、制造、封装测试' },
      { name: '云计算', description: '云服务、边缘计算、数据中心' },
      { name: '物联网', description: '传感器、连接技术、智能设备' }
    ];
    
    for (const industry of industries) {
      await prisma.industry.upsert({
        where: { name: industry.name },
        update: {},
        create: {
          name: industry.name,
          description: industry.description,
          priority: 0,
          isActive: true
        }
      });
    }
    
    // 添加更多新闻类型配置
    const newsTypes = [
      { name: '投融资', description: '企业融资、投资并购、IPO等资本活动' },
      { name: '政策法规', description: '政府政策、法律法规、监管措施' },
      { name: '企业动态', description: '公司战略、产品发布、合作签约' },
      { name: '技术突破', description: '科研成果、技术创新、专利发明' },
      { name: '市场分析', description: '行业趋势、市场规模、竞争格局' },
      { name: '人才招聘', description: '高管任命、团队扩张、人才战略' },
      { name: '国际合作', description: '跨境合作、海外拓展、国际交流' }
    ];
    
    for (const type of newsTypes) {
      await prisma.newsType.upsert({
        where: { name: type.name },
        update: {},
        create: {
          name: type.name,
          description: type.description,
          priority: 0,
          isActive: true
        }
      });
    }
    
    console.log('成功添加行业和新闻类型配置');
    
    // 验证添加结果
    const industryCount = await prisma.industry.count();
    const newsTypeCount = await prisma.newsType.count();
    
    console.log('当前共有 ' + industryCount + ' 个行业和 ' + newsTypeCount + ' 种新闻类型');
  } catch (error) {
    console.error('添加配置时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
