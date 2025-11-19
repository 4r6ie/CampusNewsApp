export interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: 'events' | 'academics' | 'sports' | 'general';
  imageUrl?: string;
  date: string;
  isTrending?: boolean;
  isUrgent?: boolean;
  author: string;
  readTime: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  bookmarks: number[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}