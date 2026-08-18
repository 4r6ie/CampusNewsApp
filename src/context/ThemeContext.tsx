import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  colors: ThemeColors;
}

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  cardShadow: string;
  inputBackground: string;
  tabBackground: string;
  urgentBackground: string;
  urgentNotice: string;
  trendingBackground: string;
  userCardBackground: string;
  statsCardBackground: string;
  menuBackground: string;
  logoutBackground: string;
  emptyStateIcon: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#3498DB',
  secondary: '#2C3E50',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  border: '#ECF0F1',
  cardShadow: '#000',
  inputBackground: '#F8F9FA',
  tabBackground: '#F8F9FA',
  urgentBackground: '#FFF5F5',
  urgentNotice: '#FFF5F5',
  trendingBackground: '#FFFFFF',
  userCardBackground: '#F8F9FA',
  statsCardBackground: '#FFFFFF',
  menuBackground: '#FFFFFF',
  logoutBackground: '#FDEDEC',
  emptyStateIcon: '#BDC3C7',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#4DA8DA',
  secondary: '#ECF0F1',
  text: '#ECF0F1',
  textSecondary: '#BDC3C7',
  border: '#333333',
  cardShadow: '#000',
  inputBackground: '#2C2C2C',
  tabBackground: '#2C2C2C',
  urgentBackground: '#3D1A1A',
  urgentNotice: '#3D1A1A',
  trendingBackground: '#1E1E1E',
  userCardBackground: '#1E1E1E',
  statsCardBackground: '#1E1E1E',
  menuBackground: '#1E1E1E',
  logoutBackground: '#3D1A1A',
  emptyStateIcon: '#555555',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = '@campus_news_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTheme) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};