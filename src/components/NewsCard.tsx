import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
  onPress: (news: NewsItem) => void;
  onBookmark: (newsId: number) => void;
  isBookmarked: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onPress,
  onBookmark,
  isBookmarked,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'events':
        return '#FF6B6B';
      case 'academics':
        return '#4ECDC4';
      case 'sports':
        return '#45B7D1';
      default:
        return '#96CEB4';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(news)}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(news.category) },
          ]}>
          <Text style={styles.categoryText}>
            {news.category.toUpperCase()}
          </Text>
        </View>
        {news.isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {news.content}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.metaInfo}>
          <Text style={styles.author}>{news.author}</Text>
          <Text style={styles.readTime}>{news.readTime} min read</Text>
        </View>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => onBookmark(news.id)}>
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark-border'}
            size={24}
            color={isBookmarked ? '#FFD700' : '#666'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  urgentBadge: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flex: 1,
  },
  author: {
    fontSize: 12,
    color: '#34495E',
    fontWeight: '600',
  },
  readTime: {
    fontSize: 11,
    color: '#95A5A6',
  },
  bookmarkButton: {
    padding: 4,
  },
});

export default NewsCard;