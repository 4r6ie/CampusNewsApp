import SQLite from 'react-native-sqlite-storage';
import { NewsItem } from '../types';

// Enable promises
SQLite.enablePromise(true);

class DatabaseManager {
  private databaseName: string = 'CampusNews.db';
  private database: any = null;

  async initializeDatabase(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: this.databaseName,
        location: 'default',
      });
      await this.createTables();
      await this.insertSampleData();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const queries = [
      `CREATE TABLE IF NOT EXISTS news (
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
      )`,
      `CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        newsId INTEGER,
        userId INTEGER,
        dateAdded TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      )`,
    ];

    for (const query of queries) {
      try {
        await this.database.executeSql(query);
        console.log(`Table created: ${query.split(' ')[5]}`);
      } catch (error) {
        console.error(`Error creating table: ${query.split(' ')[5]}`, error);
        throw error;
      }
    }
  }

  private async insertSampleData(): Promise<void> {
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

    for (const news of sampleNews) {
      try {
        await this.database.executeSql(
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
    }
  }

  async getAllNews(): Promise<NewsItem[]> {
    try {
      const results = await this.database.executeSql(
        'SELECT * FROM news ORDER BY date DESC'
      );
      const news: NewsItem[] = [];
      
      // Handle different SQLite response structures
      const resultSet = results[0] || results;
      
      for (let i = 0; i < resultSet.rows.length; i++) {
        const item = resultSet.rows.item(i);
        // Convert SQLite boolean (0/1) to JavaScript boolean
        const newsItem: NewsItem = {
          ...item,
          isTrending: Boolean(item.isTrending),
          isUrgent: Boolean(item.isUrgent)
        };
        news.push(newsItem);
      }
      
      return news;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async getNewsByCategory(category: string): Promise<NewsItem[]> {
    try {
      const results = await this.database.executeSql(
        'SELECT * FROM news WHERE category = ? ORDER BY date DESC',
        [category]
      );
      const news: NewsItem[] = [];
      
      const resultSet = results[0] || results;
      
      for (let i = 0; i < resultSet.rows.length; i++) {
        const item = resultSet.rows.item(i);
        const newsItem: NewsItem = {
          ...item,
          isTrending: Boolean(item.isTrending),
          isUrgent: Boolean(item.isUrgent)
        };
        news.push(newsItem);
      }
      
      return news;
    } catch (error) {
      console.error('Error fetching news by category:', error);
      return [];
    }
  }

  async getTrendingNews(): Promise<NewsItem[]> {
    try {
      const results = await this.database.executeSql(
        'SELECT * FROM news WHERE isTrending = 1 ORDER BY date DESC'
      );
      const news: NewsItem[] = [];
      
      const resultSet = results[0] || results;
      
      for (let i = 0; i < resultSet.rows.length; i++) {
        const item = resultSet.rows.item(i);
        const newsItem: NewsItem = {
          ...item,
          isTrending: Boolean(item.isTrending),
          isUrgent: Boolean(item.isUrgent)
        };
        news.push(newsItem);
      }
      
      return news;
    } catch (error) {
      console.error('Error fetching trending news:', error);
      return [];
    }
  }

  async addBookmark(newsId: number, userId: number): Promise<void> {
    try {
      await this.database.executeSql(
        'INSERT INTO bookmarks (newsId, userId, dateAdded) VALUES (?, ?, ?)',
        [newsId, userId, new Date().toISOString()]
      );
      console.log(`Bookmark added for news ID: ${newsId}`);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(newsId: number, userId: number): Promise<void> {
    try {
      await this.database.executeSql(
        'DELETE FROM bookmarks WHERE newsId = ? AND userId = ?',
        [newsId, userId]
      );
      console.log(`Bookmark removed for news ID: ${newsId}`);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  async getBookmarks(userId: number): Promise<NewsItem[]> {
    try {
      const results = await this.database.executeSql(
        `SELECT n.* FROM news n 
         INNER JOIN bookmarks b ON n.id = b.newsId 
         WHERE b.userId = ? 
         ORDER BY b.dateAdded DESC`,
        [userId]
      );
      
      const bookmarks: NewsItem[] = [];
      const resultSet = results[0] || results;
      
      for (let i = 0; i < resultSet.rows.length; i++) {
        const item = resultSet.rows.item(i);
        const newsItem: NewsItem = {
          ...item,
          isTrending: Boolean(item.isTrending),
          isUrgent: Boolean(item.isUrgent)
        };
        bookmarks.push(newsItem);
      }
      
      return bookmarks;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  }

  // Close database connection (optional)
  async closeDatabase(): Promise<void> {
    if (this.database) {
      await this.database.close();
      console.log('Database closed');
    }
  }
}

export default new DatabaseManager();