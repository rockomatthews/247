# RTMP Server Setup Guide

## Option 1: DigitalOcean Droplet with nginx-rtmp

### 1. Create Ubuntu Server
```bash
# Create a $5/month droplet on DigitalOcean (or any Ubuntu VPS)
# Connect via SSH
ssh root@your-server-ip
```

### 2. Install nginx with RTMP module
```bash
# Update system
apt update && apt upgrade -y

# Install nginx and build tools
apt install nginx libnginx-mod-rtmp ffmpeg -y

# Enable nginx
systemctl enable nginx
systemctl start nginx
```

### 3. Configure nginx for RTMP
```bash
# Edit nginx config
nano /etc/nginx/nginx.conf
```

Add this RTMP block at the end (before the last `}`):

```nginx
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        
        application live {
            live on;
            
            # HLS settings
            hls on;
            hls_path /var/www/html/hls;
            hls_fragment 3;
            hls_playlist_length 60;
            
            # Allow from anywhere (configure for security)
            allow publish all;
            allow play all;
        }
    }
}

http {
    # Add CORS headers for HLS
    server {
        listen 80;
        server_name your-domain.com;  # Replace with your domain
        
        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /var/www/html;
            
            # CORS headers
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        }
    }
}
```

### 4. Create HLS directory
```bash
mkdir -p /var/www/html/hls
chown www-data:www-data /var/www/html/hls
chmod 755 /var/www/html/hls
```

### 5. Test and restart nginx
```bash
nginx -t
systemctl restart nginx
```

### 6. Configure firewall
```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 1935  # RTMP
ufw enable
```

## Option 2: Docker Setup (Easier)

### 1. Create docker-compose.yml
```yaml
version: '3.8'
services:
  nginx-rtmp:
    image: alfg/nginx-rtmp
    ports:
      - "1935:1935"  # RTMP
      - "8080:80"    # HLS delivery
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./hls:/opt/data/hls
    environment:
      - RTMP_STREAM_NAMES=live
```

### 2. Create nginx.conf for Docker
```nginx
worker_processes auto;
rtmp_auto_push on;
events {}

rtmp {
    server {
        listen 1935;
        application live {
            live on;
            hls on;
            hls_path /opt/data/hls;
            hls_fragment 3;
            hls_playlist_length 60;
            allow publish all;
        }
    }
}

http {
    server {
        listen 80;
        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /opt/data;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
        }
    }
}
```

### 3. Run the server
```bash
docker-compose up -d
```

## OBS Configuration

1. Open OBS Studio → Settings → Stream
2. Service: Custom...
3. Server: `rtmp://your-server-ip:1935/live`
4. Stream Key: `test` (or any name you choose)

## Your Stream URLs

After setup, your URLs will be:

- **RTMP Input** (for OBS): `rtmp://your-server-ip:1935/live/test`
- **HLS Output** (for website): `http://your-server-ip:8080/hls/test.m3u8`

## Environment Variables

Update your `.env.local`:
```env
NEXT_PUBLIC_STREAM_URL=http://your-server-ip:8080/hls/test.m3u8
NEXT_PUBLIC_SOCKET_URL=ws://your-server-ip:3001
```

## Testing

1. Start streaming from OBS to `rtmp://your-server-ip:1935/live/test`
2. Check HLS stream at `http://your-server-ip:8080/hls/test.m3u8`
3. Your website will automatically pick up the stream