const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== LLM配置测试 ===\n');
  
  // 1. 查看现有的LLM配置
  const existingConfigs = await prisma.lLMConfig.findMany();
  console.log('现有LLM配置:');
  if (existingConfigs.length === 0) {
    console.log('  没有找到现有配置\n');
  } else {
    existingConfigs.forEach((config, index) => {
      console.log(`  ${index + 1}. 模型: ${config.model}`);
      console.log(`     状态: ${config.isActive ? '启用' : '禁用'}`);
      console.log(`     创建时间: ${new Date(config.createdAt).toLocaleString()}\n`);
    });
  }
  
  // 2. 创建一个新的LLM配置（模拟用户在前端添加的配置）
  console.log('创建新的LLM配置...');
  const newConfig = await prisma.lLMConfig.create({
    data: {
      model: 'DeepSeek-R1',
      apiKey: 'sk-test-key-12345',
      baseUrl: 'https://ds.yovole.com/api/chat/completions',
      maxTokens: 2000,
      temperature: 0.7,
      isActive: true,
    },
  });
  
  console.log('新配置创建成功:');
  console.log(`  ID: ${newConfig.id}`);
  console.log(`  模型: ${newConfig.model}`);
  console.log(`  API地址: ${newConfig.baseUrl}`);
  console.log(`  状态: ${newConfig.isActive ? '启用' : '禁用'}\n`);
  
  // 3. 验证新配置已创建
  const allConfigs = await prisma.lLMConfig.findMany();
  console.log('更新后的LLM配置:');
  allConfigs.forEach((config, index) => {
    console.log(`  ${index + 1}. 模型: ${config.model}`);
    console.log(`     状态: ${config.isActive ? '启用' : '禁用'}`);
    console.log(`     创建时间: ${new Date(config.createdAt).toLocaleString()}\n`);
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
