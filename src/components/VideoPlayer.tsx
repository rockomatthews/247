'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import Image from 'next/image';
import Hls from 'hls.js';

interface VideoPlayerProps {
  streamUrl: string;
}

export default function VideoPlayer({ streamUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [showCover, setShowCover] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if it's a YouTube embed URL
    if (streamUrl.includes('youtube.com/embed/')) {
      // Extract video ID and show YouTube iframe instead
      const videoId = streamUrl.split('/embed/')[1];
      setIsLive(true);
      setShowCover(false);
      setError(null);
      return;
    }

    // Check if it's a Twitch embed URL
    if (streamUrl.includes('player.twitch.tv')) {
      setIsLive(true);
      setShowCover(false);
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
        setShowCover(false);
        setError(null);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('HLS Error:', data);
        if (data.fatal) {
          setError('Stream unavailable - Check if OBS is streaming');
          setIsLive(false);
          setShowCover(true);
          
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
        setShowCover(false);
        setError(null);
      });
      video.addEventListener('error', () => {
        setError('Stream unavailable');
        setIsLive(false);
        setShowCover(true);
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
        {showCover && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            <Image
              src="/stream-cover.jpg"
              alt="Stream Cover"
              fill
              style={{
                objectFit: 'cover',
              }}
              priority
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 32,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Stream Offline
              </Typography>
              <Typography variant="body1">
                The stream will appear here when broadcasting begins
              </Typography>
            </Box>
          </Box>
        )}
        
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
              display: showCover ? 'none' : 'block',
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
              display: showCover ? 'none' : 'block',
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
              display: showCover ? 'none' : 'block',
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