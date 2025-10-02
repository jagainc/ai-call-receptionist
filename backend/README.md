# AI Call Receptionist Backend

FastAPI backend for the AI Call Receptionist mobile application.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👤 **User Management** - Registration, login, profile management
- 🗄️ **SQLite Database** - Local development database (easily switchable to PostgreSQL)
- 🔒 **Password Hashing** - Secure bcrypt password hashing
- 🌐 **CORS Support** - Configured for React Native development
- 📝 **API Documentation** - Auto-generated with FastAPI

## Quick Start

### 1. Install Dependencies

```bash
cd ai-call-receptionist/backend
pip install -r requirements.txt
```

### 2. Set Up Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your settings (optional for development)
```

### 3. Run the Server

```bash
# Option 1: Using the run script
python run.py

# Option 2: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the API

- **API Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/logout` - Logout user

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

## Example Usage

### Register User
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123"
  }'
```

### Login User
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Get User Info (with token)
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Database

The backend uses SQLite for development (database file: `ai_call_receptionist.db`).

To switch to PostgreSQL for production:
1. Update `DATABASE_URL` in `.env`
2. Install PostgreSQL driver: `pip install psycopg2-binary`

## Development

### Project Structure
```
backend/
├── app/
│   ├── api/           # API routes
│   ├── core/          # Core functionality (config, database, security)
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   └── main.py        # FastAPI application
├── requirements.txt   # Python dependencies
├── run.py            # Development server
└── README.md         # This file
```

### Adding New Features
1. Create models in `app/models/`
2. Create schemas in `app/schemas/`
3. Create services in `app/services/`
4. Create API routes in `app/api/`
5. Include routes in `app/main.py`

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes (configurable)
- CORS is configured for development origins
- All API endpoints (except auth) require authentication

## Production Deployment

1. Set `ENVIRONMENT=production` in `.env`
2. Use a strong `SECRET_KEY`
3. Configure PostgreSQL database
4. Set up proper CORS origins
5. Use a production WSGI server like Gunicorn

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```