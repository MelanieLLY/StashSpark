import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const seedDatabase = async () => {
  try {
    const sqlFilePath = path.join(__dirname, 'database.sql')
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
    
    await pool.query(sqlContent)
    console.log('✅ 数据库重置成功!')
    
    // 可以在这里添加一些测试数据
    console.log('📦 数据库已准备就绪')
  } catch (error) {
    console.error('❌ 数据库重置失败:', error)
  } finally {
    pool.end()
  }
}

seedDatabase()

