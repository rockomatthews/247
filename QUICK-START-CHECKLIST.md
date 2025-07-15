# ✅ QUICK START CHECKLIST

Copy this checklist and check off each step as you complete it:

## 🖥️ Server Setup (10 minutes)
- [ ] Sign up for DigitalOcean account
- [ ] Create $5/month Ubuntu 22.04 droplet
- [ ] Copy server IP address: `___________________`
- [ ] SSH into server: `ssh root@YOUR_SERVER_IP`
- [ ] Upload setup files to server
- [ ] Run setup script: `sudo ./setup-streaming-server.sh`
- [ ] Save RTMP URL: `rtmp://YOUR_SERVER_IP:1935/live`
- [ ] Save HLS URL: `http://YOUR_SERVER_IP/hls/test.m3u8`
- [ ] Test web interface: `http://YOUR_SERVER_IP`

## 🌐 WebSocket Setup (5 minutes)
- [ ] Sign up for Railway account with GitHub
- [ ] Deploy project from GitHub repository
- [ ] Add environment variable: `FRONTEND_URL=https://your-vercel-app.vercel.app`
- [ ] Copy Railway domain: `_________________________________`
- [ ] Convert to WebSocket URL: `wss://your-railway-app.up.railway.app`

## ⚡ Vercel Configuration (3 minutes)
- [ ] Go to Vercel dashboard → your project → Settings
- [ ] Add environment variable: `NEXT_PUBLIC_STREAM_URL`
  - Value: `http://YOUR_SERVER_IP/hls/test.m3u8`
- [ ] Add environment variable: `NEXT_PUBLIC_SOCKET_URL`
  - Value: `wss://your-railway-app.up.railway.app`
- [ ] Redeploy project from Deployments tab
- [ ] Wait for deployment to complete

## 🎥 OBS Configuration (2 minutes)
- [ ] Open OBS Studio
- [ ] Go to Settings → Stream
- [ ] Set Service to "Custom..."
- [ ] Set Server to: `rtmp://YOUR_SERVER_IP:1935/live`
- [ ] Set Stream Key to: `test`
- [ ] Click OK and Apply
- [ ] Add a video source (camera, display, etc.)

## 🧪 Testing (5 minutes)
- [ ] Start streaming in OBS
- [ ] Check OBS shows "LIVE" with green indicator
- [ ] Visit your Vercel website: `https://your-app.vercel.app`
- [ ] Verify cover image shows initially
- [ ] Wait 30 seconds for stream to appear
- [ ] Verify video switches from cover to live stream
- [ ] Test comments: Enter name and message
- [ ] Open second browser tab and verify comments sync
- [ ] Check server stats: `http://YOUR_SERVER_IP/stat`
- [ ] Stop streaming in OBS
- [ ] Verify website returns to cover image

## 📝 Save Your Information

**Server Details:**
- Server IP: `___________________`
- RTMP URL: `rtmp://___________________:1935/live`
- HLS URL: `http://___________________/hls/test.m3u8`
- Admin Panel: `http://___________________/stat`

**Service URLs:**
- Website: `https://_____________________.vercel.app`
- WebSocket: `wss://_____________________.up.railway.app`
- Railway Dashboard: `https://railway.app/project/_________`

**OBS Settings:**
- Server: `rtmp://___________________:1935/live`
- Stream Key: `test`

## 🚨 Troubleshooting Quick Fixes

**Stream not showing on website:**
- [ ] Wait 30-60 seconds (HLS needs time to generate)
- [ ] Check OBS is actually streaming (green light)
- [ ] Verify Vercel environment variables are correct
- [ ] Check `http://YOUR_SERVER_IP/stat` shows active stream

**Comments not working:**
- [ ] Check Railway deployment is running
- [ ] Verify WebSocket URL starts with `wss://` not `https://`
- [ ] Open browser developer tools and check for errors

**OBS won't connect:**
- [ ] Double-check RTMP URL has correct IP
- [ ] Verify server is running: `http://YOUR_SERVER_IP`
- [ ] Check firewall allows port 1935

**Website won't load:**
- [ ] Check Vercel deployment completed successfully
- [ ] Verify environment variables are saved
- [ ] Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

## 🎉 Success Criteria

You're successful when:
- [ ] OBS connects and shows "LIVE"
- [ ] Website shows your stream within 30 seconds
- [ ] Comments work in real-time across browser tabs
- [ ] Stream automatically returns to cover when you stop OBS
- [ ] You can access server stats page

**Total setup time: ~25 minutes**
**Monthly cost: $5 (just the DigitalOcean server)**

## 🔥 Next Steps After Success

- [ ] Test stream quality and adjust OBS bitrate
- [ ] Create multiple stream keys for different shows
- [ ] Set up stream scheduling and notifications
- [ ] Add custom branding to cover image
- [ ] Consider adding SSL certificate for HTTPS
- [ ] Set up stream recording and highlights

**You now have a professional streaming platform!** 🚀