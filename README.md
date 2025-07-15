# OBS Live Streaming Site

A Next.js application with Material-UI for 24/7 OBS streaming with live comments.

## Features

- **Video Streaming**: HLS-based video player with low latency support
- **Live Comments**: Real-time commenting system using WebSocket
- **Responsive Design**: Works on desktop and mobile devices
- **OBS Integration**: Ready for RTMP input from OBS Studio

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_STREAM_URL=your-hls-stream-url
NEXT_PUBLIC_SOCKET_URL=your-websocket-server-url
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## OBS Configuration

To stream from OBS Studio:

1. Open OBS Studio → Settings → Stream
2. Set Service to "Custom..."
3. Enter your RTMP server URL
4. Add your stream key
5. Start streaming

## Streaming Recommendations

Based on research, the best setup for 24/7 streaming is:

- **Ingestion Protocol**: RTMP (most compatible with OBS)
- **Delivery Protocol**: HLS with low-latency optimization
- **Backup Option**: WebRTC for ultra-low latency interactive streams

## Architecture

- **Frontend**: Next.js 15 with Material-UI
- **Video Player**: HLS.js for adaptive streaming
- **Comments**: Socket.IO for real-time communication
- **Styling**: Material-UI with dark theme

## Browser Support

- Modern browsers with HLS support
- iOS Safari (native HLS support)
- Chrome, Firefox, Edge (via HLS.js)

## Production Notes

For production deployment:

1. Set up an RTMP server (nginx-rtmp recommended)
2. Configure HLS transcoding
3. Set up a WebSocket server for comments
4. Use a CDN for HLS delivery
5. Configure proper CORS headers
