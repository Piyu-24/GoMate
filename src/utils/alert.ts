import { Alert, Platform } from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export const showAlert = (
  title: string,
  message: string,
  buttons: AlertButton[] = [{ text: 'OK' }]
) => {
  if (Platform.OS === 'web') {
    // Web implementation
    const confirmMessage = `${title}\n\n${message}`;
    
    if (buttons.length === 2) {
      // Confirm dialog
      const confirmed = window.confirm(confirmMessage);
      if (confirmed && buttons[1].onPress) {
        buttons[1].onPress();
      } else if (!confirmed && buttons[0].onPress) {
        buttons[0].onPress();
      }
    } else {
      // Alert dialog
      window.alert(confirmMessage);
      if (buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Native implementation
    Alert.alert(title, message, buttons);
  }
};
