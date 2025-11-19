import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewsItem } from '../types';

interface NewsDetailScreenProps {
  route: any;
  navigation: any;
}

const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({ route, navigation }) => {
  const { news } = route.params as { news: NewsItem };

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News Detail</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bookmark-border" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Category Badge */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(news.category) },
          ]}>
          <Text style={styles.categoryText}>
            {news.category.toUpperCase()}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{news.title}</Text>

        {/* Meta Information */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="person" size={16} color="#666" />
            <Text style={styles.metaText}>{news.author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={16} color="#666" />
            <Text style={styles.metaText}>{news.readTime} min read</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar-today" size={16} color="#666" />
            <Text style={styles.metaText}>
              {new Date(news.date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.contentText}>{news.content}</Text>

        {/* Urgent Notice */}
        {news.isUrgent && (
          <View style={styles.urgentNotice}>
            <Icon name="warning" size={20} color="#FF6B6B" />
            <Text style={styles.urgentText}>
              This is an urgent announcement. Please take immediate action if required.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 4,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
    textAlign: 'justify',
  },
  urgentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  urgentText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
});

export default NewsDetailScreen;