'use client';

import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import Navigation from '@/components/Navigation';
import VideoPlayer from '@/components/VideoPlayer';
import TwitchChat from '@/components/LiveComments';
import TippingPlatform from '@/components/TippingPlatform';

export default function Home() {
  const [streamUrl, setStreamUrl] = useState('');
  const [isClient, setIsClient] = useState(false);
  const twitchChannel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL || '';

  useEffect(() => {
    setIsClient(true);
    if (twitchChannel) {
      const hostname = window.location.hostname;
      setStreamUrl(`https://player.twitch.tv/?channel=${twitchChannel}&parent=${hostname}`);
    } else {
      setStreamUrl('https://demo-streams.jwplayer.com/bipbop.m3u8');
    }
  }, [twitchChannel]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Projector Bach 24/7 TV - Live Stream",
            "description": "Watch Projector Bach live 24/7 on Twitch. Continuous live streaming, music, entertainment and more. Never stops, always live!",
            "thumbnailUrl": "https://projectorbach.vercel.app/og-image.jpg",
            "uploadDate": new Date().toISOString(),
            "duration": "PT24H",
            "embedUrl": `https://player.twitch.tv/?channel=${twitchChannel}`,
            "publisher": {
              "@type": "Organization",
              "name": "Projector Bach 24/7 TV",
              "logo": {
                "@type": "ImageObject",
                "url": "https://projectorbach.vercel.app/logo.png"
              }
            },
            "isLiveBroadcast": true,
            "startDate": new Date().toISOString()
          })
        }}
      />
      <Navigation />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2, 
          p: 2 
        }}>
          <Box sx={{ flex: 1 }}>
            <VideoPlayer streamUrl={streamUrl} />
          </Box>
          <Box sx={{ 
            width: { xs: '100%', md: '340px' },
            order: { xs: 2, md: 1 }
          }}>
            <TwitchChat channel={twitchChannel} />
          </Box>
        </Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <TippingPlatform />
        </Container>
      </Box>
    </>
  );
}
