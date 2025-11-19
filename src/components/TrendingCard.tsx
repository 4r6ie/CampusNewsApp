import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewsItem } from '../types';

interface TrendingCardProps {
  news: NewsItem;
  onPress: (news: NewsItem) => void;
  index: number;
}

const { width } = Dimensions.get('window');

const TrendingCard: React.FC<TrendingCardProps> = ({ news, onPress, index }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(news)}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>#{index + 1}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.category}>{news.category.toUpperCase()}</Text>
          <View style={styles.meta}>
            <Icon name="schedule" size={12} color="#666" />
            <Text style={styles.readTime}>{news.readTime}m</Text>
          </View>
        </View>
      </View>
      <Icon name="trending-up" size={20} color="#FF6B6B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default TrendingCard;