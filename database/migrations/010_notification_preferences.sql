-- Migration 010: Notification Preferences
USE campus_news;

CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id VARCHAR(36) PRIMARY KEY,
    announcements BOOLEAN NOT NULL DEFAULT TRUE,
    news BOOLEAN NOT NULL DEFAULT TRUE,
    comments BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);