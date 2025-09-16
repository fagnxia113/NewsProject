const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 创建测试处理任务
  const task1 = await prisma.processingTask.create({
    data: {
      status: 2, // 已完成
      startTime: Math.floor(Date.now() / 1000) - 3600, // 1小时前开始
      endTime: Math.floor(Date.now() / 1000), // 刚刚结束
      totalArticles: 100,
      processedArticles: 100,
      successArticles: 95,
      failedArticles: 5,
      splitCount: 10,
      duplicateCount: 8,
    },
  });

  const task2 = await prisma.processingTask.create({
    data: {
      status: 1, // 处理中
      startTime: Math.floor(Date.now() / 1000) - 1800, // 30分钟前开始
      totalArticles: 50,
      processedArticles: 25,
      successArticles: 25,
      failedArticles: 0,
      splitCount: 5,
      duplicateCount: 3,
    },
  });

  console.log('创建了测试任务:', task1.id, task2.id);

  // 创建测试文章
  const article1 = await prisma.article.create({
    data: {
      id: 'test-article-1',
      mpId: 'test-feed-1',
      title: '测试文章1',
      content: '这是第一篇测试文章的内容，用于验证文章列表功能。',
      picUrl: '',
      publishTime: Math.floor(Date.now() / 1000) - 86400, // 1天前发布
      industry: '科技',
      newsType: 'investment',
      isProcessed: true,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      id: 'test-article-2',
      mpId: 'test-feed-2',
      title: '测试文章2',
      content: '这是第二篇测试文章的内容，用于验证文章列表功能。',
      picUrl: '',
      publishTime: Math.floor(Date.now() / 1000) - 43200, // 12小时前发布
      industry: '金融',
      newsType: 'policy',
      isProcessed: true,
    },
  });

  console.log('创建了测试文章:', article1.id, article2.id);

  // 创建测试Feed
  const feed1 = await prisma.feed.create({
    data: {
      id: 'test-feed-1',
      mpName: '测试公众号1',
      mpCover: '',
      mpIntro: '这是一个测试公众号',
      status: 1,
      syncTime: 0,
      updateTime: Math.floor(Date.now() / 1000),
    },
  });

  const feed2 = await prisma.feed.create({
    data: {
      id: 'test-feed-2',
      mpName: '测试公众号2',
      mpCover: '',
      mpIntro: '这是另一个测试公众号',
      status: 1,
      syncTime: 0,
      updateTime: Math.floor(Date.now() / 1000),
    },
  });

  console.log('创建了测试Feed:', feed1.id, feed2.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });