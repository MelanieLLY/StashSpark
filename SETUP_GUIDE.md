# 🚀 StashSpark 开发指南

## 📁 项目结构

```
web103_finalproject/
├── client/                          # 前端 React 应用
│   ├── src/
│   │   ├── api/                     # API 调用封装
│   │   │   ├── auth.js              # 认证 API
│   │   │   └── bookmarks.js         # 书签 API
│   │   ├── components/              # React 组件
│   │   │   ├── Layout/
│   │   │   │   ├── AppLayout.jsx    # 主布局（带侧边栏）
│   │   │   │   └── Sidebar.jsx      # 侧边栏导航
│   │   │   └── bookmarks/
│   │   │       ├── AddBookmarkForm.jsx    # 添加书签表单
│   │   │       ├── BookmarkList.jsx       # 书签列表
│   │   │       ├── BookmarkItem.jsx       # 单个书签
│   │   │       ├── BookmarkEditor.jsx     # 编辑器（笔记+复习）
│   │   │       └── SummaryBox.jsx         # AI 摘要框
│   │   ├── hooks/
│   │   │   └── useAuth.js           # 认证 Hook
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # 登录页
│   │   │   ├── SignupPage.jsx       # 注册页
│   │   │   ├── AllBookmarksPage.jsx # 所有书签页
│   │   │   └── ReviewTodayPage.jsx  # 今日复习页
│   │   ├── App.jsx                  # 主应用组件
│   │   ├── main.jsx                 # 入口文件
│   │   └── index.css                # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                          # 后端 Express API
│   ├── config/
│   │   ├── database.js              # 数据库连接配置
│   │   ├── database.sql             # 数据库表结构
│   │   ├── dotenv.js                # 环境变量配置
│   │   ├── reset.js                 # 数据库重置脚本
│   │   └── session.js               # Session 管理
│   ├── controllers/
│   │   ├── authController.js        # 认证控制器
│   │   └── bookmarkController.js    # 书签控制器
│   ├── middleware/
│   │   └── auth.js                  # 认证中间件
│   ├── routes/
│   │   ├── authRoutes.js            # 认证路由
│   │   └── bookmarkRoutes.js        # 书签路由
│   ├── server.js                    # 服务器入口
│   ├── package.json
│   └── .env.example                 # 环境变量示例
│
└── README.md                        # 项目说明

```

---

## 🗄️ 数据库设计

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 用户 ID |
| email | TEXT UNIQUE | 登录邮箱 |
| password_hash | TEXT | 加密后的密码 |
| created_at | TIMESTAMP | 创建时间 |

### bookmarks 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 书签 ID |
| user_id | INTEGER FK | 所属用户 |
| url | TEXT | 原始链接 |
| title | TEXT | 标题 |
| domain | TEXT | 域名 |
| notes | TEXT | 用户笔记 |
| ai_summary | TEXT | AI 生成的摘要 |
| created_at | TIMESTAMP | 创建时间 |
| last_reviewed_at | TIMESTAMP | 上次复习时间 |
| next_review_at | TIMESTAMP | 下次复习时间 |
| review_interval_days | INTEGER | 复习间隔天数 |

### tags 表（可选）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 标签 ID |
| user_id | INTEGER FK | 所属用户 |
| name | TEXT | 标签名称 |

### bookmark_tags 表（可选）
| 字段 | 类型 | 说明 |
|------|------|------|
| bookmark_id | INTEGER FK | 书签 ID |
| tag_id | INTEGER FK | 标签 ID |

---

## 🛠️ 后端 API 接口

### 认证接口
- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 书签接口（需要认证）
- `GET /api/bookmarks` - 获取所有书签（支持 `?search=` 搜索）
- `POST /api/bookmarks` - 创建新书签
- `GET /api/bookmarks/:id` - 获取单个书签
- `PUT /api/bookmarks/:id` - 更新书签
- `DELETE /api/bookmarks/:id` - 删除书签
- `POST /api/bookmarks/:id/summary` - 生成 AI 摘要
- `GET /api/bookmarks/review/today` - 获取今日需复习的书签
- `POST /api/bookmarks/:id/mark-reviewed` - 标记为已复习

