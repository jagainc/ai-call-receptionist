import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('ai_call_receptionist.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  async hashPassword(password: string): Promise<string> {
    // Simple hash using expo-crypto (in production, use bcrypt or similar)
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password + 'ai_call_receptionist_salt'
    );
    return hash;
  }

  async createUser(name: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if user already exists
      const existingUser = await this.db.getFirstAsync<User>(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const userId = await Crypto.randomUUID();
      const passwordHash = await this.hashPassword(password);
      const createdAt = new Date().toISOString();

      await this.db.runAsync(
        'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
        [userId, name, email.toLowerCase(), passwordHash, createdAt]
      );

      const user: User = {
        id: userId,
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        created_at: createdAt,
      };

      return { success: true, user };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  async authenticateUser(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const passwordHash = await this.hashPassword(password);
      
      const user = await this.db.getFirstAsync<User>(
        'SELECT * FROM users WHERE email = ? AND password_hash = ?',
        [email.toLowerCase(), passwordHash]
      );

      if (user) {
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const user = await this.db.getFirstAsync<User>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return user || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const users = await this.db.getAllAsync<User>('SELECT * FROM users ORDER BY created_at DESC');
      return users;
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }
}

export const databaseService = new DatabaseService();
export type { User };