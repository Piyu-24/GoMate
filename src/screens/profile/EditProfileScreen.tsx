import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFormik } from 'formik';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginSuccess } from '../../redux/slices/authSlice';
import { storageService } from '../../utils/storage';
import { editProfileValidationSchema, changePasswordValidationSchema } from '../../utils/validation';
import { Button, Input } from '../../components/common';
import { showAlert } from '../../utils/alert';
import { RootStackParamList } from '../../types';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

interface EditProfileScreenProps {
  navigation: EditProfileScreenNavigationProp;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileFormik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
    validationSchema: editProfileValidationSchema,
    onSubmit: async (values) => {
      try {
        // Update user data
        const updatedUser = {
          ...user!,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        };
        
        await storageService.saveUserData(updatedUser);
        dispatch(loginSuccess(updatedUser));
        
        showAlert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (error: any) {
        showAlert('Error', 'Failed to update profile. Please try again.');
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // In a real app, this would call an API to change the password
        // For now, we'll just simulate it
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showAlert('Success', 'Password changed successfully!');
        resetForm();
        setIsChangingPassword(false);
      } catch (error: any) {
        showAlert('Error', 'Failed to change password. Please try again.');
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDarkMode && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
          Edit Profile
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Profile Picture */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, isDarkMode && styles.avatarContainerDark]}>
              <Feather name="user" size={60} color={isDarkMode ? '#0A84FF' : '#007AFF'} />
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Information Form */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
              Profile Information
            </Text>
            
            <Input
              label="First Name"
              placeholder="Enter first name"
              iconName="user"
              value={profileFormik.values.firstName}
              onChangeText={profileFormik.handleChange('firstName')}
              onBlur={profileFormik.handleBlur('firstName')}
              error={
                profileFormik.touched.firstName && profileFormik.errors.firstName
                  ? profileFormik.errors.firstName
                  : undefined
              }
            />

            <Input
              label="Last Name"
              placeholder="Enter last name"
              iconName="user"
              value={profileFormik.values.lastName}
              onChangeText={profileFormik.handleChange('lastName')}
              onBlur={profileFormik.handleBlur('lastName')}
              error={
                profileFormik.touched.lastName && profileFormik.errors.lastName
                  ? profileFormik.errors.lastName
                  : undefined
              }
            />

            <Input
              label="Email"
              placeholder="Enter email"
              iconName="mail"
              value={profileFormik.values.email}
              onChangeText={profileFormik.handleChange('email')}
              onBlur={profileFormik.handleBlur('email')}
              error={
                profileFormik.touched.email && profileFormik.errors.email
                  ? profileFormik.errors.email
                  : undefined
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Username"
              placeholder="Username"
              iconName="at-sign"
              value={user?.username || ''}
              editable={false}
            />

            <Button
              title="Save Changes"
              onPress={profileFormik.handleSubmit}
              loading={profileFormik.isSubmitting}
              disabled={!profileFormik.isValid || !profileFormik.dirty}
              style={styles.saveButton}
            />
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
                Password
              </Text>
              {!isChangingPassword && (
                <TouchableOpacity onPress={() => setIsChangingPassword(true)}>
                  <Text style={styles.changePasswordLink}>Change Password</Text>
                </TouchableOpacity>
              )}
            </View>

            {isChangingPassword && (
              <>
                <Input
                  label="Current Password"
                  placeholder="Enter current password"
                  iconName="lock"
                  value={passwordFormik.values.currentPassword}
                  onChangeText={passwordFormik.handleChange('currentPassword')}
                  onBlur={passwordFormik.handleBlur('currentPassword')}
                  error={
                    passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword
                      ? passwordFormik.errors.currentPassword
                      : undefined
                  }
                  secureTextEntry
                />

                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  iconName="lock"
                  value={passwordFormik.values.newPassword}
                  onChangeText={passwordFormik.handleChange('newPassword')}
                  onBlur={passwordFormik.handleBlur('newPassword')}
                  error={
                    passwordFormik.touched.newPassword && passwordFormik.errors.newPassword
                      ? passwordFormik.errors.newPassword
                      : undefined
                  }
                  secureTextEntry
                />

                <Input
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  iconName="lock"
                  value={passwordFormik.values.confirmPassword}
                  onChangeText={passwordFormik.handleChange('confirmPassword')}
                  onBlur={passwordFormik.handleBlur('confirmPassword')}
                  error={
                    passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword
                      ? passwordFormik.errors.confirmPassword
                      : undefined
                  }
                  secureTextEntry
                />

                <View style={styles.passwordButtonsRow}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      passwordFormik.resetForm();
                      setIsChangingPassword(false);
                    }}
                    variant="outline"
                    style={styles.halfButton}
                  />
                  <Button
                    title="Update Password"
                    onPress={passwordFormik.handleSubmit}
                    loading={passwordFormik.isSubmitting}
                    disabled={!passwordFormik.isValid}
                    style={styles.halfButton}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerDark: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#38383A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  changePasswordLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 8,
  },
  passwordButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfButton: {
    flex: 1,
  },
});

export default EditProfileScreen;
