const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== 当前所有LLM配置 ===\n');
  
  const configs = await prisma.lLMConfig.findMany();
  configs.forEach((config, index) => {
    console.log(`${index + 1}. 模型: ${config.model}`);
    console.log(`   状态: ${config.isActive ? '启用' : '禁用'}`);
    console.log(`   创建时间: ${new Date(config.createdAt).toLocaleString()}`);
    console.log(`   API地址: ${config.baseUrl || 'N/A'}`);
    console.log(`   最大令牌数: ${config.maxTokens || '默认'}`);
    console.log(`   温度: ${config.temperature || '默认'}\n`);
  });
  
  console.log(`总共 ${configs.length} 个配置\n`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
