-- Migration 003: Posts
USE campus_news;

CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(36) PRIMARY KEY,
    author_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category ENUM('news', 'event', 'academic', 'general') NOT NULL DEFAULT 'general',
    status ENUM('draft', 'published', 'archived', 'deleted') NOT NULL DEFAULT 'draft',
    published_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_posts_published (published_at),
    INDEX idx_posts_category (category),
    INDEX idx_posts_status (status)
);