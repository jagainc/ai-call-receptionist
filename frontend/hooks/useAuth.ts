import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  profile_picture_path?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Local storage keys
const SESSION_USER_KEY = '@session_user';
const USERS_STORAGE_KEY = '@users_db';

// Simple hash function for password (basic security)
const hashPassword = (password: string): string => {
  const salt = Math.random().toString(36).substring(2, 15);
  // Simple hash - in production, use a proper crypto library
  let hash = 0;
  const combined = password + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${salt}:${hash.toString()}`;
};

// Verify password
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  try {
    const [salt, hash] = hashedPassword.split(':');
    let computedHash = 0;
    const combined = password + salt;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      computedHash = ((computedHash << 5) - computedHash) + char;
      computedHash = computedHash & computedHash; // Convert to 32-bit integer
    }
    return computedHash.toString() === hash;
  } catch {
    return false;
  }
};

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Get users from AsyncStorage
const getUsers = async (): Promise<any[]> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch {
    return [];
  }
};

// Save users to AsyncStorage
const saveUsers = async (users: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const checkAuthStatus = async () => {
    console.log('Starting auth check...');
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check for cached user session (only valid during current app session)
      const cachedUser = await AsyncStorage.getItem(SESSION_USER_KEY);
      
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        console.log('User authenticated from session:', user.email);
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('No session found, user must login');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Get users from storage
      const users = await getUsers();

      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password
      const isValidPassword = verifyPassword(password, user.hashed_password);
      
      if (!isValidPassword) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Invalid email or password' };
      }

      // Create user object (without password)
      const userObj: User = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        profile_picture_path: user.profile_picture_path,
      };

      // Save user session
      await AsyncStorage.setItem(SESSION_USER_KEY, JSON.stringify(userObj));

      setAuthState({
        user: userObj,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('Login successful:', userObj.email);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (full_name: string, email: string, password: string, phone_number?: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Get existing users
      const users = await getUsers();

      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'User with this email already exists' };
      }

      // Hash password
      const hashedPassword = hashPassword(password);

      // Create user
      const newUser = {
        id: generateId(),
        email: email.toLowerCase(),
        hashed_password: hashedPassword,
        full_name,
        phone_number: phone_number || null,
        profile_picture_path: null,
        created_at: new Date().toISOString(),
      };

      // Add user to storage
      users.push(newUser);
      await saveUsers(users);

      // Registration successful but don't auto-login for security
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log('Registration successful:', email);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Remove session data and update state
      await AsyncStorage.removeItem(SESSION_USER_KEY);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if removal fails
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_USER_KEY);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log('Auth data cleared');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    checkAuthStatus,
    clearAuthData,
  };
}
