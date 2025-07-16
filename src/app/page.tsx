'use client';

import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import Navigation from '@/components/Navigation';
import VideoPlayer from '@/components/VideoPlayer';
import TwitchChat from '@/components/LiveComments';

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
        <VideoPlayer streamUrl={streamUrl} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <TwitchChat channel={twitchChannel} />
        </Container>
      </Box>
    </>
  );
}
