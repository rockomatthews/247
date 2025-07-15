#!/bin/bash

echo "🚀 Installing your streaming server..."

# Get server IP automatically
SERVER_IP=$(curl -s ifconfig.me)

# Install Docker
curl -fsSL https://get.docker.com | sh

# Create and run the streaming server
docker run -d \
  --name streaming-server \
  -p 1935:1935 \
  -p 80:80 \
  --restart unless-stopped \
  alfg/nginx-rtmp

# Wait for container to start
sleep 5

echo ""
echo "✅ DONE! Your streaming server is running!"
echo ""
echo "🎬 OBS Settings:"
echo "   Server: rtmp://$SERVER_IP:1935/live"
echo "   Stream Key: stream"
echo ""
echo "🌐 Stream URL for your website:"
echo "   http://$SERVER_IP/hls/stream.m3u8"
echo ""
echo "📊 Check if it's working:"
echo "   http://$SERVER_IP/stat"
echo ""