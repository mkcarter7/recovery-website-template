# Debugging 500 Error on Settings Update

The HTTP logs show PATCH requests to `/api/settings/1/` are returning 500 errors.

## To Find the Actual Error:

1. **Go to Railway → Backend service → Logs tab** (not HTTP Logs)
2. **Look for errors around 2:23 PM** (when those PATCH requests happened)
3. **Look for Python tracebacks** or error messages that show:
   - `Traceback (most recent call last):`
   - `Error:` or `Exception:`
   - S3/boto3 related errors
   - AttributeError, PermissionError, etc.

## Common Causes (After S3 Configuration Change):

### 1. Invalid AWS Credentials
**Error might look like:**
- `InvalidAccessKeyId`
- `SignatureDoesNotMatch`
- `Access Denied`

**Fix:** Verify your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct

### 2. Wrong Bucket Name
**Error might look like:**
- `NoSuchBucket`
- `404 Not Found`

**Fix:** Verify `AWS_STORAGE_BUCKET_NAME` matches your actual S3 bucket name exactly

### 3. Wrong Region
**Error might look like:**
- `WrongRegion` 
- `PermanentRedirect`

**Fix:** Verify `AWS_S3_REGION_NAME` matches your bucket's region (e.g., `us-east-1`)

### 4. S3 Permissions
**Error might look like:**
- `AccessDenied`
- `403 Forbidden`

**Fix:** Ensure your IAM user has permission to upload to the bucket

### 5. Missing Variable
**Error might look like:**
- `NoneType has no attribute`
- Variable name errors

**Fix:** Make sure all 5 S3 variables are set:
- `USE_S3=True`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_STORAGE_BUCKET_NAME`
- `AWS_S3_REGION_NAME`

## What to Check Right Now:

1. In Railway → Backend → **Variables** tab, verify:
   - `USE_S3` = `True` (exactly, no quotes)
   - `AWS_STORAGE_BUCKET_NAME` exists (not `AWS_STORAGE_BUCKET_MEDIA`)
   - All 5 variables are present

2. Check the **Logs** tab (not HTTP Logs) for the actual error message

3. Share the error message/traceback so we can fix it specifically
