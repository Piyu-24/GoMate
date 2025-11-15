import { Theme } from '../types';
import { lightColors, darkColors } from './colors';

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
};

export { lightColors, darkColors };
