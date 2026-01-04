# Troubleshooting: "No response from server" Error

If you're seeing the error "Error updating settings: No response from server. Is the backend running?", this means the frontend cannot connect to the backend API.

## Quick Checks

### 1. Check Backend Service Status in Railway

1. Go to your Railway dashboard
2. Click on your **backend service**
3. Check the **Logs** tab to see if there are any errors
4. Verify the service shows as **"Active"** or **"Running"**

### 2. Verify Environment Variables

#### Frontend Service Environment Variables:
- `REACT_APP_API_URL` should be set to your backend URL
  - Format: `https://your-backend-service.up.railway.app/api`
  - **Important:** Must include `/api` at the end
  - **Important:** Must be a full URL (starting with `https://`)

#### Backend Service Environment Variables:
- Check that all required variables are set:
  - `SECRET_KEY`
  - `DEBUG` (should be `False` in production)
  - `DATABASE_URL` (provided automatically by Railway PostgreSQL)
  - `CORS_ALLOWED_ORIGINS` (optional, should include your frontend URL)
  - Any Firebase/AWS credentials if used

### 3. Verify Backend is Accessible

1. Open your browser
2. Visit your backend URL directly: `https://your-backend-service.up.railway.app/api/`
3. You should see a Django REST Framework API root page (or JSON response)
4. If you get a connection error, the backend service is down

### 4. Check Railway Logs

#### Backend Logs:
1. Go to Railway dashboard → Backend service → **Logs** tab
2. Look for errors like:
   - Database connection errors
   - Import errors
   - Port binding errors
   - Environment variable errors

#### Frontend Logs:
1. Go to Railway dashboard → Frontend service → **Logs** tab
2. Look for build errors or runtime errors
3. Check if `REACT_APP_API_URL` is being used correctly

### 5. Common Issues and Solutions

#### Issue: Backend Service Crashed
**Symptoms:** Backend logs show errors, service is not running

**Solution:**
1. Check backend logs for specific errors
2. Common causes:
   - Missing environment variables
   - Database connection issues
   - Syntax errors in code
   - Missing dependencies

#### Issue: Wrong API URL
**Symptoms:** Frontend works but can't connect to backend

**Solution:**
1. Get your backend service URL from Railway:
   - Backend service → Settings → Networking
   - Copy the Railway-provided domain (e.g., `backend-production-xxxx.up.railway.app`)
2. Set `REACT_APP_API_URL` in frontend service to: `https://backend-production-xxxx.up.railway.app/api`
3. **Important:** Must include `/api` at the end
4. Redeploy the frontend service after changing environment variables

#### Issue: CORS Errors
**Symptoms:** Browser console shows CORS errors, requests blocked

**Solution:**
1. Add your frontend URL to backend `CORS_ALLOWED_ORIGINS`:
   - Format: `https://your-frontend-service.up.railway.app`
   - Can add multiple origins separated by commas
2. Verify `ALLOWED_HOSTS` in Django settings includes your backend domain

#### Issue: Backend Not Starting
**Symptoms:** Backend service won't start, shows errors in logs

**Solution:**
1. Check Procfile is correct:
   ```
   web: gunicorn recovery_center.wsgi:application --bind 0.0.0.0:$PORT
   ```
2. Verify all dependencies are in `requirements.txt`
3. Check database migrations are applied
4. Verify `SECRET_KEY` is set

#### Issue: Environment Variables Not Updated
**Symptoms:** Changes to environment variables not taking effect

**Solution:**
1. Environment variables require a **redeployment** to take effect
2. After updating environment variables, trigger a new deployment:
   - Click "Redeploy" button, or
   - Push a new commit to trigger automatic deployment

### 6. Step-by-Step Debugging

1. **Verify Backend is Running:**
   ```bash
   # Visit in browser:
   https://your-backend.up.railway.app/api/
   # Should show API root or JSON response
   ```

2. **Check API Endpoint Directly:**
   ```bash
   # Test a public endpoint:
   https://your-backend.up.railway.app/api/settings/public/
   # Should return JSON settings data
   ```

3. **Verify Frontend API URL:**
   - Open browser developer console (F12)
   - Check Network tab when making a request
   - Verify the request is going to the correct URL
   - Check for CORS or network errors

4. **Test Backend from Command Line:**
   ```bash
   # Using curl (if you have it):
   curl https://your-backend.up.railway.app/api/settings/public/
   # Should return JSON
   ```

### 7. Railway-Specific Issues

#### Service Restart:
- Sometimes services need to be restarted
- Go to Railway dashboard → Service → Settings → **"Restart"** button

#### Database Connection:
- Railway PostgreSQL is provided automatically via `DATABASE_URL`
- If database errors occur, check:
  - Database service is running
  - `DATABASE_URL` is set correctly
  - Migrations are applied: `python manage.py migrate`

#### Build Failures:
- Check build logs for errors
- Common issues:
  - Missing dependencies in `requirements.txt`
  - Build script errors
  - Environment variable issues

### 8. Getting Help

If you're still having issues:

1. **Check Railway Status:** https://status.railway.app/
2. **Review Logs:** Both frontend and backend service logs
3. **Verify URLs:** Make sure all URLs are correct and accessible
4. **Test Locally:** Try running locally to isolate Railway-specific issues

### 9. Quick Fix Checklist

- [ ] Backend service is running in Railway
- [ ] Backend URL is accessible in browser
- [ ] `REACT_APP_API_URL` is set correctly in frontend environment variables
- [ ] `REACT_APP_API_URL` includes `/api` at the end
- [ ] `REACT_APP_API_URL` is a full URL (starts with `https://`)
- [ ] Frontend service has been redeployed after changing environment variables
- [ ] Backend `ALLOWED_HOSTS` includes the backend domain
- [ ] Backend `CORS_ALLOWED_ORIGINS` includes the frontend domain
- [ ] No errors in Railway logs
- [ ] Database is connected and migrations are applied
