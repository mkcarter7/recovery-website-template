# Backend Service Fix Guide

Your backend service is showing "Application failed to respond". Here's how to fix it.

## Step 1: Check Backend Logs

**This is the most important step!**

1. Go to Railway dashboard
2. Click on your **Backend service** (not frontend)
3. Click on the **Logs** tab
4. Look for error messages at the bottom of the logs

**Common errors you might see:**
- `ModuleNotFoundError` - Missing dependency
- `OperationalError` - Database connection issue
- `AttributeError` - Code error
- `Port binding error` - Procfile/start command issue
- `SECRET_KEY` errors - Missing environment variable

## Step 2: Verify Backend Environment Variables

Go to Railway → Backend service → Variables tab

**Required variables:**
- `SECRET_KEY` - Django secret key (generate a new one if missing)
- `DATABASE_URL` - Should be automatically provided by Railway PostgreSQL
- `DEBUG` - Should be `False` in production (optional, defaults to False)

**Optional but recommended:**
- Firebase credentials if using Firebase
- AWS S3 credentials if using S3 for media storage

## Step 3: Common Fixes

### Fix 1: Missing SECRET_KEY

If you see `SECRET_KEY` errors in logs:

1. Generate a new secret key (you can use Django's method):
   ```python
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

2. Or use an online Django secret key generator

3. Add to Railway → Backend service → Variables:
   - Name: `SECRET_KEY`
   - Value: (the generated key)

### Fix 2: Database Connection Issues

If you see database connection errors:

1. Verify PostgreSQL service is running in Railway
2. Check that `DATABASE_URL` is set (Railway should set this automatically)
3. The backend will automatically use PostgreSQL if `DATABASE_URL` is present

### Fix 3: Missing Dependencies

If you see `ModuleNotFoundError`:

1. Check that all dependencies are in `backend/requirements.txt`
2. Railway should install them automatically during build
3. Check build logs for installation errors

### Fix 4: Port Binding Issues

The Procfile has been fixed, but if you still see port errors:

- Railway uses the `$PORT` environment variable automatically
- Make sure the Procfile says: `gunicorn recovery_center.wsgi:application --bind 0.0.0.0:$PORT`

## Step 4: Redeploy the Backend

After fixing issues:

1. **Option A: Trigger a new deployment**
   - Make a small change and push to GitHub (if connected)
   - Or use Railway's "Redeploy" button

2. **Option B: Manual redeploy**
   - Go to Backend service → Deployments tab
   - Click "Redeploy" on the latest deployment

## Step 5: Verify It's Working

Once deployed, test:

1. Visit: `https://backend-production-b0ade.up.railway.app/api/`
   - Should show Django REST Framework API root

2. Visit: `https://backend-production-b0ade.up.railway.app/api/settings/public/`
   - Should return JSON settings data

3. Check Logs tab again - should see successful startup messages

## Next Steps

Once the backend is running:
1. Test the frontend again
2. The "No response from server" error should be resolved
3. You can then proceed with custom domain setup

## Getting Help

If you're still having issues:
1. **Copy the exact error from the Logs tab**
2. The error message will tell us exactly what's wrong
3. Common issues are usually:
   - Missing environment variables
   - Database connection problems
   - Code errors (syntax/import errors)
