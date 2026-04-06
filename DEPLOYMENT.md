# 🚀 Orion Soft Systems - Deployment Guide

## Architecture Overview

```
Frontend (Static HTML/CSS/JS)
        ↓ HTTP/API
Backend (Node.js + Express)
        ↓
MongoDB (Database)
        ↓
OpenAI API → DeepSeek API (fallback)
        ↓
Paystack / Stripe (Billing)
```

---

## 📋 Prerequisites

1. **Node.js** >= 18.0.0
2. **MongoDB** (local or Atlas)
3. **OpenAI API key** (https://platform.openai.com)
4. **Paystack account** (https://paystack.com) or **Stripe account** (https://stripe.com)

---

## 🔧 Local Development Setup

### 1. Backend

```bash
cd server
npm install

# Copy env file and configure
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

The API will run on `http://localhost:5000`

### 2. Frontend

Simply open `index.html` in a browser, or serve it:

```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve .

# Using VS Code - Live Server extension
```

### 3. Connect Frontend to Backend

In the browser console, set the API URL:
```javascript
localStorage.setItem("apiUrl", "http://localhost:5000/api");
```

Or edit the `API_URL` variable in each HTML file's inline script.

---

## 🌐 Production Deployment

### Option 1: Railway (Easiest)

1. Push code to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Add environment variables in Railway dashboard
4. Railway auto-deploys on push

### Option 2: Render

1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repo
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables

### Option 3: VPS (DigitalOcean, AWS, etc.)

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone your-repo
cd Orion/server
npm install --production

# Setup .env
nano .env

# Start with PM2
pm2 start app.js --name orion-api
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/orion

# Nginx config:
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/orion /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing key (32+ chars) | `random-string-here` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | OpenAI model | `gpt-4o-mini` |
| `DEEPSEEK_API_KEY` | DeepSeek API key | `sk-...` |
| `DEEPSEEK_MODEL` | DeepSeek model | `deepseek-chat` |
| `PAYSTACK_SECRET_KEY` | Paystack secret | `sk_live_...` |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Stripe secret | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `FRONTEND_URL` | Frontend origin (CORS) | `https://yourdomain.com` |

---

## 💳 Payment Setup

### Paystack

1. Create account at [paystack.com](https://paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy Secret Key → `PAYSTACK_SECRET_KEY`
4. Copy Public Key → `PAYSTACK_PUBLIC_KEY`
5. Set webhook URL: `https://api.yourdomain.com/api/billing/webhook/paystack`

### Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Create products for each plan (starter, professional, enterprise)
3. Copy price IDs → update `billingService.js` `priceIds` object
4. Copy Secret Key → `STRIPE_SECRET_KEY`
5. Set webhook endpoint in Stripe dashboard
6. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a random 32+ character string
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for your frontend domain
- [ ] Keep API keys secret (never commit `.env`)
- [ ] Set up MongoDB with authentication
- [ ] Enable rate limiting (already configured)
- [ ] Set up regular backups of MongoDB

---

## 📊 Monitoring

Recommended tools:
- **PM2** for process management
- **MongoDB Atlas** for managed database with monitoring
- **Sentry** for error tracking
- **UptimeRobot** for uptime monitoring

---

## 🧪 Testing the Full Flow

1. Start backend: `cd server && npm run dev`
2. Open frontend in browser
3. Register a new account at `/register.html`
4. You'll be redirected to `/dashboard.html`
5. Check your 14-day trial is active
6. Try the AI assistant chat widget
7. Go to `/pricing.html` and click "Subscribe"
8. After payment, check dashboard shows updated plan

---

## 🐛 Troubleshooting

**"MongoDB connection error"**
- Check `MONGODB_URI` is correct
- Ensure MongoDB is running (`mongod`)
- Check firewall allows connection

**"Token expired" errors**
- Tokens expire after 30 days
- User needs to re-login

**"CORS error"**
- Check `FRONTEND_URL` in `.env` matches your frontend
- Ensure backend is running

**Chat not working**
- Check OpenAI API key is valid
- Check server logs: `pm2 logs orion-api`
- Verify API URL in frontend localStorage

---

## 📞 Support

For issues, contact:
- Email: hello@orionsoftsystems.com
- WhatsApp: +234 813 915 1102
