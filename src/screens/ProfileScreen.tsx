import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const user = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    studentId: 'STU2024001',
    department: 'Computer Science',
  };

  const menuItems = [
    {
      icon: 'notifications',
      title: 'Notification Settings',
      description: 'Manage your notification preferences',
    },
    {
      icon: 'bookmark',
      title: 'Saved Articles',
      description: 'View your bookmarked news',
    },
    {
      icon: 'settings',
      title: 'App Settings',
      description: 'Customize your app experience',
    },
    {
      icon: 'help',
      title: 'Help & Support',
      description: 'Get help using the app',
    },
    {
      icon: 'info',
      title: 'About',
      description: 'App version and information',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.background === '#121212' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: colors.userCardBackground }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
            <View style={styles.userDetails}>
              <Text style={[styles.userDetail, { color: colors.textSecondary }]}>{user.studentId}</Text>
              <Text style={[styles.userDetail, { color: colors.textSecondary }]}>•</Text>
              <Text style={[styles.userDetail, { color: colors.textSecondary }]}>{user.department}</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={[styles.statsCard, { backgroundColor: colors.statsCardBackground }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Articles Read</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookmarks</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Events Attended</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: colors.menuBackground }]}>
          {/* Theme Toggle */}
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={toggleTheme}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primary + '20' }]}>
              <Icon name={theme === 'light' ? 'dark-mode' : 'light-mode'} size={24} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</Text>
              <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>
                {theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <View style={[styles.menuIcon, { backgroundColor: colors.primary + '20' }]}>
                <Icon name={item.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>{item.description}</Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.logoutBackground }]}>
          <Icon name="logout" size={20} color="#E74C3C" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetail: {
    fontSize: 12,
    marginRight: 8,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
  },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
    marginLeft: 8,
  },
});

export default ProfileScreen;