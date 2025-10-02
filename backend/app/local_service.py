"""
Local-first authentication and data service for AI Call Receptionist.
This service runs locally without network exposure and uses SQLite for data persistence.
"""

import sqlite3
import hashlib
import secrets
import json
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from pathlib import Path
import uuid

class LocalAuthService:
    def __init__(self, db_path: str = None):
        """Initialize the local authentication service with SQLite database."""
        if db_path is None:
            # Create database in user's app data directory
            app_data_dir = Path.home() / ".ai_call_receptionist"
            app_data_dir.mkdir(exist_ok=True)
            db_path = app_data_dir / "app_data.db"
        
        self.db_path = str(db_path)
        self.init_database()
    
    def init_database(self):
        """Initialize the SQLite database with required tables."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                full_name TEXT NOT NULL,
                phone_number TEXT,
                profile_picture_path TEXT,
                is_active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        ''')
        
        # Create sessions table for local session management
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        # Create contacts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT,
                phone_number TEXT NOT NULL,
                email TEXT,
                company TEXT,
                notes TEXT,
                tags TEXT,
                is_favorite INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        # Create calls table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS calls (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                contact_id TEXT,
                title TEXT NOT NULL,
                description TEXT,
                scheduled_at TEXT NOT NULL,
                duration_minutes INTEGER DEFAULT 30,
                status TEXT DEFAULT 'scheduled',
                ai_instructions TEXT,
                call_type TEXT DEFAULT 'outbound',
                priority TEXT DEFAULT 'medium',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE SET NULL
            )
        ''')
        
        # Create calendar events table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS calendar_events (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                color TEXT DEFAULT '#3B82F6',
                is_all_day INTEGER DEFAULT 0,
                recurrence_rule TEXT,
                reminder_minutes INTEGER,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_calls_user_id ON calls(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id)')
        
        conn.commit()
        conn.close()
    
    def _hash_password(self, password: str) -> str:
        """Hash a password using SHA-256 with salt."""
        salt = secrets.token_hex(32)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    def _verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        try:
            salt, password_hash = hashed_password.split(':')
            return hashlib.sha256((password + salt).encode()).hexdigest() == password_hash
        except ValueError:
            return False
    
    def _generate_session_token(self) -> str:
        """Generate a secure session token."""
        return secrets.token_urlsafe(32)
    
    def _get_current_timestamp(self) -> str:
        """Get current timestamp as ISO string."""
        return datetime.utcnow().isoformat()
    
    def register_user(self, email: str, password: str, full_name: str, phone_number: str = None) -> Dict[str, Any]:
        """Register a new user."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Check if user already exists
            cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                return {
                    'success': False,
                    'error': 'User with this email already exists'
                }
            
            # Create new user
            user_id = str(uuid.uuid4())
            hashed_password = self._hash_password(password)
            current_time = self._get_current_timestamp()
            
            cursor.execute('''
                INSERT INTO users (id, email, hashed_password, full_name, phone_number, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, email, hashed_password, full_name, phone_number, current_time, current_time))
            
            conn.commit()
            
            return {
                'success': True,
                'user': {
                    'id': user_id,
                    'email': email,
                    'full_name': full_name,
                    'phone_number': phone_number,
                    'created_at': current_time
                }
            }
        
        except Exception as e:
            conn.rollback()
            return {
                'success': False,
                'error': f'Registration failed: {str(e)}'
            }
        finally:
            conn.close()
    
    def login_user(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user and create session."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get user by email
            cursor.execute('''
                SELECT id, email, hashed_password, full_name, phone_number, profile_picture_path, is_active
                FROM users WHERE email = ?
            ''', (email,))
            
            user_row = cursor.fetchone()
            if not user_row:
                return {
                    'success': False,
                    'error': 'Invalid email or password'
                }
            
            user_id, user_email, hashed_password, full_name, phone_number, profile_picture_path, is_active = user_row
            
            # Check if user is active
            if not is_active:
                return {
                    'success': False,
                    'error': 'Account is deactivated'
                }
            
            # Verify password
            if not self._verify_password(password, hashed_password):
                return {
                    'success': False,
                    'error': 'Invalid email or password'
                }
            
            # Create session
            session_id = str(uuid.uuid4())
            session_token = self._generate_session_token()
            expires_at = (datetime.utcnow() + timedelta(days=30)).isoformat()
            current_time = self._get_current_timestamp()
            
            # Clean up old sessions for this user
            cursor.execute('DELETE FROM user_sessions WHERE user_id = ?', (user_id,))
            
            # Create new session
            cursor.execute('''
                INSERT INTO user_sessions (id, user_id, session_token, expires_at, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (session_id, user_id, session_token, expires_at, current_time))
            
            conn.commit()
            
            return {
                'success': True,
                'session_token': session_token,
                'user': {
                    'id': user_id,
                    'email': user_email,
                    'full_name': full_name,
                    'phone_number': phone_number,
                    'profile_picture_path': profile_picture_path
                }
            }
        
        except Exception as e:
            conn.rollback()
            return {
                'success': False,
                'error': f'Login failed: {str(e)}'
            }
        finally:
            conn.close()
    
    def get_user_by_session(self, session_token: str) -> Dict[str, Any]:
        """Get user information by session token."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get session and user info
            cursor.execute('''
                SELECT u.id, u.email, u.full_name, u.phone_number, u.profile_picture_path, s.expires_at
                FROM users u
                JOIN user_sessions s ON u.id = s.user_id
                WHERE s.session_token = ? AND u.is_active = 1
            ''', (session_token,))
            
            result = cursor.fetchone()
            if not result:
                return {
                    'success': False,
                    'error': 'Invalid session'
                }
            
            user_id, email, full_name, phone_number, profile_picture_path, expires_at = result
            
            # Check if session is expired
            if datetime.fromisoformat(expires_at) < datetime.utcnow():
                # Clean up expired session
                cursor.execute('DELETE FROM user_sessions WHERE session_token = ?', (session_token,))
                conn.commit()
                return {
                    'success': False,
                    'error': 'Session expired'
                }
            
            return {
                'success': True,
                'user': {
                    'id': user_id,
                    'email': email,
                    'full_name': full_name,
                    'phone_number': phone_number,
                    'profile_picture_path': profile_picture_path
                }
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': f'Session validation failed: {str(e)}'
            }
        finally:
            conn.close()
    
    def logout_user(self, session_token: str) -> Dict[str, Any]:
        """Logout user by removing session."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM user_sessions WHERE session_token = ?', (session_token,))
            conn.commit()
            
            return {
                'success': True,
                'message': 'Logged out successfully'
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': f'Logout failed: {str(e)}'
            }
        finally:
            conn.close()
    
    def update_user_profile(self, session_token: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile information."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get user ID from session
            user_result = self.get_user_by_session(session_token)
            if not user_result['success']:
                return user_result
            
            user_id = user_result['user']['id']
            
            # Build update query
            allowed_fields = ['full_name', 'phone_number', 'profile_picture_path']
            update_fields = []
            update_values = []
            
            for field, value in updates.items():
                if field in allowed_fields:
                    update_fields.append(f"{field} = ?")
                    update_values.append(value)
            
            if not update_fields:
                return {
                    'success': False,
                    'error': 'No valid fields to update'
                }
            
            # Add updated_at timestamp
            update_fields.append("updated_at = ?")
            update_values.append(self._get_current_timestamp())
            update_values.append(user_id)
            
            query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, update_values)
            conn.commit()
            
            # Return updated user info
            return self.get_user_by_session(session_token)
        
        except Exception as e:
            conn.rollback()
            return {
                'success': False,
                'error': f'Profile update failed: {str(e)}'
            }
        finally:
            conn.close()


# Create a global instance
local_auth_service = LocalAuthService()


def main():
    """Test the local authentication service."""
    service = LocalAuthService()
    
    # Test registration
    print("Testing registration...")
    result = service.register_user(
        email="test@example.com",
        password="testpassword123",
        full_name="Test User",
        phone_number="+1234567890"
    )
    print(f"Registration result: {result}")
    
    # Test login
    print("\nTesting login...")
    login_result = service.login_user("test@example.com", "testpassword123")
    print(f"Login result: {login_result}")
    
    if login_result['success']:
        session_token = login_result['session_token']
        
        # Test session validation
        print("\nTesting session validation...")
        session_result = service.get_user_by_session(session_token)
        print(f"Session validation result: {session_result}")
        
        # Test profile update
        print("\nTesting profile update...")
        update_result = service.update_user_profile(session_token, {
            'full_name': 'Updated Test User',
            'phone_number': '+9876543210'
        })
        print(f"Profile update result: {update_result}")
        
        # Test logout
        print("\nTesting logout...")
        logout_result = service.logout_user(session_token)
        print(f"Logout result: {logout_result}")


if __name__ == "__main__":
    main()