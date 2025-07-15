# 🚀 Super Easy 24/7 Streaming Setup

Get your OBS stream running on your Digital Ocean droplet in **5 minutes**!

## ⚡ Quick Start (One Command!)

1. **Upload files to your Digital Ocean droplet:**
   ```bash
   # On your local machine
   scp -r . root@YOUR_DROPLET_IP:~/streaming-setup/
   ```

2. **SSH into your droplet and run:**
   ```bash
   ssh root@YOUR_DROPLET_IP
   cd streaming-setup
   chmod +x easy-deploy.sh
   sudo ./easy-deploy.sh
   ```

3. **That's it!** 🎉

The script will:
- Install Docker automatically
- Set up RTMP streaming server
- Configure WebSocket for live comments
- Open firewall ports
- Give you all the URLs you need

## 📱 What You Get

After running the script, you'll have:

- **RTMP Server**: `rtmp://YOUR_IP:1935/live`
- **HLS Stream**: `http://YOUR_IP:8080/hls/test.m3u8`  
- **WebSocket**: `ws://YOUR_IP:3001`
- **Admin Panel**: `http://YOUR_IP:8080/stat`

## 🎬 Configure OBS Studio

1. Open OBS Studio
2. Go to **Settings → Stream**
3. Set **Service** to: `Custom...`
4. Set **Server** to: `rtmp://YOUR_DROPLET_IP:1935/live`
5. Set **Stream Key** to: `test`
6. Click **OK**

## 🌐 Update Your Website

Add these environment variables to your Vercel/hosting platform:

```env
NEXT_PUBLIC_STREAM_URL=http://YOUR_DROPLET_IP:8080/hls/test.m3u8
NEXT_PUBLIC_SOCKET_URL=ws://YOUR_DROPLET_IP:3001
```

## ✅ Test Your Setup

1. **Start streaming** from OBS
2. **Check your website** - should show your stream after 10-30 seconds
3. **Test comments** - they should work in real-time
4. **Monitor server** at `http://YOUR_DROPLET_IP:8080/stat`

## 🔧 Useful Commands

```bash
# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Start everything
docker-compose up -d
```

## 💰 Cost

- **Digital Ocean Droplet**: $5/month
- **Everything else**: FREE
- **Total**: $5/month for 24/7 streaming!

## 🆘 Troubleshooting

**Stream not showing?**
- Wait 30 seconds after starting OBS
- Check `http://YOUR_IP:8080/stat` for active streams
- Verify OBS is connected (green square in bottom right)

**Comments not working?**
- Check browser console for WebSocket errors
- Verify environment variables are correct
- Make sure you're using `ws://` not `wss://`

**Need to check logs?**
```bash
cd /opt/streaming-server
docker-compose logs websocket-server
docker-compose logs rtmp-server
```

## 🎯 Why This Is Better

**Before (Complex nginx setup):**
- Multiple config files to edit
- Manual nginx compilation
- Complex firewall rules
- Easy to break

**Now (Docker setup):**
- ✅ One command deployment
- ✅ Automatic dependency management  
- ✅ Built-in monitoring
- ✅ Easy to backup/restore
- ✅ Works on any Ubuntu server

---

**You now have a professional 24/7 streaming platform!** 🎬✨

All your URLs are saved in `/opt/streaming-server/STREAM_URLS.txt` for reference.