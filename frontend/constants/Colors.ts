/**
 * Comprehensive color system for light and dark modes with rich black backgrounds
 * Provides consistent theming across all app components
 */

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    // Core colors
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    
    // UI elements
    icon: '#666666',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    
    // Text variations
    primaryText: '#000000',
    secondaryText: '#8E8E93',
    tertiaryText: '#C7C7CC',
    
    // Backgrounds
    cardBackground: '#FFFFFF',
    secondaryBackground: '#F2F2F7',
    tertiaryBackground: '#FFFFFF',
    
    // Borders and separators
    border: '#E5E5EA',
    separator: 'rgba(60, 60, 67, 0.29)',
    
    // Interactive elements
    buttonBackground: '#007AFF',
    buttonText: '#FFFFFF',
    destructive: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    
    // Glass/blur effects
    glassBackground: 'rgba(255, 255, 255, 0.8)',
    glassOverlay: 'rgba(255, 255, 255, 0.4)',
    glassBorder: 'rgba(255, 255, 255, 0.8)',
    
    // Shadows
    shadowColor: '#000000',
    
    // Status colors
    online: '#34C759',
    offline: '#8E8E93',
    missed: '#FF3B30',
  },
  dark: {
    // Core colors - Rich black theme
    text: '#FFFFFF',
    background: '#000000', // Rich black background
    tint: tintColorDark,
    
    // UI elements
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    
    // Text variations
    primaryText: '#FFFFFF',
    secondaryText: '#8E8E93',
    tertiaryText: '#48484A',
    
    // Backgrounds - Rich black variations
    cardBackground: '#1C1C1E', // Slightly lighter than pure black for cards
    secondaryBackground: '#2C2C2E', // For secondary elements
    tertiaryBackground: '#3A3A3C', // For tertiary elements
    
    // Borders and separators
    border: '#38383A',
    separator: 'rgba(84, 84, 88, 0.65)',
    
    // Interactive elements
    buttonBackground: '#0A84FF',
    buttonText: '#FFFFFF',
    destructive: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    
    // Glass/blur effects - Dark variants
    glassBackground: 'rgba(28, 28, 30, 0.9)',
    glassOverlay: 'rgba(28, 28, 30, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    
    // Shadows
    shadowColor: '#000000',
    
    // Status colors
    online: '#32D74B',
    offline: '#8E8E93',
    missed: '#FF453A',
  },
};
