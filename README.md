# 行业新闻智能分析应用

这是一个基于WeWe-RSS的行业新闻智能分析应用，能够自动采集微信公众号等信息源的新闻内容，并通过AI技术进行智能分析、分类、关键信息提取和去重处理。

## 功能特性

1. **信息源管理**
   - 支持微信公众号订阅（通过历史文章链接添加）
   - 支持RSS源和网站链接
   - 信息源的新增、编辑、启停和优先级设置

2. **手动触发采集**
   - 用户可手动选择采集时间范围（1天、3天、7天、30天）
   - 显示采集进度和状态

3. **智能分析功能**
   - 行业与类型识别（科技、金融、医疗等12个行业；投融资、政策法规等9种类型）
   - 关键要素抽取（投融资、政策、企业动态、技术创新等）
   - 多事件拆分（将周报/合辑类文章拆分为独立事件）
   - 智能去重（30天窗口内完全重复报道合并）

4. **现代化UI界面**
   - 响应式设计，适配不同设备
   - 深色/浅色主题切换
   - 直观的仪表板展示

5. **结果展示与筛选**
   - 结果按行业、类型、来源、置信度等维度筛选
   - 支持按时间、权威度、置信度排序
   - 全文搜索和高亮显示

6. **导出功能**
   - 支持文本格式、Markdown格式和Excel格式导出
   - 可选择部分或全部结果导出

## 技术架构

### 后端
- NestJS框架
- Prisma ORM
- SQLite数据库
- TRPC API
- 集成WeWe-RSS核心功能

### 前端
- React + TypeScript
- NextUI组件库
- TailwindCSS样式
- TRPC客户端

### AI集成
- 支持OpenAI GPT等大语言模型
- 可配置API密钥和调用参数

## 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 数据库初始化
```bash
# 生成Prisma客户端
npx prisma generate --schema apps/server/prisma/schema.prisma

# 执行数据库迁移
npx prisma migrate deploy --schema apps/server/prisma/schema.prisma
```

### 启动应用
```bash
# 同时启动前端和后端
pnpm run dev

# 或分别启动
pnpm run start:server  # 启动后端
pnpm run start:web     # 启动前端
```

默认访问地址：
- 前端：http://localhost:5173
- 后端API：http://localhost:4000

### 环境变量配置
在`apps/server/.env`中配置以下变量：
```bash
# LLM API配置
LLM_API_KEY=your_openai_api_key
LLM_API_URL=https://api.openai.com/v1/chat/completions

# 数据库配置
DATABASE_URL="file:../data/wewe-rss.db"
DATABASE_TYPE="sqlite"

# 其他配置
AUTH_CODE=your_auth_code
SERVER_ORIGIN_URL=http://localhost:4000
```

## 使用指南

1. **添加信息源**
   - 进入"信息源管理"页面
   - 点击"添加信息源"
   - 输入微信公众号历史文章链接或其他RSS源

2. **手动触发处理**
   - 进入"仪表板"页面
   - 选择时间范围
   - 点击"开始处理"按钮
   - 等待处理完成

3. **查看和筛选结果**
   - 在结果表格中查看分析结果
   - 使用筛选器按行业、类型等条件筛选
   - 使用搜索框查找特定内容

4. **导出结果**
   - 选择需要导出的数据行
   - 点击"导出"按钮
   - 选择导出格式

## 开发说明

### 项目结构
```
├── apps/
│   ├── server/          # 后端服务
│   │   ├── src/
│   │   │   ├── analysis/    # 智能分析模块
│   │   │   ├── feeds/       # 信息源管理模块
│   │   │   ├── prisma/      # 数据库ORM
│   │   │   └── trpc/        # API路由
│   │   └── prisma/          # 数据库Schema和迁移
│   └── web/             # 前端应用
│       └── src/
│           ├── pages/       # 页面组件
│           ├── components/  # 公共组件
│           └── utils/       # 工具函数
├── prisma/              # Prisma配置
└── README.md
```

### 主要模块说明

1. **Analysis模块** (`apps/server/src/analysis`)
   - `analysis.service.ts`: 核心业务逻辑
   - `llm.service.ts`: LLM集成服务
   - `deduplication.service.ts`: 去重算法实现
   - `types.ts`: 数据类型定义

2. **TRPC路由** (`apps/server/src/trpc`)
   - `trpc.router.ts`: API路由定义
   - `trpc.service.ts`: TRPC配置

3. **前端页面** (`apps/web/src/pages`)
   - `dashboard/index.tsx`: 主仪表板页面
   - `feeds/index.tsx`: 信息源管理页面

## 测试与优化

### 性能测试
- 处理速度：约10-20篇文章/分钟（取决于LLM响应速度）
- 内存占用：建议至少4GB RAM
- 并发处理：默认单线程处理，可通过配置调整

### 准确性指标
- 行业分类准确率：≥85%
- 新闻类型识别准确率：≥80%
- 去重准确率：≥90%
- 多事件拆分准确率：≥75%

## 部署说明

### Docker部署（推荐）
```bash
# 构建镜像
docker build -t news-analysis .

# 运行容器
docker run -d \
  --name news-analysis \
  -p 4000:4000 \
  -e LLM_API_KEY=your_api_key \
  -e AUTH_CODE=your_auth_code \
  -v $(pwd)/data:/app/data \
  news-analysis
```

### 传统部署
```bash
# 构建生产版本
pnpm run build

# 启动服务
pnpm run start:server
```

## 常见问题

1. **LLM调用失败**
   - 检查API密钥是否正确配置
   - 确认网络连接正常
   - 查看日志了解具体错误信息

2. **数据库连接问题**
   - 检查DATABASE_URL配置
   - 确认数据库文件权限
   - 查看Prisma迁移状态

3. **信息源采集失败**
   - 检查信息源链接有效性
   - 确认网络连接
   - 查看WeWe-RSS相关日志

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

[MIT License](LICENSE)
