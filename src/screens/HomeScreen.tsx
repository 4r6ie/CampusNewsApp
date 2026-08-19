import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { NewsItem, Category } from '../types';
import { getAllNews, getTrendingNews, addBookmark, removeBookmark } from '../database/DatabaseManager';
import NewsCard from '../components/NewsCard';
import CategoryTabs from '../components/CategoryTabs';
import SearchBar from '../components/SearchBar';
import TrendingCard from '../components/TrendingCard';
import { useTheme } from '../context/ThemeContext';

const HomeScreen: React.FC = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const categories: Category[] = [
    { id: 'all', name: 'All', icon: 'all' },
    { id: 'events', name: 'Events', icon: 'events' },
    { id: 'academics', name: 'Academics', icon: 'academics' },
    { id: 'sports', name: 'Sports', icon: 'sports' },
    { id: 'general', name: 'General', icon: 'general' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, selectedCategory, searchQuery]);

  const loadData = () => {
    setRefreshing(true);
    try {
      const allNews = getAllNews();
      const trending = getTrendingNews();
      setNews(allNews);
      setTrendingNews(trending);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  const handleNewsPress = (newsItem: NewsItem) => {
    navigation.navigate('NewsDetail', { news: newsItem });
  };

  const handleBookmark = (newsId: number) => {
    if (bookmarks.includes(newsId)) {
      setBookmarks(bookmarks.filter(id => id !== newsId));
      removeBookmark(newsId, 1);
    } else {
      setBookmarks([...bookmarks, newsId]);
      addBookmark(newsId, 1);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <NewsCard
      news={item}
      onPress={handleNewsPress}
      onBookmark={handleBookmark}
      isBookmarked={bookmarks.includes(item.id)}
    />
  );

  const renderTrendingItem = ({ item, index }: { item: NewsItem; index: number }) => (
    <TrendingCard news={item} onPress={handleNewsPress} index={index} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.background === '#121212' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Campus News</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Stay updated with campus life</Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleSearchClear}
      />

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Trending Section */}
      {trendingNews.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
          <FlatList
            data={trendingNews}
            renderItem={renderTrendingItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* News List */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {selectedCategory === 'all' ? 'Latest News' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </Text>
        <FlatList
          data={filteredNews}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadData}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.newsList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  newsList: {
    paddingBottom: 20,
  },
});

export default HomeScreen;