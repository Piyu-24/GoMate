import axios from 'axios';
import { User } from '../types';
import { storageService } from '../utils/storage';

const API_BASE_URL = 'https://dummyjson.com';

// Demo accounts that work across all devices
const DEMO_ACCOUNTS: { [key: string]: { password: string; userData: User } } = {
  'demo': {
    password: 'demo123',
    userData: {
      id: 1001,
      username: 'demo',
      email: 'demo@gomate.com',
      firstName: 'Demo',
      lastName: 'User',
      token: 'demo-token-1001',
    }
  },
  'john': {
    password: 'john123',
    userData: {
      id: 1002,
      username: 'john',
      email: 'john@gomate.com',
      firstName: 'John',
      lastName: 'Doe',
      token: 'demo-token-1002',
    }
  },
  'sarah': {
    password: 'sarah123',
    userData: {
      id: 1003,
      username: 'sarah',
      email: 'sarah@gomate.com',
      firstName: 'Sarah',
      lastName: 'Silva',
      token: 'demo-token-1003',
    }
  },
};

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // First, check demo accounts (work across all devices)
      const demoUser = DEMO_ACCOUNTS[credentials.username];
      if (demoUser && demoUser.password === credentials.password) {
        return demoUser.userData;
      }

      // Second, check if user is registered locally
      const localUser = await storageService.getRegisteredUser(
        credentials.username,
        credentials.password
      );

      if (localUser) {
        return localUser;
      }

      // Finally, try dummyjson.com for additional demo accounts
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      
      return {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        token: response.data.token,
      };
    } catch (error: any) {
      throw new Error('Invalid username or password');
    }
  },

  async register(data: RegisterData): Promise<User> {
    try {
      // Create user object
      const user: User = {
        id: Date.now(), // Generate unique ID
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        token: 'local-token-' + Date.now(),
      };

      // Save to local storage for future logins
      await storageService.saveRegisteredUser(data.username, data.password, user);

      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        token,
      };
    } catch (error: any) {
      throw new Error('Failed to get user data');
    }
  },
};
