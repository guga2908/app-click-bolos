
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';

export default function useColorScheme(): NonNullable<ColorSchemeName> {
  return useDeviceColorScheme() ?? 'light';
}
