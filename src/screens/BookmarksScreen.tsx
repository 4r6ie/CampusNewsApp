import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl, // Add this import
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewsItem } from '../types';
import DatabaseManager from '../database/DatabaseManager';
import NewsCard from '../components/NewsCard';

const BookmarksScreen: React.FC = ({ navigation }: any) => {
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setRefreshing(true);
    try {
      const bookmarkedNews = await DatabaseManager.getBookmarks(1); // Assuming user ID 1
      setBookmarks(bookmarkedNews);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewsPress = (newsItem: NewsItem) => {
    navigation.navigate('NewsDetail', { news: newsItem });
  };

  const handleBookmark = async (newsId: number) => {
    await DatabaseManager.removeBookmark(newsId, 1);
    loadBookmarks(); // Reload bookmarks after removal
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <NewsCard
      news={item}
      onPress={handleNewsPress}
      onBookmark={handleBookmark}
      isBookmarked={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="bookmark-border" size={64} color="#BDC3C7" />
      <Text style={styles.emptyStateTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyStateText}>
        Save interesting news articles to read later by tapping the bookmark icon.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <Text style={styles.headerSubtitle}>Your saved articles</Text>
      </View>

      {/* Bookmarked News */}
      <FlatList
        data={bookmarks}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          bookmarks.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadBookmarks}
            colors={['#3498DB']} // Custom color for refresh indicator
            tintColor="#3498DB" // iOS specific
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BookmarksScreen;