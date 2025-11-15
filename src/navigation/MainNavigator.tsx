import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';
import HomeNavigator from './HomeNavigator';
import FavouritesScreen from '../screens/favourites/FavouritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { MainTabParamList } from '../types';
import { useAppSelector } from '../redux/hooks';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { favouriteIds } = useAppSelector((state) => state.favourites);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Favourites') {
            iconName = 'heart';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else {
            iconName = 'circle';
          }

          return <Feather name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode ? '#0A84FF' : '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#8E8E93' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: isDarkMode ? '#38383A' : '#C6C6C8',
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: -2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: isDarkMode ? '#38383A' : '#C6C6C8',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarLabel: 'Favourites',
          tabBarBadge: favouriteIds.length > 0 ? favouriteIds.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: isDarkMode ? '#FF453A' : '#FF3B30',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '600',
          },
          headerTitle: 'Favourites',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerTitle: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
