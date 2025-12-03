# Cloud Deployment Guide - Step by Step

This guide will walk you through deploying your Task Manager API to Render.com (free tier available).

## Prerequisites
- GitHub account
- Render.com account (free)
- MongoDB Atlas account (free tier available)

---

## STEP 1: Set Up MongoDB Atlas (Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Verify your email

### 1.2 Create a Cluster
1. After login, click **"Build a Database"**
2. Choose **"FREE" (M0) Shared** cluster
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click **"Create"** (takes 3-5 minutes)

### 1.3 Configure Database Access
1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username (e.g., `taskmanager`)
5. Enter a strong password (SAVE THIS PASSWORD!)
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Render.com)
4. Click **"Confirm"**

### 1.5 Get Your Connection String
1. Go to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
6. Replace `<password>` with your actual password
7. Add database name at the end: `...mongodb.net/task-manager?retryWrites=true&w=majority`
8. **SAVE THIS CONNECTION STRING** - You'll need it in Step 3

---

## STEP 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)
```bash
cd task-manager-api
git init
```

### 2.2 Create .gitignore (if not exists)
Create a `.gitignore` file with:
```
node_modules/
.env
.DS_Store
*.log
```

### 2.3 Commit and Push to GitHub
```bash
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details.

---

## STEP 3: Deploy to Render.com

### 3.1 Create Render Account
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended) or email

### 3.2 Create New Web Service
1. In Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository (`task-manager-api`)
5. Click **"Connect"**

### 3.3 Configure Service Settings
Fill in the following:

- **Name:** `task-manager-api` (or any name you prefer)
- **Region:** Choose closest to you
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (or `task-manager-api` if repo is in subfolder)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free` (or choose paid if needed)

### 3.4 Add Environment Variables
Click **"Advanced"** and add these environment variables:

1. **JWT_SECRET**
   - Click **"Add Environment Variable"**
   - Key: `JWT_SECRET`
   - Value: Generate a strong secret (e.g., use: `openssl rand -base64 32` or any random string)
   - Example: `my_super_secret_jwt_key_12345_xyz`

2. **MONGO_URI**
   - Click **"Add Environment Variable"**
   - Key: `MONGO_URI`
   - Value: Paste your MongoDB Atlas connection string from Step 1.5
   - Example: `mongodb+srv://taskmanager:password123@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority`

3. **PORT** (Optional - Render sets this automatically)
   - Key: `PORT`
   - Value: `5000`

4. **NODE_ENV** (Optional)
   - Key: `NODE_ENV`
   - Value: `production`

### 3.5 Deploy
1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying your app
3. Wait 5-10 minutes for first deployment
4. You'll see build logs in real-time

### 3.6 Get Your Live URL
1. Once deployment is complete, you'll see **"Your service is live"**
2. Your API URL will be: `https://task-manager-api.onrender.com` (or similar)
3. **Copy this URL** - This is your live API endpoint!

---

## STEP 4: Test Your Deployed API

### 4.1 Test Base Endpoint
Open your browser or use Postman/curl:
```
GET https://your-app-name.onrender.com
```
(You might get a 404, which is normal if there's no root route)

### 4.2 Test User Registration
```bash
POST https://your-app-name.onrender.com/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 4.3 Test User Login
```bash
POST https://your-app-name.onrender.com/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 4.4 Test Create Task (Protected Route)
```bash
POST https://your-app-name.onrender.com/tasks
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "title": "Test Task",
  "description": "This is a test task",
  "status": "pending",
  "priority": "medium"
}
```

### 4.5 Test Get Tasks
```bash
GET https://your-app-name.onrender.com/tasks
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## STEP 5: Using Postman for Testing

### 5.1 Import Collection
1. Open Postman
2. Create a new collection: "Task Manager API"
3. Add requests for each endpoint

### 5.2 Set Up Environment Variables
1. In Postman, click **"Environments"**
2. Create new environment: "Production"
3. Add variables:
   - `base_url`: `https://your-app-name.onrender.com`
   - `token`: (leave empty, will be set after login)

### 5.3 Test Flow
1. **Register User** → Save token from response
2. **Login** → Save token from response
3. **Create Task** → Use saved token in Authorization header
4. **Get Tasks** → Use saved token in Authorization header

---

## Troubleshooting

### Issue: Deployment fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify `start` script exists in `package.json`

### Issue: Database connection error
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string has correct password
- Ensure database name is in connection string

### Issue: JWT errors
- Verify `JWT_SECRET` environment variable is set
- Ensure it's a strong, random string

### Issue: API returns 404
- Check routes are correct (`/users`, `/tasks`)
- Verify server started successfully in logs

### Issue: Slow response (Free tier)
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid plan for always-on service

---

## Your Live API Endpoints

Once deployed, your API will be available at:

**Base URL:** `https://your-app-name.onrender.com`

**Available Endpoints:**
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `GET /tasks` - Get all tasks (requires auth)
- `POST /tasks` - Create task (requires auth)
- `GET /tasks/:id` - Get task by ID (requires auth)
- `PUT /tasks/:id` - Update task (requires auth)
- `DELETE /tasks/:id` - Delete task (requires auth)

**Authentication:** Add header `Authorization: Bearer YOUR_TOKEN`

---

## Quick Test Commands (Using curl)

```bash
# Register
curl -X POST https://your-app-name.onrender.com/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-app-name.onrender.com/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Task (replace TOKEN with actual token)
curl -X POST https://your-app-name.onrender.com/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My Task","description":"Task description","status":"pending","priority":"medium"}'
```

---

## Next Steps

1. ✅ Your API is now live!
2. Update your frontend to use the new API URL
3. Monitor logs in Render dashboard
4. Set up custom domain (optional, paid feature)
5. Enable auto-deploy on git push (enabled by default)

---

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Check Render logs: Dashboard → Your Service → Logs

