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
import { NewsItem } from '../types';
import DatabaseManager from '../database/DatabaseManager';
import NewsCard from '../components/NewsCard';
import { useTheme } from '../context/ThemeContext';

const EventsScreen: React.FC = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [events, setEvents] = useState<NewsItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setRefreshing(true);
    try {
      const eventsNews = await DatabaseManager.getNewsByCategory('events');
      setEvents(eventsNews);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewsPress = (newsItem: NewsItem) => {
    navigation.navigate('NewsDetail', { news: newsItem });
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <NewsCard
      news={item}
      onPress={handleNewsPress}
      onBookmark={async () => {}}
      isBookmarked={false}
    />
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyState, { alignItems: 'center', paddingHorizontal: 40 }]}>
      <Text style={[styles.emptyStateTitle, { color: colors.text, marginTop: 16, marginBottom: 8 }]}>
        No Events Yet
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary, textAlign: 'center', lineHeight: 22 }]}>
        Upcoming campus events will appear here.
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Campus events & activities</Text>
      </View>

      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          events.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadEvents}
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

export default EventsScreen;