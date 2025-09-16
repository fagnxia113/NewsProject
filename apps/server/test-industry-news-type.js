const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== 测试行业和新闻类型获取 ===\n');
  
  // 创建测试行业
  console.log('创建测试行业...');
  const testIndustry = await prisma.industry.create({
    data: {
      name: '测试行业-' + Date.now(),
      description: '用于测试的行业',
      priority: 1,
      isActive: true,
    },
  });
  console.log(`✓ 创建行业: ${testIndustry.name}\n`);
  
  // 创建测试新闻类型
  console.log('创建测试新闻类型...');
  const testNewsType = await prisma.newsType.create({
    data: {
      name: '测试类型-' + Date.now(),
      description: '用于测试的新闻类型',
      priority: 1,
      isActive: true,
    },
  });
  console.log(`✓ 创建新闻类型: ${testNewsType.name}\n`);
  
  // 获取预设的行业和新闻类型
  console.log('获取预设的行业和新闻类型...');
  const [industries, newsTypes] = await Promise.all([
    prisma.industry.findMany({
      where: { isActive: true },
      select: { name: true, description: true }
    }),
    prisma.newsType.findMany({
      where: { isActive: true },
      select: { name: true, description: true }
    })
  ]);
  
  console.log('预设行业:');
  industries.forEach((industry, index) => {
    console.log(`  ${index + 1}. ${industry.name}${industry.description ? ` (${industry.description})` : ''}`);
  });
  
  console.log('\n预设新闻类型:');
  newsTypes.forEach((type, index) => {
    console.log(`  ${index + 1}. ${type.name}${type.description ? ` (${type.description})` : ''}`);
  });
  
  // 测试构建提示词
  console.log('\n=== 测试提示词构建 ===');
  const industryList = industries.map(i => `${i.name}${i.description ? `(${i.description})` : ''}`).join(', ');
  const newsTypeList = newsTypes.map(t => `${t.name}${t.description ? `(${t.description})` : ''}`).join(', ');
  
  const prompt = `
你是一个专业的新闻分析专家，请对以下文章进行分析。

预设行业：${industryList}
预设新闻类型：${newsTypeList}

文章标题：AI在医疗领域的最新突破

文章内容：
近日，某科技公司宣布其AI系统在癌症早期诊断方面取得了重大突破，准确率达到了99.2%。该系统基于深度学习技术，能够通过分析医学影像快速识别早期癌症病灶...

请按照以下要求进行分析：

1. 判断文章是否包含与预设行业和类型相关的新闻，如果不相关，请返回空结果。

2. 如果相关，请将文章内容拆分为多个独立的新闻事件（单篇文章可能包含多条新闻），每条新闻需包含：
   - 标题：简洁明了，突出事件核心
   - 简要：从文章中提取关键信息，可进行轻微改写但不得变更原文含义，字数严格控制在200字以内
   - 类型：如"投资融资"、"政策法规"、"企业动态"、"技术突破"等
   - 相关实体：如公司名称、人物、地点等

3. 请以JSON格式返回分析结果...
  `;
  
  console.log('构建的提示词预览:');
  console.log(prompt.substring(0, 500) + '...\n');
  
  console.log('=== 测试完成 ===');
  
  // 清理测试数据
  console.log('清理测试数据...');
  await prisma.industry.delete({ where: { id: testIndustry.id } });
  await prisma.newsType.delete({ where: { id: testNewsType.id } });
  console.log('✓ 测试数据已清理');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
