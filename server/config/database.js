import pg from 'pg'

// 使用 DATABASE_URL 连接（支持 Render PostgreSQL）
const config = {
  connectionString: process.env.DATABASE_URL
}

// 如果是远程数据库（Render 等），启用 SSL
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')) {
  config.ssl = {
    rejectUnauthorized: false
  }
}

export const pool = new pg.Pool(config)
