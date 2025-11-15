import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { useAppSelector } from '../../redux/hooks';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  disabled,
  style,
  ...props
}) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const getButtonStyle = () => {
    if (variant === 'primary') {
      return styles.primaryButton;
    } else if (variant === 'secondary') {
      return [styles.secondaryButton, isDarkMode && styles.secondaryButtonDark];
    } else {
      return [styles.outlineButton, isDarkMode && styles.outlineButtonDark];
    }
  };

  const getTextStyle = () => {
    if (variant === 'primary') {
      return styles.primaryButtonText;
    } else if (variant === 'secondary') {
      return [styles.secondaryButtonText, isDarkMode && styles.secondaryButtonTextDark];
    } else {
      return styles.outlineButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#FFFFFF' : '#007AFF'} 
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
  },
  secondaryButtonDark: {
    backgroundColor: '#1C1C1E',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  outlineButtonDark: {
    borderColor: '#0A84FF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonTextDark: {
    color: '#FFFFFF',
  },
  outlineButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
