# Setting Up api.radorderpad.com on Vercel with Cloudflare DNS

This guide will walk you through the process of setting up your Vercel deployment to use the custom domain `api.radorderpad.com` with Cloudflare as your DNS provider.

## Step 1: Add the Custom Domain in Vercel

1. Log in to your Vercel account
2. Select your project (radorderpad-api)
3. Go to "Settings" > "Domains"
4. Enter `api.radorderpad.com` in the "Domain" field and click "Add"
5. Vercel will provide you with DNS configuration instructions

## Step 2: Configure Cloudflare DNS Records

Based on the screenshot you provided, you already have access to the Cloudflare DNS settings for radorderpad.com. You'll need to add the following DNS records:

### Option 1: CNAME Record (Recommended)

Add a CNAME record that points `api.radorderpad.com` to your Vercel deployment:

| Type | Name | Content | Proxy status |
|------|------|---------|-------------|
| CNAME | api | cname.vercel-dns.com. | DNS only (gray cloud) |

> **Important**: Set the proxy status to "DNS only" (gray cloud) rather than "Proxied" (orange cloud) to ensure SSL works correctly.

### Option 2: A Records

Alternatively, you can add A records pointing to Vercel's IP addresses:

| Type | Name | Content | Proxy status |
|------|------|---------|-------------|
| A | api | 76.76.21.21 | DNS only (gray cloud) |

## Step 3: Verify Domain Ownership

1. After adding the DNS records, go back to your Vercel project
2. Vercel will automatically verify the domain once the DNS changes propagate
3. This may take up to 48 hours, but typically happens within minutes to a few hours

## Step 4: Update Environment Variables

Once your custom domain is set up, you can update your environment variables to use the new domain:

1. In your Vercel project, go to "Settings" > "Environment Variables"
2. Update any variables that reference the old URL to use `https://api.radorderpad.com`
3. Redeploy your application if necessary

## Step 5: Test the Custom Domain

After the DNS changes have propagated:

1. Visit `https://api.radorderpad.com` to ensure it loads your application
2. Test API endpoints to verify they're working correctly

## Troubleshooting

If you encounter issues:

1. **DNS Propagation**: DNS changes can take time to propagate. Use a tool like [dnschecker.org](https://dnschecker.org) to check if your DNS records are visible globally.

2. **SSL Certificate Issues**: If you see SSL warnings, ensure that:
   - The CNAME record is set to "DNS only" in Cloudflare (gray cloud, not orange)
   - You've waited for Vercel to provision the SSL certificate (can take up to 24 hours)

3. **Vercel Domain Verification**: If Vercel can't verify your domain:
   - Double-check that your DNS records match exactly what Vercel recommends
   - Try the alternative verification method if provided by Vercel

4. **Cloudflare SSL Settings**: In Cloudflare, go to SSL/TLS settings and set the encryption mode to "Full" or "Full (strict)" for best results.

## Additional Resources

- [Vercel Custom Domain Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Vercel-Cloudflare Integration Guide](https://vercel.com/guides/using-cloudflare-with-vercel)