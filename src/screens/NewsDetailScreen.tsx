import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewsItem } from '../types';
import DatabaseManager from '../database/DatabaseManager';
import { useTheme } from '../context/ThemeContext';

interface NewsDetailScreenProps {
  route: any;
  navigation: any;
}

const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { news } = route.params as { news: NewsItem };
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await DatabaseManager.removeBookmark(news.id, 1);
        setIsBookmarked(false);
        Alert.alert('Removed', 'Article removed from bookmarks');
      } else {
        await DatabaseManager.addBookmark(news.id, 1);
        setIsBookmarked(true);
        Alert.alert('Saved', 'Article added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: news.title,
        message: `${news.content}\n\nRead more on CampusNewsApp`,
        url: `campusnews://news/${news.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share article');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.background === '#121212' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>News Detail</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleBookmark}>
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={isBookmarked ? '#FFD700' : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Icon name="share" size={24} color={colors.text} />
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
        <Text style={[styles.title, { color: colors.text }]}>{news.title}</Text>

        {/* Meta Information */}
        <View style={[styles.metaContainer, { borderBottomColor: colors.border }]}>
          <View style={styles.metaItem}>
            <Icon name="person" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{news.author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{news.readTime} min read</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar-today" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {new Date(news.date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={[styles.contentText, { color: colors.text }]}>{news.content}</Text>

        {/* Urgent Notice */}
        {news.isUrgent && (
          <View style={[styles.urgentNotice, { backgroundColor: colors.urgentNotice }]}>
            <Icon name="warning" size={20} color="#FF6B6B" />
            <Text style={[styles.urgentText, { color: colors.text }]}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 16,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    marginLeft: 6,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  urgentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  urgentText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});

export default NewsDetailScreen;