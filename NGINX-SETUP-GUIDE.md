# Complete nginx RTMP Configuration Guide

## 🚀 Quick Setup (Recommended)

### Step 1: Get a Server
- **DigitalOcean**: Create $5/month Ubuntu 22.04 droplet
- **Alternative**: Any VPS with Ubuntu 22.04

### Step 2: Run Setup Script
```bash
# Copy files to your server
scp setup-streaming-server.sh root@YOUR_SERVER_IP:~/
scp nginx-complete.conf root@YOUR_SERVER_IP:~/

# SSH to server and run setup
ssh root@YOUR_SERVER_IP
chmod +x setup-streaming-server.sh
sudo ./setup-streaming-server.sh
```

### Step 3: Optional SSL Setup
```bash
# If you have a domain pointing to your server
sudo ./setup-ssl.sh yourdomain.com
```

## 📋 What the Configuration Includes

### RTMP Features
- **Multi-quality streaming**: Automatic 1080p, 720p, 480p transcoding
- **HLS delivery**: Adaptive bitrate streaming
- **DASH support**: Alternative streaming format
- **Recording**: Automatic stream recording to `/var/recordings/`
- **Statistics**: Real-time stream monitoring at `/stat`

### Security Features
- **CORS headers**: Proper cross-origin support
- **Rate limiting**: Prevents abuse
- **Firewall configuration**: Secure port access
- **SSL/HTTPS support**: Optional encrypted delivery

### Monitoring & Logging
- **Real-time statistics**: Monitor active streams
- **Log rotation**: Automatic log management
- **Health checks**: Server status monitoring
- **Stream monitoring service**: Track HLS file generation

## 📊 Server Endpoints

After setup, your server provides:

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `rtmp://SERVER:1935/live` | OBS streaming input | `rtmp://1.2.3.4:1935/live` |
| `http://SERVER/hls/STREAM.m3u8` | HLS playback | `http://1.2.3.4/hls/test.m3u8` |
| `http://SERVER/stat` | Statistics page | Monitor active streams |
| `http://SERVER/health` | Health check | Server status |

## 🎯 OBS Studio Configuration

1. **Settings → Stream**
2. **Service**: Custom...
3. **Server**: `rtmp://YOUR_SERVER_IP:1935/live`
4. **Stream Key**: `test` (or any name you choose)

## 🌐 Website Integration

Update your Vercel environment variables:

```env
NEXT_PUBLIC_STREAM_URL=http://YOUR_SERVER_IP/hls/test.m3u8
# Or with SSL:
NEXT_PUBLIC_STREAM_URL=https://yourdomain.com/hls/test.m3u8
```

## 📁 Configuration Details

### nginx-complete.conf Features

**RTMP Block:**
- Listens on port 1935 for RTMP connections
- Transcodes to multiple quality levels
- Generates HLS and DASH streams
- Records streams automatically
- Supports webhook notifications

**HTTP Block:**
- Serves HLS/DASH files with proper CORS
- Statistics and monitoring endpoints
- Security headers and rate limiting
- SSL/HTTPS support ready
- API endpoints for stream management

**Directory Structure:**
```
/var/www/html/hls/     # HLS stream files
/var/www/html/dash/    # DASH stream files
/var/recordings/       # Recorded streams
/var/log/nginx/        # Nginx logs
```

## 🔧 Advanced Configuration

### Multiple Stream Keys
Edit the RTMP application to support multiple streamers:

```nginx
application live {
    live on;
    
    # Allow specific publishers
    allow publish 192.168.1.100;  # Your IP
    deny publish all;
    
    # Or use authentication
    on_publish http://localhost/auth;
}
```

### Custom Transcoding
Modify the ffmpeg command for different quality levels:

```nginx
exec ffmpeg -i rtmp://localhost/live/$name
    -c:v libx264 -c:a aac -b:v 4000k -b:a 160k -vf "scale=1920:1080" -preset fast -g 60 -f flv rtmp://localhost/hls/$name_1080p
    -c:v libx264 -c:a aac -b:v 2500k -b:a 128k -vf "scale=1280:720" -preset fast -g 60 -f flv rtmp://localhost/hls/$name_720p;
```

### Webhook Integration
Add webhook notifications for stream events:

```nginx
on_publish http://yourserver.com/api/stream/start;
on_publish_done http://yourserver.com/api/stream/end;
```

## 🛠️ Troubleshooting

### Check Status
```bash
# Service status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/error.log
```

### Common Issues

**Stream not appearing:**
- Check firewall: `sudo ufw status`
- Verify HLS files: `ls -la /var/www/html/hls/`
- Check RTMP connection: View `/stat` page

**CORS errors:**
- Verify CORS headers in nginx config
- Check browser developer console

**SSL issues:**
- Verify certificate: `sudo certbot certificates`
- Check domain DNS pointing to server

## 📈 Performance Optimization

### Server Specifications
- **Minimum**: 1 CPU, 1GB RAM (720p stream)
- **Recommended**: 2 CPU, 2GB RAM (1080p + transcoding)
- **High-load**: 4+ CPU, 4GB+ RAM (multiple streams)

### Bandwidth Requirements
- **Upload**: 5-10 Mbps for 1080p60
- **Download**: 50+ Mbps for serving 10+ viewers

## 🔒 Security Best Practices

1. **Firewall**: Only open necessary ports
2. **SSL**: Use HTTPS for stream delivery
3. **Authentication**: Implement stream key validation
4. **Rate limiting**: Prevent abuse
5. **Regular updates**: Keep nginx and system updated

## 💰 Cost Estimate

**Monthly Costs:**
- DigitalOcean Droplet: $5-10
- Domain name: $1-2 (optional)
- SSL Certificate: Free (Let's Encrypt)
- **Total**: $6-12/month

This gives you a professional-grade streaming infrastructure capable of handling multiple concurrent streams and viewers.

## ✅ Success Checklist

- [ ] Server created and accessible via SSH
- [ ] Setup script completed without errors
- [ ] Nginx service running: `systemctl status nginx`
- [ ] Firewall configured: `ufw status`
- [ ] OBS connects to RTMP server
- [ ] HLS stream accessible in browser
- [ ] Statistics page shows active streams
- [ ] Website plays stream correctly

Your RTMP streaming server is now ready for 24/7 operation!