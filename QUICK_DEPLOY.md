# Quick Deployment Checklist

## Environment Variables Needed

Add these in Render.com dashboard → Your Service → Environment:

1. **JWT_SECRET** = `your_random_secret_key_here` (generate a strong random string)
2. **MONGO_URI** = `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority`
3. **PORT** = `5000` (optional, Render sets this automatically)
4. **NODE_ENV** = `production` (optional)

## Quick Steps Summary

1. **MongoDB Atlas Setup** (5 minutes)
   - Sign up at mongodb.com/cloud/atlas
   - Create free cluster
   - Create database user
   - Whitelist IP (0.0.0.0/0)
   - Get connection string

2. **GitHub Setup** (2 minutes)
   - Push code to GitHub repository

3. **Render Deployment** (10 minutes)
   - Sign up at render.com
   - New Web Service → Connect GitHub repo
   - Add environment variables
   - Deploy

4. **Test** (2 minutes)
   - Use Postman or curl to test endpoints

## Your API URL Format

After deployment: `https://your-service-name.onrender.com`

## Test Commands

```bash
# Register
curl -X POST https://your-service.onrender.com/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login  
curl -X POST https://your-service.onrender.com/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Create Task (replace TOKEN)
curl -X POST https://your-service.onrender.com/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Task 1","description":"Description","status":"pending","priority":"medium"}'
```

