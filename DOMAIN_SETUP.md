# Setting Up Custom Domain (2ndchancerecovery.life) on Railway

This guide will help you connect your GoDaddy domain `www.2ndchancerecovery.life` to your Railway-deployed website.

## Step 1: Add Custom Domain in Railway

### For Frontend Service:
1. Go to your Railway dashboard
2. Click on your **frontend service**
3. Go to the **Settings** tab
4. Scroll down to **Networking** section
5. Click **"Generate Domain"** or **"Add Custom Domain"**
6. Enter: `www.2ndchancerecovery.life`
7. Railway will provide you with DNS records (CNAME or A record)

### For Backend Service:
1. Click on your **backend service**
2. Go to the **Settings** tab
3. Scroll down to **Networking** section
4. Click **"Generate Domain"** or **"Add Custom Domain"**
5. Enter: `api.2ndchancerecovery.life` (optional, or use subdomain)
6. Note the DNS records provided

**Important:** Railway will provide you with either:
- A **CNAME record** pointing to a Railway domain (e.g., `xxxx.up.railway.app`)
- Or an **A record** with an IP address

## Step 2: Configure DNS in GoDaddy

1. Log in to your **GoDaddy account**
2. Go to **My Products** → **Domains**
3. Click on **2ndchancerecovery.life**
4. Click **"DNS"** or **"Manage DNS"**

### Add/Update DNS Records:

#### For www.2ndchancerecovery.life (Frontend):
- **Type:** CNAME (if Railway provides CNAME) or A (if Railway provides IP)
- **Name:** `www`
- **Value:** The value Railway provided (either a domain like `xxxx.up.railway.app` or an IP address)
- **TTL:** 600 (or default)

#### For 2ndchancerecovery.life (Root domain - optional):
- **Type:** CNAME or A
- **Name:** `@` (or leave blank, depending on GoDaddy's interface)
- **Value:** Same as www record, or point to `www.2ndchancerecovery.life`
- **TTL:** 600

#### For api.2ndchancerecovery.life (Backend - if you set it up):
- **Type:** CNAME or A
- **Name:** `api`
- **Value:** The backend Railway domain/IP
- **TTL:** 600

### Example DNS Records:
```
Type    Name    Value                          TTL
CNAME   www     xxxx-production.up.railway.app  600
CNAME   @       www.2ndchancerecovery.life      600
```

## Step 3: Update Railway Environment Variables

### Frontend Service:
Add/update these environment variables:
- `REACT_APP_API_URL` = `https://backend-production-b0ade.up.railway.app/api` (or your backend custom domain if set)

### Backend Service:
Add/update these environment variables:
- `CUSTOM_DOMAIN` = `www.2ndchancerecovery.life` (optional, but recommended)

## Step 4: Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate. Typically:
- **CNAME records:** 15 minutes to 1 hour
- **A records:** 1-4 hours

You can check DNS propagation using:
- https://www.whatsmydns.net/
- https://dnschecker.org/

## Step 5: Verify SSL Certificate

Railway automatically provisions SSL certificates via Let's Encrypt. Once DNS is propagated:
1. Railway will detect the domain
2. SSL certificate will be automatically generated (usually within 5-10 minutes)
3. Your site will be accessible at `https://www.2ndchancerecovery.life`

## Step 6: Test Your Domain

1. Visit `https://www.2ndchancerecovery.life` in your browser
2. Check that the site loads correctly
3. Test API calls from the frontend
4. Verify all pages work (Home, About, Programs, Contact, Sponsor, Housing Application)

## Troubleshooting

### Domain not resolving:
- Wait longer for DNS propagation (can take up to 48 hours)
- Verify DNS records are correct in GoDaddy
- Check Railway logs for any errors

### SSL certificate issues:
- Ensure DNS is fully propagated before Railway can issue SSL
- Check Railway service logs for SSL certificate errors
- Railway usually auto-generates SSL, but you can check in the Networking section

### CORS errors:
- Verify `CORS_ALLOWED_ORIGINS` includes your custom domain
- Check that `CSRF_TRUSTED_ORIGINS` includes your domain
- Ensure `ALLOWED_HOSTS` includes your domain

### API not working:
- Verify `REACT_APP_API_URL` in frontend environment variables
- Check that backend `ALLOWED_HOSTS` includes the domain
- Ensure CORS settings allow the frontend domain

## Important Notes

1. **Don't delete the old GoDaddy website yet** - Wait until the new site is fully working
2. **Keep both sites running** during the transition period
3. **Test thoroughly** before pointing all traffic to the new site
4. **Railway provides free SSL** - No need to purchase SSL certificates
5. **Both www and non-www** versions are configured in Django settings

## After Setup

Once everything is working:
1. The old GoDaddy website builder site can be disabled/deleted
2. All traffic to `www.2ndchancerecovery.life` will go to your Railway-deployed site
3. Monitor Railway logs and metrics to ensure everything is running smoothly

