#!/bin/bash

# Complete RTMP Streaming Server Setup Script
# Run on Ubuntu 22.04 LTS server
# Usage: chmod +x setup-streaming-server.sh && sudo ./setup-streaming-server.sh

set -e

echo "🚀 Starting RTMP Streaming Server Setup..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "📦 Installing nginx, ffmpeg, and dependencies..."
apt install -y nginx libnginx-mod-rtmp ffmpeg software-properties-common curl wget unzip

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p /var/www/html/hls
mkdir -p /var/www/html/dash
mkdir -p /var/recordings
mkdir -p /var/log/nginx

# Set correct permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/html
chown -R www-data:www-data /var/recordings
chmod -R 755 /var/www/html
chmod -R 755 /var/recordings

# Backup original nginx config
echo "💾 Backing up original nginx configuration..."
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Copy our nginx configuration
echo "⚙️  Installing nginx configuration..."
if [ -f "nginx-complete.conf" ]; then
    cp nginx-complete.conf /etc/nginx/nginx.conf
else
    echo "❌ nginx-complete.conf not found in current directory!"
    echo "Please ensure nginx-complete.conf is in the same directory as this script."
    exit 1
fi

# Create RTMP statistics stylesheet
echo "📊 Setting up RTMP statistics..."
cat > /var/www/html/stat.xsl << 'EOF'
<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
    <title>RTMP Statistics</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1, h2 { color: #333; }
    </style>
</head>
<body>
    <h1>RTMP Statistics</h1>
    <h2>Server Info</h2>
    <table>
        <tr><th>Nginx Version</th><td><xsl:value-of select="rtmp/nginx_version" /></td></tr>
        <tr><th>Nginx RTMP Version</th><td><xsl:value-of select="rtmp/nginx_rtmp_version" /></td></tr>
        <tr><th>Compiler</th><td><xsl:value-of select="rtmp/compiler" /></td></tr>
        <tr><th>Built</th><td><xsl:value-of select="rtmp/built" /></td></tr>
        <tr><th>PID</th><td><xsl:value-of select="rtmp/pid" /></td></tr>
        <tr><th>Uptime</th><td><xsl:value-of select="rtmp/uptime" /></td></tr>
    </table>
    
    <h2>Applications</h2>
    <xsl:for-each select="rtmp/server/application">
        <h3>Application: <xsl:value-of select="name" /></h3>
        <h4>Live Streams</h4>
        <table>
            <tr>
                <th>Stream</th>
                <th>Publisher</th>
                <th>Subscribers</th>
                <th>Bandwidth</th>
                <th>Duration</th>
            </tr>
            <xsl:for-each select="live/stream">
                <tr>
                    <td><xsl:value-of select="name" /></td>
                    <td><xsl:value-of select="client/address" /></td>
                    <td><xsl:value-of select="nclients" /></td>
                    <td><xsl:value-of select="bw_in" /> / <xsl:value-of select="bw_out" /></td>
                    <td><xsl:value-of select="time" /></td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:for-each>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
EOF

# Create default index page
echo "🌐 Creating default index page..."
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>RTMP Streaming Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        .info-box { background: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
        .endpoint { background: #f8f8f8; padding: 10px; border-radius: 5px; font-family: monospace; }
        a { color: #2196F3; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎥 RTMP Streaming Server</h1>
        <p>Your RTMP streaming server is running successfully!</p>
        
        <div class="info-box">
            <h3>📡 OBS Studio Configuration</h3>
            <p><strong>Server:</strong> <span class="endpoint">rtmp://YOUR_SERVER_IP:1935/live</span></p>
            <p><strong>Stream Key:</strong> <span class="endpoint">test</span> (or any name you choose)</p>
        </div>
        
        <div class="info-box">
            <h3>🎬 Stream Playback URLs</h3>
            <p><strong>HLS Stream:</strong> <span class="endpoint">http://YOUR_SERVER_IP/hls/test.m3u8</span></p>
            <p><strong>DASH Stream:</strong> <span class="endpoint">http://YOUR_SERVER_IP/dash/test.mpd</span></p>
        </div>
        
        <h3>📊 Server Status</h3>
        <ul>
            <li><a href="/stat">RTMP Statistics</a></li>
            <li><a href="/health">Health Check</a></li>
            <li><a href="/hls/">HLS Directory</a></li>
        </ul>
        
        <h3>📝 Quick Start</h3>
        <ol>
            <li>Configure OBS with the server URL above</li>
            <li>Start streaming from OBS</li>
            <li>Your stream will be available at the HLS URL</li>
            <li>Check <a href="/stat">statistics</a> to monitor active streams</li>
        </ol>
    </div>
</body>
</html>
EOF

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration error! Restoring backup..."
    cp /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf
    exit 1
fi

# Configure firewall
echo "🔥 Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 1935/tcp

# Start and enable nginx
echo "🚀 Starting nginx..."
systemctl enable nginx
systemctl restart nginx

# Create systemd service for monitoring (optional)
echo "📊 Setting up stream monitor service..."
cat > /etc/systemd/system/stream-monitor.service << 'EOF'
[Unit]
Description=Stream Monitor
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'while true; do echo "$(date): $(ls -la /var/www/html/hls/)" >> /var/log/stream-monitor.log; sleep 30; done'
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
EOF

systemctl enable stream-monitor
systemctl start stream-monitor

# Create log rotation
echo "📝 Setting up log rotation..."
cat > /etc/logrotate.d/nginx-rtmp << 'EOF'
/var/log/nginx/*.log /var/log/stream-monitor.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi \
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
EOF

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "🎉 RTMP Streaming Server Setup Complete!"
echo ""
echo "📋 Server Information:"
echo "   Server IP: $SERVER_IP"
echo "   RTMP URL: rtmp://$SERVER_IP:1935/live"
echo "   Web Interface: http://$SERVER_IP"
echo "   Statistics: http://$SERVER_IP/stat"
echo ""
echo "🎯 OBS Configuration:"
echo "   Server: rtmp://$SERVER_IP:1935/live"
echo "   Stream Key: test (or any name)"
echo ""
echo "🌐 Stream URLs:"
echo "   HLS: http://$SERVER_IP/hls/test.m3u8"
echo "   DASH: http://$SERVER_IP/dash/test.mpd"
echo ""
echo "📊 Next Steps:"
echo "   1. Configure OBS Studio with the settings above"
echo "   2. Start streaming from OBS"
echo "   3. Visit http://$SERVER_IP/stat to monitor streams"
echo "   4. Update your website environment variables:"
echo "      NEXT_PUBLIC_STREAM_URL=http://$SERVER_IP/hls/test.m3u8"
echo ""
echo "📁 Important Directories:"
echo "   HLS files: /var/www/html/hls/"
echo "   Recordings: /var/recordings/"
echo "   Logs: /var/log/nginx/"
echo ""
echo "🔧 Useful Commands:"
echo "   Check nginx status: systemctl status nginx"
echo "   Restart nginx: sudo systemctl restart nginx"
echo "   View logs: tail -f /var/log/nginx/error.log"
echo "   Test config: sudo nginx -t"
echo ""

# Final status check
systemctl status nginx --no-pager

echo "✨ Setup completed successfully! Your RTMP server is ready for streaming."