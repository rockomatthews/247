import { Box, Container } from '@mui/material';
import Navigation from '@/components/Navigation';
import VideoPlayer from '@/components/VideoPlayer';
import LiveComments from '@/components/LiveComments';

export default function Home() {
  const streamUrl = process.env.NEXT_PUBLIC_STREAM_URL || 'https://demo-streams.jwplayer.com/bipbop.m3u8';

  return (
    <>
      <Navigation />
      <Box sx={{ width: '100%' }}>
        <VideoPlayer streamUrl={streamUrl} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <LiveComments />
        </Container>
      </Box>
    </>
  );
}
