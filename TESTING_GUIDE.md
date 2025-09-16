# 应用测试指南

## 测试准备

1. 确保已安装Node.js (>= 18) 和 pnpm (>= 8)
2. 确保已在项目根目录下运行过 `pnpm install` 安装依赖

## 数据库初始化

1. 生成Prisma客户端：
   ```bash
   npx prisma generate --schema apps/server/prisma/schema.prisma
   ```

2. 执行数据库迁移：
   ```bash
   npx prisma migrate deploy --schema apps/server/prisma/schema.prisma
   ```

## 环境变量配置

在 `apps/server/.env` 中配置以下变量：
```bash
# LLM API配置 (可选，用于智能分析功能)
LLM_API_KEY=your_openai_api_key
LLM_API_URL=https://api.openai.com/v1/chat/completions

# 数据库配置
DATABASE_URL="file:../data/wewe-rss.db"
DATABASE_TYPE="sqlite"

# 其他配置
AUTH_CODE=your_auth_code
SERVER_ORIGIN_URL=http://localhost:4000
```

## 启动应用

### 开发模式
```bash
# 同时启动前端和后端
pnpm run dev
```

### 生产模式
```bash
# 构建生产版本
pnpm run build

# 启动服务
pnpm run start:server  # 启动后端
pnpm run start:web     # 启动前端
```

## 功能测试步骤

### 1. 信息源管理测试
1. 访问 http://localhost:5173/feeds
2. 点击"添加信息源"按钮
3. 输入一个微信公众号的历史文章链接
4. 确认信息源已成功添加到列表中

### 2. 手动触发采集测试
1. 访问 http://localhost:5173/dashboard
2. 选择一个时间范围（如3天）
3. 点击"开始处理"按钮
4. 观察进度条和状态更新

### 3. 智能分析功能测试
1. 等待采集完成后，观察分析结果
2. 检查是否正确识别了文章的行业和类型
3. 验证关键要素是否被正确提取

### 4. 结果展示与筛选测试
1. 在结果表格中查看分析结果
2. 使用筛选器按行业、类型等条件筛选
3. 使用搜索框查找特定内容
4. 验证排序功能是否正常

### 5. 导出功能测试
1. 选择几条数据
2. 点击"导出"按钮
3. 选择导出格式（文本、Markdown、Excel）
4. 验证导出文件内容是否正确

## 预期结果

1. 应用能够正常启动，前端和后端都能访问
2. 信息源管理功能完整可用
3. 手动触发采集功能正常工作
4. 智能分析能够正确识别行业和类型
5. 结果展示界面响应迅速，筛选和搜索功能正常
6. 导出功能能够生成正确的文件格式

## 故障排除

1. **数据库连接问题**：
   - 检查DATABASE_URL配置
   - 确认数据库文件权限
   - 查看Prisma迁移状态

2. **信息源采集失败**：
   - 检查信息源链接有效性
   - 确认网络连接
   - 查看WeWe-RSS相关日志

3. **LLM调用失败**：
   - 检查API密钥是否正确配置
   - 确认网络连接正常
   - 查看日志了解具体错误信息

4. **前端页面无法加载**：
   - 检查后端服务是否正常运行
   - 确认端口是否被占用
   - 查看浏览器控制台错误信息
