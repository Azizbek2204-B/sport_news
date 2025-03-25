const pool = require("./db");

const tables = [
  `CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL, 
        code VARCHAR(255)
    );`,
  `CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        tag_name VARCHAR(50) NOT NULL, 
        description VARCHAR(255)
    );`,
  ` CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255) ,
    is_active BOOLEAN,
    created_at DATE,
    interests BIGINT,
    bookmarks BIGINT
);`,
  `CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    news_id BIGINT,
    category_id BIGINT,
    author_id BIGINT,
    status VARCHAR(50),
    published_at DATE,
    source VARCHAR(255),
    lang_id BIGINT
);`,
  `CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255),
    description VARCHAR(255),
    parent_id BIGINT
);`,
  `CREATE TABLE IF NOT EXISTS news_with_langs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    summary_news VARCHAR(255),
    lang_id BIGINT
);`,`CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL,
    media_type VARCHAR(50) CHECK (media_type IN ('image', 'video', 'audio', 'document')),
    media_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,`CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    news_id BIGINT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,`CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,`CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
];

module.exports = async () => {
  tables.forEach(async (item) => {
    await pool.query(item);
  });
};
