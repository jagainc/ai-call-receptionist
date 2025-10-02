import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { useAppColors } from '@/hooks/useAppColors';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View, RefreshControl } from 'react-native';

interface ProfileOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  isDestructive?: boolean;
}

export default function ProfileScreen() {
  const { colors, interactive } = useAppColors();
  const { user, logout, checkAuthStatus } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load user's profile picture if they have one
  useEffect(() => {
    if (user?.profile_picture_path) {
      setProfileImage(user.profile_picture_path);
    }
  }, [user]);

  // Function to refresh user data
  const onRefresh = async () => {
    setRefreshing(true);
    await checkAuthStatus(); // This will refresh the user data from storage
    setRefreshing(false);
  };

  // Define profile options inside component to access logout function
  const profileOptions: ProfileOption[] = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: 'person-outline',
      action: () => console.log('Edit Profile pressed'),
    },
    {
      id: '2',
      title: 'Notifications',
      icon: 'notifications-outline',
      action: () => console.log('Notifications pressed'),
    },
    {
      id: '3',
      title: 'Settings',
      icon: 'settings-outline',
      action: () => console.log('Settings pressed'),
    },
    {
      id: '4',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: () => console.log('Help pressed'),
    },
    {
      id: '5',
      title: 'Privacy Policy',
      icon: 'shield-outline',
      action: () => console.log('Privacy pressed'),
    },
    {
      id: '6',
      title: 'Logout',
      icon: 'log-out-outline',
      action: () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                await logout();
                router.replace('/auth');
              }
            }
          ]
        );
      },
      isDestructive: true,
    },
  ];

  const sampleImages = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
  ];

  const pickImage = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose a sample profile picture',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sample 1', onPress: () => setProfileImage(sampleImages[0]) },
        { text: 'Sample 2', onPress: () => setProfileImage(sampleImages[1]) },
        { text: 'Sample 3', onPress: () => setProfileImage(sampleImages[2]) },
        { text: 'Sample 4', onPress: () => setProfileImage(sampleImages[3]) }
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.tint}
          colors={[colors.tint]}
        />
      }
    >
      <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[
            styles.avatarContainer,
            {
              backgroundColor: `${colors.cardBackground}CC`,
              borderColor: `${colors.border}40`,
            }
          ]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons
                name="camera-outline"
                size={40}
                color={colors.secondaryText}
              />
              <ThemedText style={[styles.avatarText, { color: colors.secondaryText }]}>
                Add Photo
              </ThemedText>
            </View>
          )}
          <View style={[styles.editBadge, { backgroundColor: colors.tint }]}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <ThemedText style={[styles.name, { color: colors.primaryText }]}>
          {user?.full_name || 'Guest User'}
        </ThemedText>
        <ThemedText style={[styles.email, { color: colors.secondaryText }]}>
          {user?.email || 'No email'}
        </ThemedText>
        {user?.phone_number && (
          <ThemedText style={[styles.phone, { color: colors.secondaryText }]}>
            {user.phone_number}
          </ThemedText>
        )}
        {user && (
          <ThemedText style={[styles.memberSince, { color: colors.secondaryText }]}>
            Member since {new Date().getFullYear()}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView
        style={[
          styles.optionsContainer,
          {
            backgroundColor: `${colors.cardBackground}CC`,
            borderColor: `${colors.border}40`,
          }
        ]}
      >
        {profileOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              {
                borderBottomColor: colors.separator,
                borderBottomWidth: index < profileOptions.length - 1 ? StyleSheet.hairlineWidth : 0,
              }
            ]}
            onPress={option.action}
          >
            <ThemedView style={styles.optionContent} lightColor="transparent" darkColor="transparent">
              <ThemedView style={styles.optionLeft} lightColor="transparent" darkColor="transparent">
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={option.isDestructive ? interactive.destructive : colors.icon}
                />
                <ThemedText
                  style={[
                    styles.optionText,
                    {
                      color: option.isDestructive ? interactive.destructive : colors.primaryText
                    }
                  ]}
                >
                  {option.title}
                </ThemedText>
              </ThemedView>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.secondaryText}
              />
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  phone: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '400',
  },
  memberSince: {
    fontSize: 12,
    marginBottom: 16,
    fontWeight: '400',
    opacity: 0.8,
  },
  optionsContainer: {
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 120,
  },
});