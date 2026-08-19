import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewsItem } from '../types';
import { getNewsByCategory } from '../database/DatabaseManager';
import NewsCard from '../components/NewsCard';
import { useTheme } from '../context/ThemeContext';

const EventsScreen: React.FC = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [events, setEvents] = useState<NewsItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setRefreshing(true);
    try {
      const eventsNews = getNewsByCategory('events');
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
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Campus events & activities</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
          <Icon name="filter-list" size={24} color={colors.text} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  headerButton: {
    padding: 8,
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