import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import BlurText from '@/components/ui/BlurText';
import DarkVeil from '@/components/ui/DarkVeil';
import { useAppColors } from '@/hooks/useAppColors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const colorScheme = useColorScheme();
  const { colors } = useAppColors();
  const { login, register } = useAuth();

  // Load saved email on component mount (for convenience, not password for security)
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('@saved_email');
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error) {
        console.log('No saved email found');
      }
    };
    
    loadSavedEmail();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (authMode === 'register') {
      if (!name) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);

    try {
      let result;
      if (authMode === 'login') {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (result.success) {
        if (authMode === 'register') {
          // After successful registration, save only email (not password for security)
          await AsyncStorage.setItem('@saved_email', email);
          
          Alert.alert(
            'Registration Successful!', 
            'Your account has been created. Please login with your credentials.',
            [
              {
                text: 'Login Now',
                onPress: () => {
                  setAuthMode('login');
                  setPassword(''); // Clear password for security
                  // Email stays filled for convenience
                }
              }
            ]
          );
        } else {
          // Login successful - save only email (not password for security)
          await AsyncStorage.setItem('@saved_email', email);
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', result.error || 'Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <DarkVeil
        hueShift={0}
        noiseIntensity={0.15}
        scanlineIntensity={0.1}
        speed={0.3}
        warpAmount={0.02}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Animated Welcome Text - Memoized to prevent re-renders */}
          <ThemedView style={styles.welcomeSection} lightColor="transparent" darkColor="transparent">
            <BlurText
              text="Welcome to Kijo"
              delay={150}
              animateBy="words"
              direction="top"
              style={styles.welcomeTextContainer}
              textStyle={styles.welcomeText}
            />
          </ThemedView>

          {/* Header */}
          <ThemedView style={styles.header} lightColor="transparent" darkColor="transparent">
            </ThemedView>
            <ThemedText style={[styles.subtitle, { color: colors.secondaryText }]}>
              {authMode === 'login' 
                ? 'Sign in to continue' 
                : 'Create your account to get started'
              }
            </ThemedText>

        {/* Auth Form */}
        <ThemedView style={styles.formSection} lightColor="transparent" darkColor="transparent">
          <View style={styles.formCard}>
            <BlurView
              intensity={Platform.OS === 'web' ? 0 : 20}
              tint={colorScheme === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
              style={styles.blurBackground}
            />
            <View style={[styles.glassOverlay, { backgroundColor: colors.glassOverlay, borderColor: colors.glassBorder }]} />
            
            <View style={styles.formContent}>
              <ThemedText type="subtitle" style={styles.formTitle}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </ThemedText>

              {/* Name Field (Register only) */}
              {authMode === 'register' && (
                <View style={styles.inputContainer}>
                  <ThemedText style={[styles.inputLabel, { color: colors.secondaryText }]}>
                    Full Name
                  </ThemedText>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.secondaryBackground, borderColor: colors.border }]}>
                    <Ionicons name="person-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.textInput, { color: colors.primaryText }]}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.secondaryText}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              )}

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <ThemedText style={[styles.inputLabel, { color: colors.secondaryText }]}>
                  Email Address
                </ThemedText>
                <View style={[styles.inputWrapper, { backgroundColor: colors.secondaryBackground, borderColor: colors.border }]}>
                  <Ionicons name="mail-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, { color: colors.primaryText }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.secondaryText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <ThemedText style={[styles.inputLabel, { color: colors.secondaryText }]}>
                  Password
                </ThemedText>
                <View style={[styles.inputWrapper, { backgroundColor: colors.secondaryBackground, borderColor: colors.border }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, { color: colors.primaryText }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.secondaryText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color={colors.icon} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field (Register only) */}
              {authMode === 'register' && (
                <View style={styles.inputContainer}>
                  <ThemedText style={[styles.inputLabel, { color: colors.secondaryText }]}>
                    Confirm Password
                  </ThemedText>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.secondaryBackground, borderColor: colors.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.textInput, { color: colors.primaryText }]}
                      placeholder="Confirm your password"
                      placeholderTextColor={colors.secondaryText}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color={colors.icon} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Forgot Password (Login only) */}
              {authMode === 'login' && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <ThemedText style={[styles.forgotPasswordText, { color: colors.tint }]}>
                    Forgot Password?
                  </ThemedText>
                </TouchableOpacity>
              )}

              {/* Auth Button */}
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: colors.tint }]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ThemedText style={styles.authButtonText}>
                    {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.authButtonText}>
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </ThemedText>
                )}
              </TouchableOpacity>

              {/* Toggle Auth Mode */}
              <View style={styles.toggleContainer}>
                <ThemedText style={[styles.toggleText, { color: colors.secondaryText }]}>
                  {authMode === 'login' 
                    ? "Don't have an account? " 
                    : "Already have an account? "
                  }
                </ThemedText>
                <TouchableOpacity onPress={toggleAuthMode}>
                  <ThemedText style={[styles.toggleLink, { color: colors.tint }]}>
                    {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ThemedView>

        {/* Social Auth Section */}
        <ThemedView style={styles.socialSection} lightColor="transparent" darkColor="transparent">
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <ThemedText style={[styles.dividerText, { color: colors.secondaryText }]}>
              Or continue with
            </ThemedText>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <ThemedText style={[styles.socialButtonText, { color: colors.primaryText }]}>
                Google
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Ionicons name="logo-apple" size={24} color={colors.primaryText} />
              <ThemedText style={[styles.socialButtonText, { color: colors.primaryText }]}>
                Apple
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

          {/* Bottom padding */}
          <ThemedView style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 40,
  },
  welcomeTextContainer: {
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom:15,
  },
  formSection: {
    marginBottom: 32,
  },
  formCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
    shadowColor: '#000000',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  formContent: {
    padding: 24,
    position: 'relative',
    zIndex: 1,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  authButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  socialSection: {
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    paddingHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
    backgroundColor: 'transparent',
  },
});