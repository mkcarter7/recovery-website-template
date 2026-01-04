# Fixing S3 Image Upload 500 Error

Since regular settings updates work but image uploads fail, this is specifically an S3 upload permissions issue.

## Most Likely Issue: Bucket Block Public Access

Your bucket might have "Block all public access" enabled, which prevents files from being uploaded with `public-read` ACL even if your IAM policy allows it.

### Fix 1: Check Bucket Public Access Settings

1. Go to AWS S3 Console → `2nd-chance-media` bucket
2. Click **Permissions** tab
3. Scroll to **Block public access (bucket settings)**
4. Click **Edit**
5. **Uncheck** "Block all public access" (or at least uncheck the ones that prevent public reads)
6. Click **Save changes**
7. Type `confirm` to confirm

**Important:** You need to allow public **reads** for media files to be accessible via URL. The upload permission is controlled by IAM, but the bucket needs to allow public access for the files to be viewable.

### Fix 2: Update Bucket Policy (Alternative)

If you can't disable "Block public access", you can use a bucket policy instead:

1. Go to your bucket → **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit** and add:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::2nd-chance-media/*"
        }
    ]
}
```

4. Click **Save changes**

### Fix 3: Update Django Settings (If ACL Still Fails)

If you're still having issues, we might need to change the ACL setting. Newer AWS accounts sometimes need `None` instead of `public-read`.

**Note:** This would require a code change, so try Fix 1 or 2 first.

## Verify Your Configuration

Make sure in Railway → Backend → Variables:

✅ `USE_S3` = `True`  
✅ `AWS_ACCESS_KEY_ID` = (correct)  
✅ `AWS_SECRET_ACCESS_KEY` = (correct)  
✅ `AWS_STORAGE_BUCKET_NAME` = `2nd-chance-media`  
✅ `AWS_S3_REGION_NAME` = `us-east-2`  

## After Making Changes

1. Make the bucket permission changes (Fix 1 or 2 above)
2. Try uploading an image again in the admin panel
3. If it still fails, check Railway backend logs for the specific error

## Testing

After fixing bucket permissions:
1. Upload a background image in admin panel
2. It should save successfully
3. The image URL should be accessible (e.g., `https://2nd-chance-media.s3.us-east-2.amazonaws.com/backgrounds/filename.jpg`)
4. The image should persist after backend redeployments
