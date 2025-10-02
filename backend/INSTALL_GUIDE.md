# Python Installation Guide for AI Call Receptionist Backend

## 🍎 macOS Installation (Your System)

### Option 1: Using Homebrew (Recommended)

#### Step 1: Install Homebrew (if not already installed)
```bash
# Check if Homebrew is installed
brew --version

# If not installed, install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install Python
```bash
# Install Python 3.11 (recommended version)
brew install python@3.11

# Verify installation
python3 --version
pip3 --version
```

#### Step 3: Create alias (optional but recommended)
```bash
# Add to your ~/.zshrc file
echo 'alias python=python3' >> ~/.zshrc
echo 'alias pip=pip3' >> ~/.zshrc

# Reload your shell
source ~/.zshrc
```

### Option 2: Using Python.org Installer

1. Go to https://www.python.org/downloads/
2. Download Python 3.11.x for macOS
3. Run the installer
4. Follow the installation wizard

### Option 3: Using pyenv (For Multiple Python Versions)

```bash
# Install pyenv
brew install pyenv

# Install Python 3.11
pyenv install 3.11.7

# Set as global version
pyenv global 3.11.7

# Add to ~/.zshrc
echo 'export PATH="$HOME/.pyenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

## 🚀 Backend Setup Instructions

### Step 1: Navigate to Backend Directory
```bash
cd ai-call-receptionist/backend
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# You should see (venv) in your terminal prompt
```

### Step 3: Install Dependencies
```bash
# Upgrade pip first
pip install --upgrade pip

# Install all backend dependencies
pip install -r requirements.txt
```

### Step 4: Start the Backend Server
```bash
# Option 1: Using the run script
python run.py

# Option 2: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Verify Installation
Open your browser and go to:
- **API Base**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

You should see the API documentation and be able to test endpoints.

## 🔧 Troubleshooting

### Common Issues:

#### 1. "python3: command not found"
```bash
# Install Python using Homebrew
brew install python@3.11
```

#### 2. "pip: command not found"
```bash
# Python 3 comes with pip, but you might need to use pip3
pip3 --version

# Or install pip manually
python3 -m ensurepip --upgrade
```

#### 3. Permission errors
```bash
# Use virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Port 8000 already in use
```bash
# Use a different port
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

#### 5. SQLite database issues
```bash
# The database file will be created automatically
# If issues persist, delete the database file and restart
rm ai_call_receptionist.db
python run.py
```

## 📱 Frontend Configuration

After the backend is running, you'll need to update your React Native app to point to the correct backend URL.

### For iOS Simulator:
```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### For Android Emulator:
```typescript
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';
```

### For Physical Device:
```typescript
// Replace with your computer's IP address
const API_BASE_URL = 'http://192.168.1.100:8000/api/v1';
```

## 🎯 Quick Start Commands

```bash
# 1. Install Python (if not installed)
brew install python@3.11

# 2. Navigate to backend
cd ai-call-receptionist/backend

# 3. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start server
python run.py
```

## 🔍 Verification Checklist

- [ ] Python 3.11+ installed (`python3 --version`)
- [ ] Pip installed (`pip3 --version`)
- [ ] Virtual environment created and activated
- [ ] Dependencies installed successfully
- [ ] Backend server starts without errors
- [ ] Can access http://localhost:8000/docs
- [ ] Health check returns {"status": "healthy"}

## 📚 Next Steps

1. **Test API Endpoints**: Use the interactive docs at http://localhost:8000/docs
2. **Register a User**: Try the `/api/v1/auth/register` endpoint
3. **Login**: Test the `/api/v1/auth/login` endpoint
4. **Update Frontend**: Make sure your React Native app points to the backend
5. **Test Full Flow**: Register → Login → Access protected endpoints

## 🆘 Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify Python and pip versions
3. Make sure virtual environment is activated
4. Check if port 8000 is available
5. Review the backend logs for detailed error information

Happy coding! 🚀