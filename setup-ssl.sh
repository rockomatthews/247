#!/bin/bash

# SSL Certificate Setup Script for RTMP Streaming Server
# Run this AFTER the main setup script
# Usage: chmod +x setup-ssl.sh && sudo ./setup-ssl.sh yourdomain.com

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Usage: sudo ./setup-ssl.sh yourdomain.com"
    echo "   Example: sudo ./setup-ssl.sh streaming.mydomain.com"
    exit 1
fi

echo "🔒 Setting up SSL certificate for $DOMAIN..."

# Install certbot
echo "📦 Installing certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Stop nginx temporarily
echo "⏸️  Stopping nginx temporarily..."
systemctl stop nginx

# Get SSL certificate
echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
certbot certonly --standalone -d $DOMAIN --agree-tos --register-unsafely-without-email

if [ $? -ne 0 ]; then
    echo "❌ Failed to obtain SSL certificate"
    systemctl start nginx
    exit 1
fi

# Update nginx configuration for SSL
echo "⚙️  Updating nginx configuration for SSL..."

# Backup current config
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.pre-ssl

# Update the nginx config to enable SSL
sed -i "s/server_name _;/server_name $DOMAIN;/g" /etc/nginx/nginx.conf
sed -i "s/# server {/server {/g" /etc/nginx/nginx.conf
sed -i "s/#     listen 443/    listen 443/g" /etc/nginx/nginx.conf
sed -i "s/#     server_name streaming.yourdomain.com;/    server_name $DOMAIN;/g" /etc/nginx/nginx.conf
sed -i "s/#     ssl_certificate/    ssl_certificate/g" /etc/nginx/nginx.conf
sed -i "s/streaming.yourdomain.com/$DOMAIN/g" /etc/nginx/nginx.conf
sed -i "s/# }/}/g" /etc/nginx/nginx.conf

# Create location includes file
cat > /etc/nginx/conf.d/streaming-locations.conf << 'EOF'
# HLS streams
location /hls {
    add_header Cache-Control no-cache always;
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
    add_header Access-Control-Expose-Headers 'Content-Length,Content-Range' always;

    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
        add_header Access-Control-Max-Age 1728000;
        add_header Content-Type 'text/plain charset=UTF-8';
        add_header Content-Length 0;
        return 204;
    }

    location ~ \.m3u8$ {
        add_header Cache-Control 'no-cache, no-store, must-revalidate' always;
        add_header Pragma 'no-cache' always;
        add_header Expires '0' always;
        add_header Access-Control-Allow-Origin * always;
    }

    location ~ \.ts$ {
        add_header Cache-Control 'public, max-age=86400' always;
        add_header Access-Control-Allow-Origin * always;
    }

    try_files $uri $uri/ =404;
}

# DASH streams
location /dash {
    add_header Cache-Control no-cache always;
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;

    location ~ \.mpd$ {
        add_header Cache-Control 'no-cache, no-store, must-revalidate' always;
    }

    try_files $uri $uri/ =404;
}

# Statistics
location /stat {
    rtmp_stat all;
    rtmp_stat_stylesheet stat.xsl;
}

location /stat.xsl {
    root /var/www/html;
}

# Health check
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}

# Default page
location / {
    try_files $uri $uri/ =404;
}

# Security
location ~ /\. {
    deny all;
}

location ~* \.(php|jsp|cgi)$ {
    deny all;
}
EOF

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration error! Restoring backup..."
    cp /etc/nginx/nginx.conf.pre-ssl /etc/nginx/nginx.conf
    systemctl start nginx
    exit 1
fi

# Start nginx
echo "🚀 Starting nginx with SSL..."
systemctl start nginx

# Setup auto-renewal
echo "🔄 Setting up SSL certificate auto-renewal..."
crontab -l > /tmp/crontab.bak 2>/dev/null || true
echo "0 12 * * * /usr/bin/certbot renew --quiet" >> /tmp/crontab.bak
crontab /tmp/crontab.bak

# Update firewall for HTTPS
echo "🔥 Updating firewall for HTTPS..."
ufw allow 443/tcp

# Update the index page with SSL info
sed -i "s/YOUR_SERVER_IP/$DOMAIN/g" /var/www/html/index.html
sed -i "s/http:/https:/g" /var/www/html/index.html

echo ""
echo "🎉 SSL Certificate Setup Complete!"
echo ""
echo "📋 Updated Server Information:"
echo "   Domain: $DOMAIN"
echo "   HTTPS URL: https://$DOMAIN"
echo "   RTMP URL: rtmp://$DOMAIN:1935/live"
echo "   Statistics: https://$DOMAIN/stat"
echo ""
echo "🌐 Updated Stream URLs:"
echo "   HLS: https://$DOMAIN/hls/test.m3u8"
echo "   DASH: https://$DOMAIN/dash/test.mpd"
echo ""
echo "📊 Next Steps:"
echo "   1. Update your website environment variables:"
echo "      NEXT_PUBLIC_STREAM_URL=https://$DOMAIN/hls/test.m3u8"
echo "   2. Test HTTPS access: https://$DOMAIN"
echo "   3. Certificate will auto-renew via cron job"
echo ""
echo "🔒 SSL Certificate Information:"
certbot certificates

echo "✨ SSL setup completed successfully! Your RTMP server now has HTTPS enabled."