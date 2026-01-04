# Setting Up S3 on Railway (Quick Guide)

Since you already have an AWS S3 bucket set up, you just need to add the credentials to Railway.

## Step 1: Get Your AWS Credentials

You need:
1. **AWS Access Key ID**
2. **AWS Secret Access Key**
3. **S3 Bucket Name**
4. **S3 Region** (e.g., `us-east-1`, `us-west-2`)

### If You Don't Have Access Keys:

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Go to **IAM** service
3. Click **Users** → Find your user (or create a new one)
4. Click on the user → **Security credentials** tab
5. Click **"Create access key"**
6. Select **"Application running outside AWS"**
7. **IMPORTANT:** Copy both values (you can only see the secret key once!)
   - **Access Key ID**
   - **Secret Access Key**

## Step 2: Add Environment Variables in Railway

Go to Railway → **Backend service** → **Variables** tab

Add/Update these variables:

1. **USE_S3** = `True`

2. **AWS_ACCESS_KEY_ID** = (your AWS Access Key ID)

3. **AWS_SECRET_ACCESS_KEY** = (your AWS Secret Access Key)

4. **AWS_STORAGE_BUCKET_NAME** = (your S3 bucket name, e.g., `2ndchancerecovery-media`)

5. **AWS_S3_REGION_NAME** = (your bucket's region, e.g., `us-east-1`)

6. **AWS_S3_CUSTOM_DOMAIN** = (optional - leave blank unless using CloudFront)

## Step 3: Verify Bucket Settings

Make sure your S3 bucket:

1. **Allows public access** (for media files to be accessible):
   - Go to your bucket → **Permissions** tab
   - Under **"Block public access"**, make sure it's disabled or configured to allow public reads

2. **Bucket Policy** (if needed, add this):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```
Replace `YOUR-BUCKET-NAME` with your actual bucket name.

## Step 4: Redeploy Backend

After adding the environment variables:

1. Go to Railway → Backend service → **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger deployment

## Step 5: Verify It's Working

1. **Check backend logs** - The S3 warning should be gone:
   - Should NOT see: "USE_S3 is True but AWS credentials are missing"
   - Should NOT see any S3-related errors

2. **Upload a background image** in the admin panel

3. **Check the image URL** - Should point to your S3 bucket:
   - Format: `https://YOUR-BUCKET-NAME.s3.REGION.amazonaws.com/backgrounds/filename.jpg`

4. **Test persistence**:
   - Upload an image
   - Redeploy the backend
   - Image should still be accessible

## Troubleshooting

### Still Seeing S3 Warning
- Double-check all 5 environment variables are set correctly
- Make sure there are no typos
- Verify `USE_S3` is set to exactly `True` (not `"True"` or `true`)

### "Access Denied" Errors
- Verify IAM user has S3 permissions (e.g., `AmazonS3FullAccess` policy)
- Check Access Key ID and Secret Access Key are correct
- Verify bucket name matches exactly

### Images Upload But Don't Display
- Check bucket permissions allow public read access
- Verify CORS configuration (see MEDIA_STORAGE_SETUP.md for CORS setup)
- Check the image URL format in browser console

### Can't Find Access Keys
- If you lost them, you'll need to create new ones in IAM
- Go to IAM → Users → Your user → Security credentials → Create access key

