/**
 * Comprehensive color handler for consistent theming across the app
 * Provides easy access to all theme colors with proper typing
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useAppColors() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return {
    // Current theme colors
    colors,
    
    // Theme info
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',
    
    // Helper function to get color with optional override
    getColor: (colorName: ColorName, override?: { light?: string; dark?: string }) => {
      if (override?.[colorScheme]) {
        return override[colorScheme];
      }
      return colors[colorName];
    },
    
    // Common color combinations for quick access
    surface: {
      primary: colors.background,
      secondary: colors.cardBackground,
      tertiary: colors.secondaryBackground,
    },
    
    text: {
      primary: colors.primaryText,
      secondary: colors.secondaryText,
      tertiary: colors.tertiaryText,
    },
    
    interactive: {
      primary: colors.tint,
      destructive: colors.destructive,
      success: colors.success,
      warning: colors.warning,
    },
    
    // Status-specific colors
    status: {
      online: colors.online,
      offline: colors.offline,
      missed: colors.missed,
    },
  };
}

// Legacy compatibility - enhanced useThemeColor
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const { getColor } = useAppColors();
  return getColor(colorName, props);
}