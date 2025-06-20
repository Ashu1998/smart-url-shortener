# 🔗 Smart URL Shortener

A modern, intelligent URL shortening service built with Node.js, TypeScript, and Redis. This application features AI-powered malicious URL detection, comprehensive analytics, and high-performance caching.

## ✨ Features

- **🔒 AI-Powered Security**: Real-time malicious URL detection using AI scanning
- **📊 Analytics**: Track clicks, visitor information, and referral data
- **⚡ High Performance**: Redis-based caching for fast URL lookups
- **🛡️ Rate Limiting**: Built-in protection against abuse (100 requests/hour per IP)
- **🔍 URL Normalization**: Automatic cleanup of UTM parameters and fragments
- **🐳 Docker Ready**: Complete containerization with Docker Compose
- **📱 RESTful API**: Clean, documented endpoints for easy integration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Express API   │    │   Redis Cache   │
│                 │◄──►│                 │◄──►│                 │
│ - Web Interface │    │ - URL Shortening│    │ - URL Storage   │
│ - Mobile App    │    │ - Analytics     │    │ - Click Tracking│
│ - API Client    │    │ - Rate Limiting │    │ - Rate Limiting │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   AI Scanner    │
                       │                 │
                       │ - Malicious URL │
                       │   Detection     │
                       │ - Caching Layer │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- Redis 7.x
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ashu1998/smart-url-shortener.git
   cd smart-url-shortener
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   NODE_ENV=development
   PORT=3000
   BASE_URL=http://localhost:3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   AI_URL=http://localhost:5000
   ```
4. **Start Redis**

   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:7-alpine

   # Or install Redis locally
   # brew install redis (macOS)
   # sudo apt-get install redis-server (Ubuntu)
   ```
5. **Run the application**

   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

### Docker Deployment

1. **Start all services**

   ```bash
   docker-compose up -d
   ```
2. **Access the application**

   - API: http://localhost:5051
   - Redis: localhost:6379

## 📚 API Documentation

### Base URL

```
http://localhost:3000 (local)
http://localhost:5051 (Docker)
```

### Endpoints

#### 1. Create Short URL

**POST** `/shorten`

Creates a shortened URL with AI-powered security scanning.

**Request Body:**

```json
{
  "originalUrl": "https://example.com/very-long-url-path"
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:3000/abc1234"
}
```

**Error Responses:**

- `400` - Invalid URL or malicious URL detected
- `429` - Rate limit exceeded
- `500` - Server error

#### 2. Redirect to Original URL

**GET** `/:shortId`

Redirects to the original URL and tracks analytics.

**Response:**

- `302` - Redirect to original URL
- `404` - Short URL not found

#### 3. Get Analytics

**GET** `/analytics/:shortId`

Retrieves click statistics and visitor information.

**Response:**

```json
{
  "shortUrl": "http://localhost:3000/abc1234",
  "totalClicks": "42",
  "visits": [
    {
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "referrer": "https://google.com",
      "ts": 1703123456789
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

| Variable       | Description              | Default                   |
| -------------- | ------------------------ | ------------------------- |
| `NODE_ENV`   | Environment mode         | `development`           |
| `PORT`       | Server port              | `3000`                  |
| `BASE_URL`   | Base URL for short links | `http://localhost:3000` |
| `REDIS_HOST` | Redis server host        | `localhost`             |
| `REDIS_PORT` | Redis server port        | `6379`                  |
| `AI_URL`     | AI scanner service URL   | `http://localhost:5000` |

### Rate Limiting

- **Limit**: 100 requests per hour per IP
- **Window**: 1 hour
- **Storage**: Redis-based sliding window

## 🛠️ Development

### Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── services/        # Business logic services
├── utils/           # Utility functions
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
```

### Key Features Implementation

#### AI URL Scanning

- Integrates with external AI service for malicious URL detection
- Caches scan results to improve performance
- Supports multiple threat categories (malicious, phishing, malware)

#### URL Normalization

- Removes UTM tracking parameters
- Strips URL fragments
- Normalizes trailing slashes
- Ensures consistent URL storage

#### Analytics Tracking

- Click counting with Redis
- Visitor IP tracking
- User agent logging
- Referrer information
- Timestamp recording

## 🚀 Deployment

### Production Deployment

1. **Build the application**

   ```bash
   npm run build
   ```
2. **Set production environment variables**

   ```env
   NODE_ENV=production
   PORT=3000
   BASE_URL=https://yourdomain.com
   REDIS_HOST=your-redis-host
   REDIS_PORT=6379
   AI_URL=https://your-ai-service.com
   ```
3. **Start the application**

   ```bash
   npm start
   ```

### Docker Production

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or build manually
docker build -t smart-url-shortener .
docker run -p 3000:3000 smart-url-shortener
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any issues, please [create an issue](https://github.com/Ashu1998/smart-url-shortener/issues) on GitHub.

## 🔗 Links

- **Repository**: https://github.com/Ashu1998/smart-url-shortener
- **Issues**: https://github.com/Ashu1998/smart-url-shortener/issues

---

Built with ❤️ using Node.js, TypeScript, Express, and Redis
