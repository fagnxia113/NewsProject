const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== 删除预设LLM模型 ===\n');
  
  // 获取所有配置
  const allConfigs = await prisma.lLMConfig.findMany();
  console.log(`当前共有 ${allConfigs.length} 个配置\n`);
  
  // 显示所有配置
  allConfigs.forEach((config, index) => {
    console.log(`${index + 1}. 模型: ${config.model}`);
    console.log(`   状态: ${config.isActive ? '启用' : '禁用'}`);
    console.log(`   创建时间: ${new Date(config.createdAt).toLocaleString()}`);
    console.log(`   API地址: ${config.baseUrl || 'N/A'}`);
    console.log(`   预设模型: ${isPresetModel(config.model) ? '是' : '否'}\n`);
  });
  
  // 识别预设模型
  const presetModels = allConfigs.filter(config => isPresetModel(config.model));
  console.log(`发现 ${presetModels.length} 个预设模型:\n`);
  presetModels.forEach(model => {
    console.log(`- ${model.model}`);
  });
  
  if (presetModels.length > 0) {
    console.log('\n正在删除预设模型...');
    
    // 删除预设模型
    for (const model of presetModels) {
      await prisma.lLMConfig.delete({
        where: { id: model.id }
      });
      console.log(`✓ 已删除: ${model.model}`);
    }
    
    console.log('\n预设模型删除成功!\n');
  } else {
    console.log('\n没有发现预设模型需要删除。\n');
  }
  
  // 显示剩余配置
  const remainingConfigs = await prisma.lLMConfig.findMany();
  console.log(`剩余 ${remainingConfigs.length} 个配置:`);
  remainingConfigs.forEach((config, index) => {
    console.log(`${index + 1}. 模型: ${config.model}`);
    console.log(`   状态: ${config.isActive ? '启用' : '禁用'}`);
    console.log(`   创建时间: ${new Date(config.createdAt).toLocaleString()}\n`);
  });
  
  console.log('=== 操作完成 ===');
}

// 判断是否为预设模型
function isPresetModel(modelName) {
  const presetModels = [
    'gpt-3.5-turbo',
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4o',
    'claude-3-haiku',
    'claude-3-sonnet',
    'claude-3-opus',
    'gemini-pro',
    'llama2',
    'llama3',
    'mistral',
    'mixtral',
    'DeepSeek-R1'
  ];
  
  return presetModels.includes(modelName);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
