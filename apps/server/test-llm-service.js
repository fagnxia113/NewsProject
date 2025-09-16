const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== LLM服务测试 ===\n');
  
  // 模拟LLM服务的getActiveLLMConfig方法
  async function getActiveLLMConfig() {
    const config = await prisma.lLMConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      // 如果没有配置，使用环境变量作为默认值
      return {
        model: process.env.LLM_MODEL || 'glm-4',
        apiKey: process.env.LLM_API_KEY || '',
        baseUrl: process.env.LLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        maxTokens: 4000,
        temperature: 0.3,
      };
    }

    return {
      model: config.model,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 0.3,
    };
  }
  
  // 测试获取激活的LLM配置
  console.log('获取激活的LLM配置...');
  const activeConfig = await getActiveLLMConfig();
  
  console.log('激活的配置:');
  console.log(`  模型: ${activeConfig.model}`);
  console.log(`  API地址: ${activeConfig.baseUrl}`);
  console.log(`  最大令牌数: ${activeConfig.maxTokens}`);
  console.log(`  温度: ${activeConfig.temperature}\n`);
  
  // 验证是否正确获取了我们刚刚创建的DeepSeek配置
  if (activeConfig.model === 'DeepSeek-R1') {
    console.log('✓ 成功获取了最新的激活配置 (DeepSeek-R1)');
  } else {
    console.log('✗ 未能获取正确的激活配置');
  }
  
  console.log('\n=== 测试完成 ===');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
