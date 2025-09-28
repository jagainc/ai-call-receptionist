# Components Structure

This directory contains all reusable React Native components organized by their purpose and functionality.

## Directory Structure

```
components/
├── common/           # Base theming and foundational components
├── navigation/       # Navigation-specific components  
├── screens/         # Screen-level components
└── ui/              # Reusable UI components and widgets
```

## Component Categories

### 📁 `common/`
**Base theming and foundational components**
- `ThemedText.tsx` - Text component with automatic theme support
- `ThemedView.tsx` - View component with automatic theme support

These components provide consistent theming across the app and should be used instead of raw React Native Text/View components.

### 📁 `navigation/`
**Navigation-specific components**
- `HapticTab.tsx` - Tab bar button with haptic feedback for iOS

### 📁 `screens/`
**Screen-level components**
- `HomeScreen.tsx` - Main home screen content
- `AppointmentsScreen.tsx` - Appointments list and management
- `CallsScreen.tsx` - Call history and management  
- `ProfileScreen.tsx` - User profile and settings

### 📁 `ui/`
**Reusable UI components and widgets**
- `Collapsible.tsx` - Expandable/collapsible content container
- `ExternalLink.tsx` - Link component that opens external URLs properly
- `IconSymbol.tsx` - Cross-platform icon component (SF Symbols on iOS, Material Icons elsewhere)
- `ParallaxScrollView.tsx` - Scroll view with parallax header effect
- `SplashScreen.tsx` - Animated app loading screen
- `TabBarBackground.tsx` - Tab bar background styling

## Usage Examples

### Using Themed Components
```tsx
import { ThemedText, ThemedView } from '@/components/common';

function MyComponent() {
  return (
    <ThemedView>
      <ThemedText type="title">Hello World</ThemedText>
    </ThemedView>
  );
}
```

### Using UI Components
```tsx
import { Collapsible, IconSymbol } from '@/components/ui';

function MyComponent() {
  return (
    <Collapsible title="Settings">
      <IconSymbol name="house.fill" size={24} color="#007AFF" />
    </Collapsible>
  );
}
```

## Import Patterns

You can import components in two ways:

1. **Direct imports** (recommended for better tree-shaking):
```tsx
import { ThemedText } from '@/components/common/ThemedText';
import { Collapsible } from '@/components/ui/Collapsible';
```

2. **Index imports** (convenient for multiple imports):
```tsx
import { ThemedText, ThemedView } from '@/components/common';
import { Collapsible, IconSymbol } from '@/components/ui';
```

## Component Guidelines

- **Reusability**: Components in `ui/` should be highly reusable and not tied to specific business logic
- **Theming**: Always use `ThemedText` and `ThemedView` instead of raw React Native components
- **Platform**: Consider platform differences when creating components (iOS vs Android vs Web)
- **Performance**: Use React.memo() for components that receive frequent prop updates
- **Accessibility**: Include proper accessibility props and labels

## Adding New Components

When adding new components:

1. Choose the appropriate directory based on the component's purpose
2. Follow the existing naming conventions (PascalCase for components)
3. Include proper TypeScript types and interfaces
4. Add the component to the relevant index.ts file
5. Update this README if adding a new category