# Postman Testing Guide

## Base URL
```
http://localhost:5000
```

## Step 1: Start the Server
Make sure your server is running:
```bash
npm start
```

---

## Authentication Endpoints

### 1. Register a New User
**POST** `http://localhost:5000/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Save the `token` from the response - you'll need it for protected routes!**

---

### 2. Login
**POST** `http://localhost:5000/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Save the `token` from the response!**

---

## Task Endpoints (Protected - Requires Authentication)

**Important:** All task endpoints require authentication. Add the token to the Authorization header.

### Setting up Authorization in Postman:

1. Go to the **Authorization** tab
2. Select **Type: Bearer Token**
3. Paste your token in the **Token** field

OR manually add to Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 3. Create a Task
**POST** `http://localhost:5000/tasks`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "priority": "High",
  "status": "Pending"
}
```

**Valid Values:**
- `priority`: "Low", "Medium", "High"
- `status`: "Pending", "In Progress", "Done"

**Expected Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "priority": "High",
  "status": "Pending",
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Get All Tasks
**GET** `http://localhost:5000/tasks`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters (optional):**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status: "Pending", "In Progress", "Done"
- `priority` - Filter by priority: "Low", "Medium", "High"
- `sort` - Sort field: "priority", "-createdAt", "createdAt" (prefix with `-` for descending)

**Examples:**
```
http://localhost:5000/tasks?page=1&limit=10
http://localhost:5000/tasks?status=Pending&priority=High
http://localhost:5000/tasks?sort=-createdAt
http://localhost:5000/tasks?status=In Progress&sort=priority&page=1&limit=5
```

**Expected Response (200):**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "priority": "High",
      "status": "Pending",
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 5. Get Single Task
**GET** `http://localhost:5000/tasks/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```
http://localhost:5000/tasks/507f1f77bcf86cd799439012
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "priority": "High",
  "status": "Pending",
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 6. Update a Task
**PUT** `http://localhost:5000/tasks/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON) - all fields are optional:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "Medium",
  "status": "In Progress"
}
```

**Example URL:**
```
http://localhost:5000/tasks/507f1f77bcf86cd799439012
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "Medium",
  "status": "In Progress",
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 7. Delete a Task
**DELETE** `http://localhost:5000/tasks/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example URL:**
```
http://localhost:5000/tasks/507f1f77bcf86cd799439012
```

**Expected Response (204):** No content

---

## Quick Testing Workflow

1. **Register a user** → Save the token
2. **Login** (optional, to get a fresh token) → Save the token
3. **Create a task** → Use the token in Authorization header
4. **Get all tasks** → Use the token in Authorization header
5. **Get single task** → Use the task ID from step 3
6. **Update task** → Use the task ID
7. **Delete task** → Use the task ID

---

## Common Errors

### 401 Unauthorized
- Token is missing or invalid
- Token has expired
- **Solution:** Login again to get a new token

### 400 Bad Request
- Invalid request body
- Missing required fields
- Invalid field values (e.g., wrong status/priority)

### 404 Not Found
- Task ID doesn't exist
- Task belongs to another user

### 409 Conflict
- Email already registered (during registration)

---

## Postman Tips

1. **Create a Postman Environment:**
   - Create variables: `base_url` = `http://localhost:5000`
   - Create variable: `token` = (will be set after login)
   - Use `{{base_url}}/users/register` in requests

2. **Auto-save Token:**
   - After login/register, use Tests tab:
   ```javascript
   if (pm.response.code === 200 || pm.response.code === 201) {
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.token);
   }
   ```

3. **Use Collection Variables:**
   - Set `token` as a collection variable
   - Use `{{token}}` in Authorization header

