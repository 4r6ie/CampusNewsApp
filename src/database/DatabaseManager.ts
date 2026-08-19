import * as SQLite from 'expo-sqlite';
import { NewsItem } from '../types';

const db = SQLite.openDatabaseSync('CampusNews.db');

export const initializeDatabase = (): void => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      imageUrl TEXT,
      date TEXT NOT NULL,
      isTrending BOOLEAN DEFAULT 0,
      isUrgent BOOLEAN DEFAULT 0,
      author TEXT NOT NULL,
      readTime INTEGER DEFAULT 5
    );
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      newsId INTEGER,
      userId INTEGER,
      dateAdded TEXT
    );
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);
  console.log('Database initialized successfully');

  insertSampleData();
};

const insertSampleData = (): void => {
  const sampleNews = [
    {
      title: 'Library extends hours during final week',
      content: 'The university library will extend its operating hours during the final examination week to accommodate students study needs.',
      category: 'academics',
      date: '2024-01-15',
      isTrending: true,
      isUrgent: false,
      author: 'University Administration',
      readTime: 3
    },
    {
      title: 'Basketball Championship Finals This Weekend',
      content: 'Come support our team in the championship finals this Saturday at the main arena.',
      category: 'sports',
      date: '2024-01-16',
      isTrending: true,
      isUrgent: false,
      author: 'Sports Department',
      readTime: 2
    },
    {
      title: 'Career Fair 2024 - Register Now',
      content: 'Annual career fair featuring top companies. Register through the student portal.',
      category: 'events',
      date: '2024-01-18',
      isTrending: false,
      isUrgent: true,
      author: 'Career Services',
      readTime: 4
    },
    {
      title: 'Campus WiFi Maintenance Scheduled',
      content: 'Scheduled maintenance for campus WiFi will occur this Sunday from 2 AM to 6 AM.',
      category: 'general',
      date: '2024-01-14',
      isTrending: false,
      isUrgent: true,
      author: 'IT Department',
      readTime: 2
    }
  ];

  sampleNews.forEach(news => {
    try {
      db.runSync(
        `INSERT OR IGNORE INTO news (title, content, category, date, isTrending, isUrgent, author, readTime) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          news.title,
          news.content,
          news.category,
          news.date,
          news.isTrending ? 1 : 0,
          news.isUrgent ? 1 : 0,
          news.author,
          news.readTime
        ]
      );
      console.log(`Sample data inserted: ${news.title}`);
    } catch (error) {
      console.error(`Error inserting sample data: ${news.title}`, error);
    }
  });
};

export const getAllNews = (): NewsItem[] => {
  try {
    const rows = db.getAllSync('SELECT * FROM news ORDER BY date DESC');
    return rows.map((item: any) => ({
      ...item,
      isTrending: Boolean(item.isTrending),
      isUrgent: Boolean(item.isUrgent)
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getNewsByCategory = (category: string): NewsItem[] => {
  try {
    const rows = db.getAllSync('SELECT * FROM news WHERE category = ? ORDER BY date DESC', [category]);
    return rows.map((item: any) => ({
      ...item,
      isTrending: Boolean(item.isTrending),
      isUrgent: Boolean(item.isUrgent)
    }));
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return [];
  }
};

export const getTrendingNews = (): NewsItem[] => {
  try {
    const rows = db.getAllSync('SELECT * FROM news WHERE isTrending = 1 ORDER BY date DESC');
    return rows.map((item: any) => ({
      ...item,
      isTrending: Boolean(item.isTrending),
      isUrgent: Boolean(item.isUrgent)
    }));
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
};

export const addBookmark = (newsId: number, userId: number): void => {
  try {
    db.runSync(
      'INSERT INTO bookmarks (newsId, userId, dateAdded) VALUES (?, ?, ?)',
      [newsId, userId, new Date().toISOString()]
    );
    console.log(`Bookmark added for news ID: ${newsId}`);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

export const removeBookmark = (newsId: number, userId: number): void => {
  try {
    db.runSync(
      'DELETE FROM bookmarks WHERE newsId = ? AND userId = ?',
      [newsId, userId]
    );
    console.log(`Bookmark removed for news ID: ${newsId}`);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const getBookmarks = (userId: number): NewsItem[] => {
  try {
    const rows = db.getAllSync(
      `SELECT n.* FROM news n 
       INNER JOIN bookmarks b ON n.id = b.newsId 
       WHERE b.userId = ? 
       ORDER BY b.dateAdded DESC`,
      [userId]
    );
    return rows.map((item: any) => ({
      ...item,
      isTrending: Boolean(item.isTrending),
      isUrgent: Boolean(item.isUrgent)
    }));
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
};

export const closeDatabase = (): void => {
  db.closeSync();
  console.log('Database closed');
};