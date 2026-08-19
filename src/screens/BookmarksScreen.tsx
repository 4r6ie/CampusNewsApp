import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewsItem } from '../types';
import { getBookmarks, removeBookmark } from '../database/DatabaseManager';
import NewsCard from '../components/NewsCard';
import { useTheme } from '../context/ThemeContext';

const BookmarksScreen: React.FC = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    setRefreshing(true);
    try {
      const bookmarkedNews = getBookmarks(1);
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

  const handleBookmark = (newsId: number) => {
    removeBookmark(newsId, 1);
    loadBookmarks();
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
    <View style={[styles.emptyState, { alignItems: 'center', paddingHorizontal: 40 }]}>
      <Icon name="bookmark-border" size={64} color={colors.emptyStateIcon} />
      <Text style={[styles.emptyStateTitle, { color: colors.text, marginTop: 16, marginBottom: 8 }]}>
        No Bookmarks Yet
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary, textAlign: 'center', lineHeight: 22 }]}>
        Save interesting news articles to read later by tapping the bookmark icon.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.background === '#121212' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bookmarks</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Your saved articles</Text>
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
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BookmarksScreen;