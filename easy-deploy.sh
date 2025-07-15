#!/bin/bash

echo "🚀 Easy Streaming Server Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root: sudo ./easy-deploy.sh${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Installing Docker...${NC}"

# Update system
apt update -y

# Install Docker
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

echo -e "${BLUE}Step 2: Setting up directories...${NC}"

# Create data directories
mkdir -p /opt/streaming-server/data/hls
mkdir -p /opt/streaming-server/data/recordings
chmod 755 /opt/streaming-server/data/hls
chmod 755 /opt/streaming-server/data/recordings

echo -e "${GREEN}✅ Directories created${NC}"

echo -e "${BLUE}Step 3: Configuring firewall...${NC}"

# Configure UFW firewall
ufw --force enable
ufw allow 22     # SSH
ufw allow 80     # HTTP  
ufw allow 1935   # RTMP
ufw allow 3001   # WebSocket
ufw allow 8080   # HLS

echo -e "${GREEN}✅ Firewall configured${NC}"

echo -e "${BLUE}Step 4: Starting services...${NC}"

# Copy files to deployment directory
cp docker-compose.yml /opt/streaming-server/
cp nginx-simple.conf /opt/streaming-server/
cp Dockerfile /opt/streaming-server/
cp websocket-server.js /opt/streaming-server/
cp package-websocket.json /opt/streaming-server/package.json

# Change to deployment directory
cd /opt/streaming-server

# Start services
docker-compose up -d --build

echo -e "${GREEN}✅ Services started${NC}"

# Wait for services to start
sleep 10

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || hostname -I | awk '{print $1}')

echo ""
echo -e "${GREEN}🎉 STREAMING SERVER IS READY!${NC}"
echo "================================"
echo ""
echo -e "${YELLOW}📡 OBS Studio Settings:${NC}"
echo -e "   Server: ${BLUE}rtmp://${SERVER_IP}:1935/live${NC}"
echo -e "   Stream Key: ${BLUE}test${NC}"
echo ""
echo -e "${YELLOW}🌐 Stream URLs:${NC}"
echo -e "   HLS Stream: ${BLUE}http://${SERVER_IP}:8080/hls/test.m3u8${NC}"
echo -e "   WebSocket: ${BLUE}ws://${SERVER_IP}:3001${NC}"
echo -e "   Server Status: ${BLUE}http://${SERVER_IP}:8080${NC}"
echo -e "   Statistics: ${BLUE}http://${SERVER_IP}:8080/stat${NC}"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "   1. Configure OBS with the settings above"
echo "   2. Update your website's environment variables:"
echo -e "      NEXT_PUBLIC_STREAM_URL=${BLUE}http://${SERVER_IP}:8080/hls/test.m3u8${NC}"
echo -e "      NEXT_PUBLIC_SOCKET_URL=${BLUE}ws://${SERVER_IP}:3001${NC}"
echo "   3. Start streaming from OBS!"
echo ""
echo -e "${GREEN}✨ Your 24/7 streaming server is live!${NC}"

# Save URLs to file for reference
cat > /opt/streaming-server/STREAM_URLS.txt << EOF
🎬 STREAMING SERVER URLS
========================

OBS Studio Settings:
  Server: rtmp://${SERVER_IP}:1935/live
  Stream Key: test

Stream URLs:
  HLS Stream: http://${SERVER_IP}:8080/hls/test.m3u8
  WebSocket: ws://${SERVER_IP}:3001
  Server Status: http://${SERVER_IP}:8080
  Statistics: http://${SERVER_IP}:8080/stat

Environment Variables for Website:
  NEXT_PUBLIC_STREAM_URL=http://${SERVER_IP}:8080/hls/test.m3u8
  NEXT_PUBLIC_SOCKET_URL=ws://${SERVER_IP}:3001

Created: $(date)
EOF

echo -e "${BLUE}📝 URLs saved to: /opt/streaming-server/STREAM_URLS.txt${NC}"