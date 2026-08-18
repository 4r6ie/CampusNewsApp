import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const { colors } = useTheme();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'events':
        return 'event';
      case 'academics':
        return 'school';
      case 'sports':
        return 'sports';
      case 'general':
        return 'info';
      default:
        return 'article';
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.tab,
            selectedCategory === category.id && [styles.tabSelected, { backgroundColor: colors.primary }],
          ]}
          onPress={() => onCategorySelect(category.id)}>
          <Icon
            name={getCategoryIcon(category.icon)}
            size={20}
            color={selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary}
            style={styles.icon}
          />
          <Text
            style={[
              styles.tabText,
              selectedCategory === category.id && styles.tabTextSelected,
              { color: selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary },
            ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    marginVertical: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 4,
    minWidth: 100,
    justifyContent: 'center',
  },
  tabSelected: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabTextSelected: {},
  icon: {
    marginRight: 4,
  },
});

export default CategoryTabs;