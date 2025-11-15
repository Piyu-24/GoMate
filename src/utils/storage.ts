import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@gomate_auth_token';
const USER_DATA_KEY = '@gomate_user_data';
const FAVOURITES_KEY = '@gomate_favourites';
const THEME_KEY = '@gomate_theme';
const REGISTERED_USERS_KEY = '@gomate_registered_users';

export const storageService = {
  // Auth Token
  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  },

  // User Data
  async saveUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  // Favourites
  async saveFavourites(favouriteIds: number[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favouriteIds));
    } catch (error) {
      console.error('Error saving favourites:', error);
    }
  },

  async getFavourites(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(FAVOURITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favourites:', error);
      return [];
    }
  },

  // Theme
  async saveTheme(isDarkMode: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  async getTheme(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(THEME_KEY);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error getting theme:', error);
      return false;
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        AUTH_TOKEN_KEY,
        USER_DATA_KEY,
        FAVOURITES_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Registered Users (for local authentication)
  async saveRegisteredUser(username: string, password: string, userData: any): Promise<void> {
    try {
      const usersData = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const users = usersData ? JSON.parse(usersData) : {};
      users[username] = { password, userData };
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving registered user:', error);
    }
  },

  async getRegisteredUser(username: string, password: string): Promise<any | null> {
    try {
      const usersData = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      if (!usersData) return null;
      
      const users = JSON.parse(usersData);
      const user = users[username];
      
      if (user && user.password === password) {
        return user.userData;
      }
      return null;
    } catch (error) {
      console.error('Error getting registered user:', error);
      return null;
    }
  },
};
