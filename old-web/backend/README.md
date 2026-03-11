# API Template 2025 - Enterprise-Grade Node.js API

A modern, production-ready Node.js API template built with Express.js following best practices for enterprise applications. Features clean architecture, comprehensive logging, advanced security, and flexible configuration.

## 🏗️ Architecture Overview

This project follows a clean, scalable architecture with separation of concerns:

```
├── server.js                    # Main entry point (server management)
├── src/
│   ├── app.js                  # Express application (middleware, routes)
│   ├── config/                 # Configuration files
│   ├── controllers/            # Request handlers (Controller layer)
│   ├── middlewares/            # Custom middleware functions
│   ├── models/                 # Data models (Model layer)
│   ├── routes/                 # Route definitions
│   ├── scripts/                # Database initialization scripts
│   ├── services/               # Business logic (Service layer)
│   └── utils/                  # Utility functions and helpers
└── logs/                       # Application logs (auto-created)
```

### Architecture Benefits
- **Separation of Concerns**: Server logic separate from application logic
- **Easy Testing**: App can be imported and tested independently
- **Flexible Deployment**: Different server configurations for different environments
- **Clean Structure**: Clear organization of responsibilities

## 🚀 Features

### Core Features
- **Clean Architecture**: Separated server.js and app.js for better maintainability
- **MySQL Database**: Optimized with connection pooling and error handling
- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Input Validation**: Comprehensive request validation using express-validator
- **Centralized Error Handling**: Structured error responses with detailed logging

### Security Features
- **Rate Limiting**: Configurable rate limiting with different rules per endpoint type
- **CORS Support**: Flexible cross-origin resource sharing configuration
- **Password Hashing**: Bcrypt with configurable salt rounds
- **SQL Injection Protection**: Parameterized queries throughout
- **Sensitive Data Redaction**: Automatic redaction in logs

### Monitoring & Logging
- **Structured Logging**: JSON-formatted logs with different levels
- **File-Based Logging**: Important logs automatically saved to daily files
- **Request Tracking**: Unique request IDs for correlation across all logs
- **Performance Monitoring**: Automatic detection of slow API responses
- **Environment-Based Configuration**: Flexible logging levels and file output

### Development Features
- **API Documentation**: Swagger/OpenAPI documentation
- **Environment Configuration**: Comprehensive environment variable support
- **SSL Support**: HTTPS support for production with HTTP fallback
- **Auto Table Creation**: Automatic database table initialization
- **Hot Reload**: Nodemon for development with auto-restart

## 📋 Prerequisites

- **Node.js**: v18 or higher (recommended v20+)
- **npm** or **yarn**
- **MySQL Server**: v8.0 or higher
- **Linux/macOS/Windows**: Cross-platform support

## 🛠️ Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd API-template-2025
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp env.example .env
```

4. **Configure your environment** in `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Encryption Configuration
ENCRYPTION_KEY=default_key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=api_template

# SSL Configuration (for production)
SSL_KEY_PATH=./private.key
SSL_CERT_PATH=./cert.crt

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=false
ENABLE_RESPONSE_LOGGING=false
LOG_INFO_TO_FILE=true

# Security Configuration
ENABLE_RATE_LIMITING=true
ENABLE_CORS=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001 # use "*" for allow all 
```

5. **Initialize the database**:
```bash
npm run init-db
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
- Uses nodemon for auto-restart on file changes
- Enhanced logging with request/response tracking
- Development-friendly error messages

### Production Mode
```bash
npm start
```
- Optimized for production performance
- Minimal logging output
- Production error handling

### Database Initialization
```bash
npm run init-db
```
- Creates database tables automatically
- Sets up initial data structure
- Can be run independently

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /login` - User login with rate limiting (5 req/15min)
- `POST /register` - User registration with validation
- `GET /profile` - Get user profile (JWT protected)
- `PUT /profile` - Update user profile (JWT protected)
- `GET /verify` - Verify JWT token (JWT protected)

### Example Routes (`/api/examples`)
- `GET /` - Get all examples with pagination and filtering
- `POST /` - Create new example (JWT protected)
- `GET /:id` - Get example by ID
- `PUT /:id` - Update example (JWT protected)
- `DELETE /:id` - Delete example (JWT protected)

### System Routes
- `GET /api/health` - Server health status with uptime
- `GET /api/docs` - Swagger API documentation

## 🔐 Authentication & Security

### JWT Authentication
The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token:

```
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes (stricter)
- **File Uploads**: 10 uploads per 15 minutes
- **Search Operations**: 30 searches per 15 minutes

### Security Features
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: No sensitive information leakage
- **SQL Injection Protection**: Parameterized queries throughout

## 📊 Logging System

### Log Levels
- **ERROR**: Critical errors (always saved to files)
- **WARN**: Warnings and security events (always saved to files)
- **INFO**: General information (configurable file output)
- **DEBUG**: Detailed debugging (console only)

### Log Files
```
logs/
├── error-2025-08-20.log    # All ERROR level logs
├── warn-2025-08-20.log     # All WARN level logs
└── info-2025-08-20.log     # INFO logs (if enabled)
```

### Log Format
```json
{
  "timestamp": "2025-08-20T06:15:51.671Z",
  "level": "WARN",
  "message": "API response",
  "requestId": "edc80b18-79bb-46e5-a69c-74d439838097",
  "data": {
    "statusCode": 429,
    "responseTime": 1,
    "url": "/api/auth/login"
  }
}
```

