-- Migration 004: Post Media
USE campus_news;

CREATE TABLE IF NOT EXISTS post_media (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type ENUM('image', 'video', 'document') NOT NULL DEFAULT 'image',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_post_media_post (post_id)
);