import React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/hooks';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof Feather.glyphMap;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  style,
  ...props
}) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isDarkMode && styles.inputContainerDark,
          error && styles.inputContainerError,
        ]}
      >
        {iconName && (
          <Feather
            name={iconName}
            size={20}
            color={isDarkMode ? '#ABABAB' : '#666666'}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            isDarkMode && styles.inputDark,
            iconName && styles.inputWithIcon,
            style,
          ]}
          placeholderTextColor={isDarkMode ? '#ABABAB' : '#999999'}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputContainerDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  icon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#000000',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