---

## 🚀 如何运行

### 1️⃣ 前置要求
- Node.js 18+ 
- PostgreSQL 数据库
- npm 或 yarn

### 2️⃣ 设置数据库

1. 创建 PostgreSQL 数据库：
```bash
createdb stashspark
```

2. 在 `server/` 目录下创建 `.env` 文件（参考 `.env.example`）：
```env
DATABASE_URL=postgresql://username:password@localhost:5432/stashspark
PORT=3001
```

### 3️⃣ 启动后端

```bash
cd server
npm install                # 安装依赖
npm run reset              # 初始化数据库（首次运行）
npm run dev                # 启动开发服务器
```

后端将运行在 `http://localhost:3001`

### 4️⃣ 启动前端

打开新的终端：

```bash
cd client
npm install                # 安装依赖
npm run dev                # 启动开发服务器
```

前端将运行在 `http://localhost:5173`

### 5️⃣ 访问应用

打开浏览器访问 `http://localhost:5173`

---

## ✨ 功能特性

### ✅ 已实现的基础功能
1. **用户认证** - 注册、登录、登出
2. **添加书签** - 粘贴 URL 快速保存
3. **管理书签** - 查看、编辑、删除
4. **搜索功能** - 按标题、笔记、URL 搜索
5. **笔记功能** - 为每个书签添加个人笔记
6. **复习系统** - 设置复习间隔（1/3/7/14/30天）
7. **今日复习** - 查看今天需要复习的书签
8. **AI 摘要** - 生成书签内容摘要（当前为 mock）

### 🔜 待完善的功能
1. **真实 AI 集成** - 接入 OpenAI/Claude API
2. **URL 元数据抓取** - 自动获取网页标题和描述
3. **标签系统** - 为书签添加标签分类
4. **更好的密码加密** - 使用 bcrypt 代替简单 Base64
5. **JWT 认证** - 替换内存 session

---

## 📝 开发建议

### 下一步可以做的事情：

#### 1. 接入真实 AI API
在 `server/controllers/bookmarkController.js` 的 `generateSummary` 函数中：
```javascript
// 替换 mock 摘要为真实 AI 调用
// 例如使用 OpenAI API
```

#### 2. 抓取网页标题
安装 `cheerio` 或 `node-html-parser`，在创建书签时自动获取：
```bash
npm install cheerio
```

#### 3. 使用 bcrypt 加密密码
```bash
npm install bcrypt
```
在 `authController.js` 中替换 `hashPassword` 函数。

#### 4. 添加数据验证
安装 `joi` 或 `express-validator`：
```bash
npm install joi
```

#### 5. 改进 UI/UX
- 添加加载动画
- 优化响应式设计
- 添加快捷键支持
- 深色模式

---

## 🐛 常见问题

### 数据库连接失败
- 确保 PostgreSQL 正在运行
- 检查 `.env` 文件中的数据库连接字符串
- 确保数据库已创建

### CORS 错误
- 确保后端的 CORS 设置允许前端地址
- 检查 `server/server.js` 中的 `cors` 配置

### 前端无法连接后端
- 确保后端运行在 3001 端口
- 检查 `client/src/api/*.js` 中的 API_BASE_URL

---

## 📦 部署

### 部署到 Render

#### 后端：
1. 在 Render 创建 PostgreSQL 数据库
2. 创建 Web Service，连接 GitHub 仓库
3. 设置环境变量 `DATABASE_URL`
4. 构建命令：`npm install`
5. 启动命令：`npm start`

#### 前端：
1. 创建 Static Site
2. 构建命令：`npm run build`
3. 发布目录：`dist`

---

## 👨‍💻 作者

Annie - CodePath WEB103 Final Project

---

## 📄 许可证

ISC

