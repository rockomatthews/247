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
