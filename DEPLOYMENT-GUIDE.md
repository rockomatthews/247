# Complete Deployment Guide

## Quick Start Summary

Your streaming site needs 3 components:

1. **Frontend** (Vercel) ✅ - Already deployed
2. **RTMP Server** (DigitalOcean/VPS) - Converts OBS stream to HLS
3. **WebSocket Server** (Railway/Heroku) - Handles live comments

## Step 1: Fix Vercel Deployment

The ESLint error is now fixed. Redeploy to Vercel and it should work.

## Step 2: Set Up RTMP Server (Choose One)

### Option A: DigitalOcean Droplet ($5/month)
1. Create Ubuntu 22.04 droplet
2. Follow `nginx-rtmp-setup.md` guide
3. Your stream URL will be: `http://your-droplet-ip:8080/hls/test.m3u8`

### Option B: Docker (Local/VPS)
1. Use the Docker setup in `nginx-rtmp-setup.md`
2. Run `docker-compose up -d`

## Step 3: Deploy WebSocket Server

### Option A: Railway (Free Tier)
1. Copy `websocket-server.js` and `package-websocket.json` to new folder
2. Deploy to Railway
3. Set environment variable: `FRONTEND_URL=https://your-vercel-app.vercel.app`
4. Get Railway URL for WebSocket connection

### Option B: Same VPS as RTMP
1. Copy files to server
2. Install with `npm install`
3. Run with PM2: `pm2 start websocket-server.js`

## Step 4: Update Environment Variables

In Vercel dashboard, set these environment variables:

```
NEXT_PUBLIC_STREAM_URL=http://your-server-ip:8080/hls/test.m3u8
NEXT_PUBLIC_SOCKET_URL=wss://your-websocket-url.com
```

## Step 5: Configure OBS

1. OBS Studio → Settings → Stream
2. Service: Custom...
3. Server: `rtmp://your-server-ip:1935/live`
4. Stream Key: `test`

## URLs You'll Get

- **Frontend**: `https://your-app.vercel.app`
- **RTMP Input**: `rtmp://your-server-ip:1935/live/test`
- **HLS Output**: `http://your-server-ip:8080/hls/test.m3u8`
- **WebSocket**: `wss://your-websocket-app.railway.app`

## Cost Breakdown

- **Vercel**: Free (hobby plan)
- **DigitalOcean Droplet**: $5/month
- **Railway WebSocket**: Free tier (sufficient for comments)
- **Total**: ~$5/month

## Testing Checklist

- [ ] Vercel site loads without errors
- [ ] Cover image shows when no stream
- [ ] Comments section appears below video
- [ ] RTMP server accepts OBS connection
- [ ] HLS stream plays in browser
- [ ] Comments work in real-time
- [ ] Video switches to stream when OBS starts

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check nginx CORS headers
2. **WebSocket fails**: Verify environment variables
3. **Stream not showing**: Check HLS URL format
4. **Comments not working**: Check WebSocket server logs

Need help? Check the detailed guides:
- `nginx-rtmp-setup.md` - RTMP server setup
- `websocket-deployment.md` - WebSocket deployment