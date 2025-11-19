# 🚀 StashSpark 待完善功能清单

## 🔥 高优先级（核心功能完善）

### 1. AI 摘要 - 真实 API 集成
**状态**: ✅ 已完成（使用 OpenAI GPT-3.5-turbo）  
**优先级**: ⭐⭐⭐⭐⭐

**需要做的**：
```javascript
// server/controllers/bookmarkController.js 中的 generateSummary 函数
// 替换这部分：
const mockSummary = `这是一个自动生成的摘要示例...`

// 改成真实的 AI 调用，例如：
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{
    role: "user",
    content: `请为这个网页生成简短摘要：${bookmark.url}`
  }]
})
const aiSummary = response.choices[0].message.content
```

**安装依赖**：
```bash
npm install openai
# 或
npm install @anthropic-ai/sdk
```

**环境变量**：
```env
OPENAI_API_KEY=sk-xxx
# 或
ANTHROPIC_API_KEY=sk-ant-xxx
```

---

### 2. 密码加密 - 使用 bcrypt
**状态**: ⚠️ 使用简单 Base64（不安全）  
**优先级**: ⭐⭐⭐⭐⭐

**需要做的**：
```bash
cd server
npm install bcrypt
```

```javascript
// server/controllers/authController.js
import bcrypt from 'bcrypt'

// 替换 hashPassword 函数
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

// 注意：register 和 login 函数需要改成 async/await
```

---

### 3. 自动抓取网页标题和元数据
**状态**: ❌ 未实现  
**优先级**: ⭐⭐⭐⭐

**需要做的**：
```bash
npm install cheerio node-fetch
```

```javascript
// server/services/metadataService.js
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export const fetchMetadata = async (url) => {
  try {
    const response = await fetch(url, { timeout: 5000 })
    const html = await response.text()
    const $ = cheerio.load(html)
    
    return {
      title: $('title').text() || $('meta[property="og:title"]').attr('content'),
      description: $('meta[name="description"]').attr('content') || 
                   $('meta[property="og:description"]').attr('content'),
      image: $('meta[property="og:image"]').attr('content'),
    }
  } catch (error) {
    return { title: '未命名书签', description: '', image: null }
  }
}
```

在 `bookmarkController.js` 的 `createBookmark` 中调用：
```javascript
if (!title) {
  const metadata = await fetchMetadata(url)
  title = metadata.title
}
```

---

## 🌟 中优先级（功能扩展）

### 4. 标签系统
**状态**: ⚠️ 数据库表已建，功能未实现  
**优先级**: ⭐⭐⭐

**数据库**：✅ 已有 `tags` 和 `bookmark_tags` 表

**需要创建**：
- `server/controllers/tagController.js`
- `server/routes/tagRoutes.js`
- `client/src/components/bookmarks/TagManager.jsx`

**API 接口**：
- GET `/api/tags` - 获取用户所有标签
- POST `/api/tags` - 创建新标签
- POST `/api/bookmarks/:id/tags` - 为书签添加标签
- DELETE `/api/bookmarks/:id/tags/:tagId` - 移除标签

---

### 5. 更好的 Session 管理
**状态**: ⚠️ 使用内存 Map（服务器重启会丢失）  
**优先级**: ⭐⭐⭐

**选项 1 - JWT**：
```bash
npm install jsonwebtoken
```

**选项 2 - Redis Session**：
```bash
npm install express-session connect-redis redis
```

---

### 6. 数据验证
**状态**: ⚠️ 简单验证  
**优先级**: ⭐⭐⭐

```bash
npm install joi
```

```javascript
// server/middleware/validation.js
import Joi from 'joi'

export const validateBookmark = (req, res, next) => {
  const schema = Joi.object({
    url: Joi.string().uri().required(),
    title: Joi.string().max(200),
    notes: Joi.string().max(5000)
  })
  
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })
  next()
}
```

---

## 🎨 低优先级（用户体验优化）

### 7. 前端优化
- [ ] 加载动画（骨架屏）
- [ ] 深色模式
- [ ] 快捷键支持（如 Cmd+K 快速搜索）
- [ ] 无限滚动或分页
- [ ] 拖拽排序
- [ ] 书签卡片预览图

### 8. 导入/导出功能
- [ ] 导出为 JSON
- [ ] 导出为 HTML
- [ ] 从浏览器书签导入
- [ ] 批量导入

### 9. 高级功能
- [ ] 书签分类/文件夹
- [ ] 收藏/星标书签
- [ ] 分享书签链接
- [ ] 公开/私密书签
- [ ] 协作功能（团队共享）

### 10. 通知系统
- [ ] 邮件提醒（该复习了）
- [ ] 浏览器通知
- [ ] 每日摘要邮件

### 11. 统计功能
- [ ] 书签数量统计
- [ ] 复习完成率
- [ ] 添加趋势图表
- [ ] 最常访问的域名

### 12. Chrome 扩展
- [ ] 一键保存当前页面
- [ ] 右键菜单快速添加
- [ ] 侧边栏快速查看

---

## 🐛 Bug 修复和改进

### 代码质量
- [ ] 添加错误边界（React Error Boundary）
- [ ] 添加单元测试
- [ ] 添加 E2E 测试
- [ ] TypeScript 迁移
- [ ] ESLint + Prettier 配置

### 性能优化
- [ ] 图片懒加载
- [ ] 虚拟滚动（大量书签时）
- [ ] 缓存优化
- [ ] 数据库查询优化（索引）
- [ ] CDN 部署静态资源

### 安全性
- [ ] CSRF 保护
- [ ] XSS 防护
- [ ] SQL 注入防护（已使用参数化查询 ✅）
- [ ] 速率限制（防止暴力破解）
- [ ] 密码强度验证

---

## 📦 部署相关

### 生产环境配置
- [ ] 环境变量管理
- [ ] 日志系统（Winston/Pino）
- [ ] 监控和报警（Sentry）
- [ ] 自动化部署（GitHub Actions）
- [ ] HTTPS 配置
- [ ] 域名配置

### 数据库
- [ ] 数据库迁移系统
- [ ] 自动备份
- [ ] 数据库连接池优化

---

## 📝 文档

- [x] API 文档（已完成）
- [ ] 用户使用手册
- [ ] 开发者文档
- [ ] 贡献指南
- [ ] 变更日志

---

## ⏰ 建议的实现顺序

### 本周
1. ✅ 项目骨架（已完成）
2. 🔥 **bcrypt 密码加密**（安全性，必须）
3. 🔥 **网页元数据抓取**（用户体验）

### 下周
4. 🔥 **真实 AI API 集成**（核心功能）
5. 🌟 **标签系统**（功能完整性）
6. 🌟 **数据验证**（代码质量）

### 后续
7. 🎨 前端 UI 优化
8. 🎨 导入/导出功能
9. 🎨 统计功能
10. 🎨 Chrome 扩展

---

## 💡 提示

- 每完成一个功能，记得在这里打勾 ✅
- 优先完成 🔥 高优先级的功能
- 部署前务必完成安全相关的改进
- 可以根据实际需求调整优先级

---

最后更新：2024-11-19

