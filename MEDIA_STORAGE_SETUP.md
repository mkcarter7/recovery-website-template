# Media Storage Setup - Fixing Background Image Persistence

## The Problem

When you upload a background image, it doesn't stay because:
- Railway containers use **ephemeral storage** (files are lost on restart/redeploy)
- Your backend is configured to use S3 but AWS credentials are missing
- So it falls back to local storage, which doesn't persist

## Solution: Set Up AWS S3 (Recommended)

AWS S3 provides persistent storage for your media files. Here's how to set it up:

### Step 1: Create AWS S3 Bucket

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **S3** service
3. Click **"Create bucket"**
4. Configure:
   - **Bucket name:** `2ndchancerecovery-media` (or your preferred name, must be globally unique)
   - **Region:** Choose a region (e.g., `us-east-1`)
   - **Block Public Access:** **UNCHECK** (media files need to be publicly accessible)
   - **Bucket Versioning:** Optional (can leave disabled)
   - Click **"Create bucket"**

### Step 2: Create IAM User for S3 Access

1. Go to **IAM** service in AWS Console
2. Click **"Users"** → **"Create user"**
3. **User name:** `railway-s3-media-user` (or your preferred name)
4. **Access type:** Select **"Programmatic access"**
5. Click **"Next: Permissions"**
6. Click **"Attach existing policies directly"**
7. Search and select: **"AmazonS3FullAccess"** (or create a custom policy with only necessary permissions)
8. Click **"Next"** → **"Next"** → **"Create user"**
9. **IMPORTANT:** Copy these two values:
   - **Access Key ID**
   - **Secret Access Key** (you can only see this once!)

### Step 3: Configure Bucket CORS (Optional but Recommended)

1. Go to your S3 bucket → **Permissions** tab
2. Scroll to **"Cross-origin resource sharing (CORS)"**
3. Click **"Edit"** and add:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```
4. Click **"Save changes"**

### Step 4: Set Environment Variables in Railway

Go to Railway → **Backend service** → **Variables** tab

Add these variables:

1. **USE_S3** = `True`

2. **AWS_ACCESS_KEY_ID** = (the Access Key ID from Step 2)

3. **AWS_SECRET_ACCESS_KEY** = (the Secret Access Key from Step 2)

4. **AWS_STORAGE_BUCKET_NAME** = `2ndchancerecovery-media` (your bucket name)

5. **AWS_S3_REGION_NAME** = `us-east-1` (or your bucket's region)

6. **AWS_S3_CUSTOM_DOMAIN** = (optional, leave blank unless using CloudFront)

### Step 5: Redeploy Backend

After adding the environment variables:

1. Go to Backend service → **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger deployment

### Step 6: Verify It's Working

1. Check backend logs - the S3 warning should be gone
2. Upload a background image in the admin panel
3. The image should persist after redeployments

## Alternative: Disable S3 (Not Recommended)

If you don't want to set up S3 right now (files still won't persist):

1. Go to Railway → Backend service → Variables
2. Set **USE_S3** = `False`
3. Redeploy backend

**Note:** With `USE_S3=False`, uploaded files will be lost when the container restarts or redeploys. This is fine for development but not recommended for production.

## Testing S3 Setup

After setting up S3:

1. Upload a background image in the admin panel
2. Check the image URL - it should point to your S3 bucket:
   - Format: `https://2ndchancerecovery-media.s3.us-east-1.amazonaws.com/backgrounds/filename.jpg`
3. Visit the image URL directly - it should display the image
4. Redeploy the backend - the image should still be accessible

## Troubleshooting

### S3 Warning Still Appears
- Check that all 5 environment variables are set correctly
- Verify bucket name and region match
- Redeploy after adding variables

### Images Upload But Don't Display
- Check S3 bucket permissions (should allow public read)
- Verify CORS configuration
- Check image URL format in browser console

### Access Denied Errors
- Verify IAM user has S3 permissions
- Check bucket policy allows public read access
- Verify Access Key ID and Secret Access Key are correct

## Cost Estimate

AWS S3 is very affordable:
- **Storage:** ~$0.023 per GB/month
- **Requests:** ~$0.005 per 1,000 requests
- **For typical use:** Usually less than $1/month

First 12 months include Free Tier (5 GB storage, 20,000 GET requests).
