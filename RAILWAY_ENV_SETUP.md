# Railway Environment Variables Setup

## Frontend Service Environment Variables

The frontend React app requires Firebase configuration environment variables to be set in Railway. These variables **must** be set in the Railway dashboard for the **frontend service** before building.

### Required Environment Variables

Set these in Railway for your **frontend service**:

1. `REACT_APP_FIREBASE_API_KEY` - Your Firebase API key
2. `REACT_APP_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain (e.g., `your-project.firebaseapp.com`)
3. `REACT_APP_FIREBASE_PROJECT_ID` - Your Firebase project ID
4. `REACT_APP_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket (e.g., `your-project.appspot.com`)
5. `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
6. `REACT_APP_FIREBASE_APP_ID` - Your Firebase app ID

### Required Environment Variables (continued)

7. `REACT_APP_API_URL` - **REQUIRED** Backend API URL (e.g., `https://your-backend-service.up.railway.app/api`)

**Important:** You must set `REACT_APP_API_URL` to your backend Railway service URL. Without this, API requests will fail with 405 errors.

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Select your **frontend service**
3. Go to the **Variables** tab
4. Click **+ New Variable**
5. Add each of the required variables listed above
6. After adding all variables, trigger a new deployment

**Important:** These variables must be set **before** the build runs, as React embeds them into the build output at build time.

## Backend Service Environment Variables

Set these in Railway for your **backend service**:

1. `SECRET_KEY` - Django secret key
2. `DEBUG` - Set to `False` for production
3. `DATABASE_URL` - PostgreSQL connection string (Railway usually sets this automatically)
4. `FIREBASE_CREDENTIALS_PATH` - Path to Firebase credentials JSON file (if using file-based credentials)
5. `FRONTEND_URL` - Frontend URL for CORS (e.g., `https://your-frontend.railway.app`)
6. `CUSTOM_DOMAIN` - (Optional) Custom domain if you have one
7. `RAILWAY_PUBLIC_DOMAIN` - (Optional) Railway public domain

## Getting Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon `</>`
7. Copy the configuration values from the `firebaseConfig` object

Example Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

This means the Firebase environment variables are not set or are incorrect in Railway.

**Solution:**
1. Verify all Firebase environment variables are set in Railway for the frontend service
2. Make sure variable names start with `REACT_APP_`
3. Trigger a new deployment after setting the variables
4. Check the build logs to ensure variables are being read correctly

### Error: "The requested action is invalid"

This error occurs when your Railway domain is not authorized in Firebase Console.

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Authorized domains" section
6. Click "Add domain"
7. Add your Railway domain: `frontend-production-f2a5.up.railway.app` (or whatever your Railway domain is)
8. Also add `*.railway.app` to authorize all Railway subdomains
9. Click "Add"
10. Try logging in again

**Important:** If you have a custom domain, make sure to add that as well.

### Error: 405 Method Not Allowed when updating settings

This error occurs when `REACT_APP_API_URL` is not set, causing API requests to go to the wrong URL.

**Solution:**
1. Go to your Railway project dashboard
2. Select your **frontend service**
3. Go to the **Variables** tab
4. Add `REACT_APP_API_URL` with your backend service URL:
   - Format: `https://your-backend-service.up.railway.app/api`
   - Example: `https://backend-production-abc123.up.railway.app/api`
5. To find your backend URL:
   - Go to your backend service in Railway
   - Copy the public domain URL
   - Add `/api` to the end
6. Trigger a new deployment after adding the variable

### Variables Not Working After Setting Them

React environment variables are embedded at **build time**, not runtime. You must:
1. Set the variables in Railway
2. Trigger a new deployment (the build will pick them up)
3. The variables will be embedded in the built JavaScript files
