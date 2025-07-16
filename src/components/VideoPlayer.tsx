'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import Hls from 'hls.js';

interface VideoPlayerProps {
  streamUrl: string;
}

export default function VideoPlayer({ streamUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if it's a YouTube embed URL
    if (streamUrl.includes('youtube.com/embed/')) {
      setIsLive(true);
      setError(null);
      return;
    }

    // Check if it's a Twitch embed URL
    if (streamUrl.includes('player.twitch.tv')) {
      setIsLive(true);
      setError(null);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Stream manifest loaded successfully');
        setIsLive(true);
        setError(null);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('HLS Error:', data);
        if (data.fatal) {
          setError('Stream unavailable - Check if OBS is streaming');
          setIsLive(false);
          
          // Retry loading stream after 5 seconds
          setTimeout(() => {
            console.log('Retrying stream connection...');
            hls.loadSource(streamUrl);
          }, 5000);
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLive(true);
        setError(null);
      });
      video.addEventListener('error', () => {
        setError('Stream unavailable');
        setIsLive(false);
      });
    } else {
      setError('HLS not supported in this browser');
    }
  }, [streamUrl]);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {error && (
        <Alert 
          severity="info" 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 20,
            maxWidth: '400px'
          }}
        >
          {error}
        </Alert>
      )}
      
      <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, width: '100%' }}>
        {streamUrl.includes('youtube.com/embed/') ? (
          <iframe
            src={streamUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : streamUrl.includes('player.twitch.tv') ? (
          <iframe
            src={streamUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
            }}
          />
        )}
        
        {isLive && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'rgba(244, 67, 54, 0.9)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1,
              zIndex: 10,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              🔴 LIVE
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}