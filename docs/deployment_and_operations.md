# SweetShop Deployment & Operations Guide

This guide provides configurations and runbooks to run, scale, and maintain the SweetShop E-commerce Platform.

---

## 1. Environment Variables Guide

### Backend (`apps/api/.env`)
Create an `.env` file in `apps/api/` with the following variables:

```ini
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sweetshop

# Caching (Redis)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_signing_secret_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Third-party credentials
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_SECRET=secret_...
RAZORPAY_WEBHOOK_SECRET=webhook_secret_...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Mail server (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM_NAME=SweetShop Support
SMTP_FROM_EMAIL=no-reply@sweetshop.com
```

---

## 2. Docker & Nginx Deployment

### Quickstart (Docker Compose)
To compile and launch the entire stack (Database, Cache, API, and Next.js client) locally:

```bash
# Build and start services
docker-compose up --build -d
```

### Production Nginx Reverse Proxy
Copy the nginx configuration block located in `docker/nginx/nginx.conf` into your production Nginx hosts registry:

```bash
cp docker/nginx/nginx.conf /etc/nginx/nginx.conf
systemctl restart nginx
```

---

## 3. Database Operations (Backup & Restore)

We provided helper shell scripts in the `scripts/` directory.

### Create Backup
```bash
./scripts/backup.sh "mongodb://localhost:27017/sweetshop" "./backups"
```

### Restore Backup
```bash
./scripts/restore.sh "./backups/backup_xxxx" "mongodb://localhost:27017/sweetshop"
```

---

## 4. Production Hosting Options

### Frontend (Next.js) - Vercel
1. Set the root workspace folder to `/home/prakash/sweetshop/apps/web`.
2. Connect your Git repository.
3. Configure the environment variable:
   - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
4. Deploy.

### Backend (Node API) - Render / Railway
1. Set the root workspace folder to `/home/prakash/sweetshop/apps/api`.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set up environment variables matching `.env`.
