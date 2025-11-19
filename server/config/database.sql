-- 删除已存在的表
DROP TABLE IF EXISTS bookmark_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS users;

-- 创建 users 表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建 bookmarks 表
CREATE TABLE bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  domain TEXT,
  notes TEXT,
  ai_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_reviewed_at TIMESTAMP,
  next_review_at TIMESTAMP,
  review_interval_days INTEGER DEFAULT 0
);

-- （可选）tags 表
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE(user_id, name)
);

-- （可选）多对多关联表
CREATE TABLE bookmark_tags (
  bookmark_id INTEGER REFERENCES bookmarks(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (bookmark_id, tag_id)
);

-- 创建索引以优化查询
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_next_review ON bookmarks(next_review_at);
CREATE INDEX idx_tags_user_id ON tags(user_id);

