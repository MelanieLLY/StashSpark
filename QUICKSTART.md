# ⚡ 快速启动指南

## 🎯 30 秒快速开始

### 步骤 1：设置数据库

```bash
# 创建数据库
createdb stashspark

# 在 server 目录创建 .env 文件
cd server
echo "DATABASE_URL=postgresql://你的用户名:你的密码@localhost:5432/stashspark" > .env
echo "PORT=3001" >> .env
```

### 步骤 2：启动后端

```bash
# 在 server 目录
npm install
npm run reset    # 初始化数据库
npm run dev      # 启动后端
```

### 步骤 3：启动前端

```bash
# 打开新终端，在 client 目录
cd client
npm install
npm run dev      # 启动前端
```

### 步骤 4：访问应用

打开浏览器：`http://localhost:5173`

---

## 🧪 测试流程

1. **注册账户** → 进入 `http://localhost:5173/signup`
2. **添加书签** → 粘贴任意 URL，如 `https://github.com`
3. **编辑笔记** → 点击"展开"，添加笔记
4. **设置复习** → 选择复习间隔（如 1 天）
5. **生成摘要** → 点击"生成 AI 摘要"（当前为示例文本）
6. **今日复习** → 切换到"今日复习"页面查看

---

## 📊 项目状态

### ✅ 已完成
- ✅ 完整的前后端骨架
- ✅ 用户认证系统
- ✅ 书签 CRUD 操作
- ✅ 搜索功能
- ✅ 复习系统
- ✅ AI 摘要（Mock）
- ✅ 响应式 UI

### 🚧 待完善（你可以慢慢加）
- 🔜 真实 AI API 集成
- 🔜 网页元数据抓取
- 🔜 标签系统
- 🔜 更安全的密码加密（bcrypt）
- 🔜 图片/截图支持
- 🔜 导入/导出功能

---

## 🎨 当前技术栈

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Vite

**Backend:**
- Node.js
- Express 5
- PostgreSQL
- Simple Session (内存存储)

---

## 💡 下一步建议

### 优先级 1（核心功能）
1. 接入真实 AI API（OpenAI/Claude）
2. 使用 bcrypt 加密密码
3. 添加网页标题自动抓取

### 优先级 2（用户体验）
1. 添加加载动画
2. 优化移动端体验
3. 添加错误边界处理
4. 实现标签系统

### 优先级 3（高级功能）
1. 导入/导出书签
2. Chrome 插件
3. 社交分享功能
4. 团队协作

---

## 🆘 遇到问题？

### 后端无法启动
```bash
# 检查数据库连接
psql -U your_username -d stashspark

# 重置数据库
npm run reset
```

### 前端报错
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### 数据库错误
```bash
# 删除并重建数据库
dropdb stashspark
createdb stashspark
cd server && npm run reset
```

---

## 📚 相关文档

- 详细设置指南：`SETUP_GUIDE.md`
- 项目说明：`README.md`
- API 文档：查看 `server/routes/` 中的路由定义

---

好了！你的项目骨架已经搭好了 🎉

现在你可以：
1. 先跑起来看看效果
2. 一个一个功能慢慢完善
3. 参考 TODO 列表逐步实现

祝你开发顺利！✨

