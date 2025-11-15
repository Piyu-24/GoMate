import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginSuccess } from '../redux/slices/authSlice';
import { setTheme } from '../redux/slices/themeSlice';
import { setFavourites } from '../redux/slices/favouritesSlice';
import { storageService } from '../utils/storage';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import { RootStackParamList } from '../types';
import { Loading } from '../components/common';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Load saved data
      const [token, userData, savedTheme, savedFavourites] = await Promise.all([
        storageService.getAuthToken(),
        storageService.getUserData(),
        storageService.getTheme(),
        storageService.getFavourites(),
      ]);

      // Restore theme
      dispatch(setTheme(savedTheme));

      // Restore favourites
      dispatch(setFavourites(savedFavourites));

      // Restore auth state
      if (token && userData) {
        dispatch(loginSuccess(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerStyle: {
            backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
          },
          headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
