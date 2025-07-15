FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY websocket-server.js ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S websocket -u 1001

USER websocket

EXPOSE 3001

CMD ["node", "websocket-server.js"]