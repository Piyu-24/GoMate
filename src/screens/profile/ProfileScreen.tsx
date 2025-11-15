import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout, clearError } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { clearFavourites } from '../../redux/slices/favouritesSlice';
import { storageService } from '../../utils/storage';
import { showAlert } from '../../utils/alert';
import { MainTabParamList, RootStackParamList } from '../../types';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const handleLogout = () => {
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Clear error state first
            dispatch(clearError());
            // Clear storage
            await storageService.clearAll();
            // Logout
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleClearFavourites = () => {
    showAlert(
      'Clear Favourites',
      'Are you sure you want to remove all favourites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearFavourites());
            await storageService.saveFavourites([]);
            showAlert('Success', 'All favourites have been cleared.');
          },
        },
      ]
    );
  };

  const handleToggleTheme = async (value: boolean) => {
    dispatch(toggleTheme());
    await storageService.saveTheme(value);
  };

  const renderProfileHeader = () => (
    <View style={[styles.profileHeader, isDarkMode && styles.profileHeaderDark]}>
      <View style={[styles.avatarContainer, isDarkMode && styles.avatarContainerDark]}>
        <Feather name="user" size={48} color={isDarkMode ? '#0A84FF' : '#007AFF'} />
      </View>
      <Text style={[styles.userName, isDarkMode && styles.userNameDark]}>
        {user?.firstName} {user?.lastName}
      </Text>
      <Text style={[styles.userEmail, isDarkMode && styles.userEmailDark]}>
        {user?.email}
      </Text>
      <Text style={[styles.username, isDarkMode && styles.usernameDark]}>
        @{user?.username}
      </Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Feather name="edit-2" size={16} color="#007AFF" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingItem = (
    icon: keyof typeof Feather.glyphMap,
    title: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    danger?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, isDarkMode && styles.settingItemDark]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            danger ? styles.iconContainerDanger : (isDarkMode ? styles.iconContainerDark : styles.iconContainerLight),
          ]}
        >
          <Feather
            name={icon}
            size={20}
            color={danger ? '#FF3B30' : (isDarkMode ? '#0A84FF' : '#007AFF')}
          />
        </View>
        <Text
          style={[
            styles.settingTitle,
            isDarkMode && styles.settingTitleDark,
            danger && styles.settingTitleDanger,
          ]}
        >
          {title}
        </Text>
      </View>
      {rightComponent || (
        <Feather
          name="chevron-right"
          size={20}
          color={isDarkMode ? '#ABABAB' : '#CCCCCC'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
            Preferences
          </Text>
          {renderSettingItem(
            'moon',
            'Dark Mode',
            undefined,
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleTheme}
              trackColor={{ false: '#E0E0E0', true: '#0A84FF' }}
              thumbColor="#FFFFFF"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
            Data
          </Text>
          {renderSettingItem(
            'trash-2',
            'Clear Favourites',
            handleClearFavourites
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
            About
          </Text>
          {renderSettingItem('info', 'App Version', undefined, (
            <Text style={[styles.versionText, isDarkMode && styles.versionTextDark]}>
              1.0.0
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          {renderSettingItem(
            'log-out',
            'Logout',
            handleLogout,
            undefined,
            true
          )}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDarkMode && styles.footerTextDark]}>
            GoMate © 2025
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  profileHeaderDark: {
    backgroundColor: '#1C1C1E',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  userNameDark: {
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  userEmailDark: {
    color: '#ABABAB',
  },
  username: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  usernameDark: {
    color: '#0A84FF',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitleDark: {
    color: '#ABABAB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemDark: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerLight: {
    backgroundColor: '#E3F2FD',
  },
  iconContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  iconContainerDanger: {
    backgroundColor: '#FFEBEE',
  },
  settingTitle: {
    fontSize: 16,
    color: '#000000',
  },
  settingTitleDark: {
    color: '#FFFFFF',
  },
  settingTitleDanger: {
    color: '#FF3B30',
  },
  versionText: {
    fontSize: 14,
    color: '#666666',
  },
  versionTextDark: {
    color: '#ABABAB',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
  },
  footerTextDark: {
    color: '#666666',
  },
});

export default ProfileScreen;