### Environment Configuration
```env
LOG_LEVEL=info                    # Set logging verbosity
ENABLE_REQUEST_LOGGING=true       # Enable request logging
ENABLE_RESPONSE_LOGGING=false     # Enable response logging
LOG_INFO_TO_FILE=false            # Save INFO logs to files
```

## 🗄️ Database Schema

### Users Table
- `id`: Primary key (auto-increment)
- `username`: Unique username (required)
- `password`: Hashed password (required)
- `email`: Email address (optional, unique)
- `is_active`: Account status (boolean)
- `last_login`: Last login timestamp
- `created_at`, `updated_at`: Timestamps

### Examples Table
- `id`: Primary key (auto-increment)
- `field_1`: Required string field
- `field_2`: Optional string field
- `field_3`: Optional decimal field
- `created_by`: Foreign key reference to users.id
- `created_at`, `updated_at`: Timestamps

## 🔧 Configuration

### Environment Variables

#### Server Configuration
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

#### Security Configuration
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: JWT token expiration time
- `ENCRYPTION_KEY`: Key for data encryption

#### Database Configuration
- `MYSQL_HOST`: MySQL server host
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MYSQL_DATABASE`: MySQL database name

#### Rate Limiting
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
- `ENABLE_RATE_LIMITING`: Enable/disable rate limiting

#### Logging Configuration
- `LOG_LEVEL`: Set logging verbosity
- `ENABLE_REQUEST_LOGGING`: Enable request logging
- `ENABLE_RESPONSE_LOGGING`: Enable response logging
- `LOG_INFO_TO_FILE`: Save INFO logs to files

#### CORS Configuration
- `ENABLE_CORS`: Enable/disable CORS
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins

## 📝 Adding New Features

### 1. Create a Model
```javascript
// src/models/NewModel.js
const { query } = require('../services/db');

class NewModel {
  static async create(data) {
    const sql = 'INSERT INTO new_models (field1, field2) VALUES (?, ?)';
    const result = await query(sql, [data.field1, data.field2]);
    return { id: result.insertId, ...data };
  }
  
  static async findById(id) {
    const sql = 'SELECT * FROM new_models WHERE id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }
}

module.exports = NewModel;
```

### 2. Create a Service
```javascript
// src/services/NewModelService.js
const NewModel = require('../models/NewModel');

class NewModelService {
  async createNewModel(data) {
    return await NewModel.create(data);
  }
  
  async getNewModelById(id) {
    return await NewModel.findById(id);
  }
}

module.exports = new NewModelService();
```

### 3. Create a Controller
```javascript
// src/controllers/NewModelController.js
const NewModelService = require('../services/NewModelService');
const { msg, errMsg } = require('../utils/helper');

class NewModelController {
  async create(req, res) {
    try {
      const result = await NewModelService.createNewModel(req.body);
      res.status(201).json(msg({
        code: 201,
        message: 'New model created successfully',
        data: result
      }));
    } catch (error) {
      res.status(500).json(errMsg({
        code: 500,
        message: 'Failed to create new model',
        error: error.message
      }));
    }
  }
}

module.exports = new NewModelController();
```

### 4. Create Routes
```javascript
// src/routes/newModelRoutes.js
const express = require('express');
const router = express.Router();
const NewModelController = require('../controllers/NewModelController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, NewModelController.create);
router.get('/:id', NewModelController.getById);

module.exports = router;
```

### 5. Register Routes in App
```javascript
// src/app.js
const newModelRoutes = require('./routes/newModelRoutes');
app.use('/api/newmodels', newModelRoutes);
```

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Test rate limiting
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}'
  echo "---"
done
```

### Automated Testing
```bash
npm test
```

## 📦 Dependencies

### Core Dependencies
- `express`: Web framework
- `mysql2`: MySQL driver with connection pooling
- `jsonwebtoken`: JWT implementation
- `bcrypt`: Password hashing
- `express-validator`: Input validation
- `cors`: Cross-origin resource sharing
- `express-rate-limit`: Rate limiting
- `uuid`: Unique identifier generation

### Development Dependencies
- `nodemon`: Development server with auto-reload
- `swagger-jsdoc`: API documentation
- `swagger-ui-express`: Swagger UI

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set all production values
2. **SSL Certificates**: Configure proper SSL certificates
3. **Database**: Use production MySQL instance
4. **Logging**: Set appropriate log levels
5. **Rate Limiting**: Adjust limits for production traffic
6. **CORS**: Configure allowed origins for production

### Docker Support
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Open an issue in the repository
- **Documentation**: Check the `/api/docs` endpoint when running
- **Examples**: See the example routes for implementation patterns

## 🔄 Changelog

### v2.0.0 (Current)
- **Architecture Refactor**: Separated server.js and app.js
- **Comprehensive Logging**: File-based logging with structured output
- **Enhanced Security**: Configurable rate limiting and CORS
- **Environment Configuration**: Flexible environment-based settings
- **Performance Monitoring**: Automatic slow response detection
- **Production Ready**: Enhanced error handling and security features

### v1.0.0
- Initial release with basic MVC structure
- JWT authentication
- MySQL integration
- Basic CRUD operations

---

**Built with ❤️ for modern API development**
