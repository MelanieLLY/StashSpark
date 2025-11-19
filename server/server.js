import express from 'express'
import './config/dotenv.js'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import bookmarkRoutes from './routes/bookmarkRoutes.js'

const app = express()

// 中间件
app.use(cors({
  origin: 'http://localhost:5173', // Vite 默认端口
  credentials: true
}))
app.use(express.json())

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/bookmarks', bookmarkRoutes)

// API 文档
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>StashSpark API Documentation</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          padding: 40px 20px;
          line-height: 1.6;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .content { padding: 40px; }
        .section { margin-bottom: 40px; }
        .section h2 {
          color: #667eea;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }
        .endpoint {
          background: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .endpoint h3 {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .method {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.85em;
          font-weight: bold;
          color: white;
        }
        .method.get { background: #28a745; }
        .method.post { background: #007bff; }
        .method.put { background: #ffc107; color: #333; }
        .method.delete { background: #dc3545; }
        .path { 
          font-family: 'Courier New', monospace;
          background: white;
          padding: 4px 12px;
          border-radius: 4px;
          color: #667eea;
        }
        .auth-badge {
          display: inline-block;
          background: #ffc107;
          color: #333;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75em;
          font-weight: bold;
        }
        .detail {
          margin-top: 10px;
          padding-left: 20px;
        }
        .detail p { margin: 8px 0; }
        .detail strong { color: #667eea; }
        pre {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
          margin: 10px 0;
          font-size: 0.9em;
        }
        .status-badge {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9em;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ StashSpark API</h1>
          <p>书签管理系统 RESTful API 文档</p>
          <p style="margin-top: 20px;">
            <span class="status-badge">🟢 服务运行中</span>
          </p>
        </div>

        <div class="content">
          <!-- 基本信息 -->
          <div class="section">
            <h2>📋 基本信息</h2>
            <p><strong>Base URL:</strong> <code>http://localhost:${PORT}</code></p>
            <p><strong>API Prefix:</strong> <code>/api</code></p>
            <p><strong>认证方式:</strong> Cookie-based Session</p>
            <p><strong>数据格式:</strong> JSON</p>
          </div>

          <!-- 认证接口 -->
          <div class="section">
            <h2>🔐 认证接口</h2>

            <div class="endpoint">
              <h3>
                <span class="method post">POST</span>
                <span class="path">/api/auth/register</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 注册新用户</p>
                <p><strong>请求体:</strong></p>
                <pre>{
  "email": "user@example.com",
  "password": "yourpassword"
}</pre>
                <p><strong>响应示例:</strong></p>
                <pre>{
  "id": 1,
  "email": "user@example.com"
}</pre>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method post">POST</span>
                <span class="path">/api/auth/login</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 用户登录</p>
                <p><strong>请求体:</strong></p>
                <pre>{
  "email": "user@example.com",
  "password": "yourpassword"
}</pre>
                <p><strong>响应示例:</strong></p>
                <pre>{
  "id": 1,
  "email": "user@example.com"
}</pre>
                <p><strong>说明:</strong> 登录成功后会设置 sessionId Cookie</p>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method post">POST</span>
                <span class="path">/api/auth/logout</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 用户登出</p>
                <p><strong>响应示例:</strong></p>
                <pre>{
  "message": "已登出"
}</pre>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method get">GET</span>
                <span class="path">/api/auth/me</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 获取当前登录用户信息</p>
                <p><strong>响应示例:</strong></p>
                <pre>{
  "id": 1,
  "email": "user@example.com"
}</pre>
              </div>
            </div>
          </div>

          <!-- 书签接口 -->
          <div class="section">
            <h2>🔖 书签接口 <span class="auth-badge">需要认证</span></h2>

            <div class="endpoint">
              <h3>
                <span class="method get">GET</span>
                <span class="path">/api/bookmarks</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 获取当前用户的所有书签</p>
                <p><strong>Query 参数:</strong></p>
                <pre>?search=关键词    # 可选，搜索书签</pre>
                <p><strong>响应示例:</strong></p>
                <pre>[
  {
    "id": 1,
    "user_id": 1,
    "url": "https://github.com",
    "title": "GitHub",
    "domain": "github.com",
    "notes": "代码托管平台",
    "ai_summary": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "last_reviewed_at": null,
    "next_review_at": null,
    "review_interval_days": 0
  }
]</pre>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method post">POST</span>
                <span class="path">/api/bookmarks</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 创建新书签</p>
                <p><strong>请求体:</strong></p>
                <pre>{
  "url": "https://example.com",
  "title": "示例网站",    // 可选
  "notes": "我的笔记"     // 可选
}</pre>
                <p><strong>响应示例:</strong> 返回创建的书签对象</p>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method get">GET</span>
                <span class="path">/api/bookmarks/:id</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 获取单个书签详情</p>
                <p><strong>响应示例:</strong> 返回书签对象</p>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method put">PUT</span>
                <span class="path">/api/bookmarks/:id</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 更新书签信息</p>
                <p><strong>请求体:</strong></p>
                <pre>{
  "title": "新标题",                    // 可选
  "notes": "更新的笔记",                 // 可选
  "review_interval_days": 7,          // 可选
  "next_review_at": "2024-01-08T00:00:00.000Z"  // 可选
}</pre>
                <p><strong>响应示例:</strong> 返回更新后的书签对象</p>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method delete">DELETE</span>
                <span class="path">/api/bookmarks/:id</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 删除书签</p>
                <p><strong>响应示例:</strong></p>
                <pre>{
  "message": "书签已删除"
}</pre>
              </div>
            </div>
          </div>

          <!-- AI 和复习功能 -->
          <div class="section">
            <h2>🤖 AI 摘要和复习功能 <span class="auth-badge">需要认证</span></h2>

            <div class="endpoint">
              <h3>
                <span class="method post">POST</span>
                <span class="path">/api/bookmarks/:id/summary</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 为书签生成 AI 摘要</p>
                <p><strong>请求体:</strong> 无需请求体</p>
                <p><strong>响应示例:</strong> 返回更新后的书签对象（含 ai_summary）</p>
                <p><strong>说明:</strong> 当前返回 mock 数据，可接入 OpenAI/Claude API</p>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method get">GET</span>
                <span class="path">/api/bookmarks/review/today</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 获取今天需要复习的书签</p>
                <p><strong>逻辑:</strong> 返回 next_review_at <= NOW() 的所有书签</p>
                <p><strong>响应示例:</strong> 返回书签数组</p>
              </div>
            </div>

            <div class="endpoint">
              <h3>
                <span class="method post">POST</span>
                <span class="path">/api/bookmarks/:id/mark-reviewed</span>
              </h3>
              <div class="detail">
                <p><strong>描述:</strong> 标记书签为已复习</p>
                <p><strong>功能:</strong> 
                  <ul style="margin-left: 20px; margin-top: 5px;">
                    <li>更新 last_reviewed_at 为当前时间</li>
                    <li>根据 review_interval_days 计算下次复习时间</li>
                  </ul>
                </p>
                <p><strong>响应示例:</strong> 返回更新后的书签对象</p>
              </div>
            </div>
          </div>

          <!-- 错误响应 -->
          <div class="section">
            <h2>⚠️ 错误响应格式</h2>
            <div class="endpoint">
              <div class="detail">
                <p><strong>401 未授权:</strong></p>
                <pre>{
  "error": "未登录"
}</pre>
                <p><strong>404 未找到:</strong></p>
                <pre>{
  "error": "书签不存在"
}</pre>
                <p><strong>400 请求错误:</strong></p>
                <pre>{
  "error": "URL 不能为空"
}</pre>
                <p><strong>500 服务器错误:</strong></p>
                <pre>{
  "error": "操作失败"
}</pre>
              </div>
            </div>
          </div>

          <!-- 使用示例 -->
          <div class="section">
            <h2>💡 使用示例</h2>
            <div class="endpoint">
              <h3>使用 fetch 调用 API</h3>
              <div class="detail">
                <pre>// 登录
const response = await fetch('http://localhost:${PORT}/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // 重要：携带 Cookie
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// 获取书签
const bookmarks = await fetch('http://localhost:${PORT}/api/bookmarks', {
  credentials: 'include'  // 重要：携带 Cookie
});
const data = await bookmarks.json();</pre>
              </div>
            </div>
          </div>

          <!-- 数据库表结构 -->
          <div class="section">
            <h2>🗄️ 数据库表结构</h2>
            <div class="endpoint">
              <h3>users 表</h3>
              <div class="detail">
                <pre>id              SERIAL PRIMARY KEY
email           TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()</pre>
              </div>
            </div>
            <div class="endpoint">
              <h3>bookmarks 表</h3>
              <div class="detail">
                <pre>id                      SERIAL PRIMARY KEY
user_id                 INTEGER FK → users(id)
url                     TEXT NOT NULL
title                   TEXT
domain                  TEXT
notes                   TEXT
ai_summary              TEXT
created_at              TIMESTAMP DEFAULT NOW()
last_reviewed_at        TIMESTAMP
next_review_at          TIMESTAMP
review_interval_days    INTEGER DEFAULT 0</pre>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>✨ StashSpark API - 让书签管理更智能</p>
          <p style="margin-top: 10px;">
            <a href="https://github.com" style="color: #667eea; text-decoration: none;">GitHub</a> | 
            <a href="/api/auth/me" style="color: #667eea; text-decoration: none;">测试认证</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `)
})

const PORT = process.env.PORT || 3001
    
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
