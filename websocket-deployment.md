# WebSocket Server Deployment Guide

## Option 1: Railway (Recommended - Free Tier)

### 1. Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# In your project directory, create a new Railway project
railway new

# Copy websocket files to separate directory
mkdir websocket-server
cp websocket-server.js websocket-server/
cp package-websocket.json websocket-server/package.json

cd websocket-server

# Deploy
railway up
```

### 2. Set Environment Variables in Railway Dashboard
- `FRONTEND_URL`: Your Vercel domain (e.g., `https://your-app.vercel.app`)
- `PORT`: 3001 (Railway will override this)

### 3. Get your WebSocket URL
- Railway will provide a URL like: `https://your-app.railway.app`
- Use this for `NEXT_PUBLIC_SOCKET_URL`

## Option 2: Heroku

### 1. Create Heroku App
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-websocket-app

# Deploy
git add .
git commit -m "Add websocket server"
git push heroku main
```

### 2. Set Environment Variables
```bash
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Option 3: Same Server as RTMP

If using the same server for RTMP and WebSocket:

### 1. Copy files to server
```bash
scp websocket-server.js root@your-server-ip:/opt/
scp package-websocket.json root@your-server-ip:/opt/package.json
```

### 2. Install and run on server
```bash
ssh root@your-server-ip
cd /opt
npm install
npm start
```

### 3. Use PM2 for process management
```bash
npm install -g pm2
pm2 start websocket-server.js --name "websocket"
pm2 startup
pm2 save
```

## Update Your Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

```env
NEXT_PUBLIC_STREAM_URL=http://your-server-ip:8080/hls/test.m3u8
NEXT_PUBLIC_SOCKET_URL=wss://your-websocket-domain.com
```

## Testing

1. Start your WebSocket server
2. Deploy your Next.js app to Vercel with the new environment variables
3. Open your site and test commenting
4. Comments should appear in real-time across multiple browser tabs