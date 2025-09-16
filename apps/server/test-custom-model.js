const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== 自定义模型配置测试 ===\n');
  
  // 1. 创建一个自定义模型配置
  console.log('创建自定义模型配置...');
  const customConfig = await prisma.lLMConfig.create({
    data: {
      model: 'custom-model-id-12345',
      apiKey: 'sk-custom-key-abcdef',
      baseUrl: 'https://api.custom-model.com/v1/chat/completions',
      maxTokens: 3000,
      temperature: 0.8,
      isActive: true,
    },
  });
  
  console.log('自定义配置创建成功:');
  console.log(`  ID: ${customConfig.id}`);
  console.log(`  模型: ${customConfig.model}`);
  console.log(`  API地址: ${customConfig.baseUrl}`);
  console.log(`  状态: ${customConfig.isActive ? '启用' : '禁用'}\n`);
  
  // 2. 验证配置已创建
  const allConfigs = await prisma.lLMConfig.findMany();
  console.log('所有LLM配置:');
  allConfigs.forEach((config, index) => {
    console.log(`  ${index + 1}. 模型: ${config.model}`);
    console.log(`     状态: ${config.isActive ? '启用' : '禁用'}`);
    console.log(`     创建时间: ${new Date(config.createdAt).toLocaleString()}\n`);
  });
  
  // 3. 测试获取激活的配置
  const activeConfig = await prisma.lLMConfig.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  
  console.log('当前激活的配置:');
  if (activeConfig) {
    console.log(`  模型: ${activeConfig.model}`);
    console.log(`  API地址: ${activeConfig.baseUrl}`);
    console.log(`  最大令牌数: ${activeConfig.maxTokens}`);
    console.log(`  温度: ${activeConfig.temperature}\n`);
    
    if (activeConfig.model === 'custom-model-id-12345') {
      console.log('✓ 成功获取了自定义模型配置');
    } else {
      console.log('✗ 未能获取正确的自定义模型配置');
    }
  } else {
    console.log('  没有找到激活的配置\n');
  }
  
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
