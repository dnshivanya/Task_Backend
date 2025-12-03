# Task Management API

A RESTful API for managing tasks with user authentication, built with Node.js, Express, and MongoDB.

## Features

- ✅ User registration and authentication with JWT
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Filter tasks by status or priority
- ✅ Sort tasks by priority or creation date
- ✅ Pagination support
- ✅ Input validation
- ✅ Password hashing with bcrypt
- ✅ Protected routes with authentication middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   MONGODB_URI=mongodb://localhost:27017/task-manager
   ```

   For MongoDB Atlas (Cloud):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager?retryWrites=true&w=majority
   ```

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication

#### Register User
- **POST** `/users/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Login
- **POST** `/users/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

### Tasks (All require authentication)

#### Create Task
- **POST** `/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Complete project",
    "description": "Finish the task management API",
    "priority": "High",
    "status": "Pending"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "task": {
        "_id": "task_id",
        "title": "Complete project",
        "description": "Finish the task management API",
        "priority": "High",
        "status": "Pending",
        "userId": "user_id",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### Get All Tasks
- **GET** `/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` (optional): Filter by status (`Pending`, `In Progress`, `Done`)
  - `priority` (optional): Filter by priority (`Low`, `Medium`, `High`)
  - `sortBy` (optional): Sort by `priority` or `createdAt`
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Tasks per page (default: 10)
- **Example:** `/tasks?status=Pending&priority=High&sortBy=priority&page=1&limit=10`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Tasks retrieved successfully",
    "data": {
      "tasks": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalTasks": 50,
        "tasksPerPage": 10
      }
    }
  }
  ```

#### Get Single Task
- **GET** `/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Task retrieved successfully",
    "data": {
      "task": {...}
    }
  }
  ```

#### Update Task
- **PUT** `/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (all fields optional)
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "priority": "Medium",
    "status": "In Progress"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "data": {
      "task": {...}
    }
  }
  ```

#### Delete Task
- **DELETE** `/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {
      "task": {...}
    }
  }
  ```

## Testing with cURL

### Register a new user
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a task (replace TOKEN with your JWT token)
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "My first task",
    "description": "This is a test task",
    "priority": "High",
    "status": "Pending"
  }'
```

### Get all tasks
```bash
curl -X GET "http://localhost:3000/tasks?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### Get filtered tasks
```bash
curl -X GET "http://localhost:3000/tasks?status=Pending&priority=High&sortBy=priority" \
  -H "Authorization: Bearer TOKEN"
```

## Testing with Postman

1. Import the API collection (if available)
2. Set up environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set after login)
3. Register a new user
4. Login and copy the token
5. Set the token in the Authorization header for task endpoints

## Project Structure

```
task-manager-api/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── taskController.js    # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Task.js              # Task model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   └── taskRoutes.js        # Task routes
│   ├── utils/
│   │   └── generateToken.js     # JWT token generation
│   └── server.js                # Main server file
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [...] // For validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

## Deployment

### Deploy to Heroku

1. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set NODE_ENV=production
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Railway will automatically deploy

### Deploy to Render

1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Deploy to Vercel/Netlify

These platforms are better suited for serverless functions. For a traditional Express app, consider:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## Docker Support

See `Dockerfile` and `docker-compose.yml` for containerized deployment.

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Security Notes

- Always use a strong `JWT_SECRET` in production
- Use HTTPS in production
- Keep your MongoDB connection string secure
- Consider adding rate limiting for production
- Implement CORS properly for your frontend domain

## License

ISC

## Author

Task Management API - Node.js Backend Practical Test

