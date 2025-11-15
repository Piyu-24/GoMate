import React, { useEffect } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../redux/slices/authSlice';
import { authService } from '../../services/authService';
import { storageService } from '../../utils/storage';
import { loginValidationSchema } from '../../utils/validation';
import { Button, Input } from '../../components/common';
import { AuthStackParamList } from '../../types';
import { showAlert } from '../../utils/alert';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { isLoading } = useAppSelector((state) => state.auth);

  // Clear any previous login errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(loginStart());
        const user = await authService.login(values);
        
        // Save to secure storage
        await storageService.saveAuthToken(user.token || '');
        await storageService.saveUserData(user);
        
        dispatch(loginSuccess(user));
      } catch (error: any) {
        dispatch(loginFailure(error.message));
        showAlert('Login Failed', error.message);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDarkMode && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.titleDark]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
              Sign in to continue to GoMate
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="Enter your username"
              iconName="user"
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              error={
                formik.touched.username && formik.errors.username
                  ? formik.errors.username
                  : undefined
              }
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              iconName="lock"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
              secureTextEntry
            />

            <Button
              title="Sign In"
              onPress={formik.handleSubmit}
              loading={isLoading}
              disabled={!formik.isValid}
              style={styles.submitButton}
            />

            <View style={styles.divider}>
              <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
              <Text style={[styles.dividerText, isDarkMode && styles.dividerTextDark]}>
                OR
              </Text>
              <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDarkMode && styles.footerTextDark]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.demoHint}>
              <Text style={[styles.hintTitle, isDarkMode && styles.hintTitleDark]}>
                Demo Accounts (Work on all devices):
              </Text>
              <Text style={[styles.hintText, isDarkMode && styles.hintTextDark]}>
                • demo / demo123
              </Text>
              <Text style={[styles.hintText, isDarkMode && styles.hintTextDark]}>
                • john / john123
              </Text>
              <Text style={[styles.hintText, isDarkMode && styles.hintTextDark]}>
                • sarah / sarah123
              </Text>
              <Text style={[styles.hintText, isDarkMode && styles.hintTextDark]}>
                • emilys / emilyspass
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  subtitleDark: {
    color: '#ABABAB',
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerLineDark: {
    backgroundColor: '#38383A',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666666',
    fontSize: 14,
  },
  dividerTextDark: {
    color: '#ABABAB',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  footerTextDark: {
    color: '#ABABAB',
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  demoHint: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  hintTitle: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  hintTitleDark: {
    color: '#64B5F6',
  },
  hintText: {
    fontSize: 12,
    color: '#1976D2',
    textAlign: 'center',
    lineHeight: 18,
  },
  hintTextDark: {
    color: '#64B5F6',
  },
});

export default LoginScreen;
