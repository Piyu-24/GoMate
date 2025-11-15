// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Transport types
export interface TransportItem {
  id: number;
  title: string;
  description: string;
  type: 'bus' | 'train' | 'destination' | 'car' | 'tuk_tuk';
  status: 'Active' | 'Upcoming' | 'Popular' | 'Delayed';
  image: string;
  departureTime?: string;
  arrivalTime?: string;
  price?: number;
  location?: string;
  rating?: number;
  route?: string;
  from?: string;
  to?: string;
  distance?: string;
  duration?: string;
}

export interface TransportState {
  items: TransportItem[];
  isLoading: boolean;
  error: string | null;
}

// Favourites types
export interface FavouritesState {
  favouriteIds: number[];
}

// Theme types
export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
  };
}

export interface ThemeState {
  isDarkMode: boolean;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EditProfile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favourites: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  Details: { item: TransportItem };
};
