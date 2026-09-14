-- Migration 002: Profiles
USE campus_news;

CREATE TABLE IF NOT EXISTS profiles (
    user_id VARCHAR(36) PRIMARY KEY,
    student_no VARCHAR(20) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    course VARCHAR(100),
    year_level VARCHAR(20),
    avatar_url VARCHAR(500),
    bio TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);