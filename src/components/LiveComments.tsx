'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface TwitchChatProps {
  channel: string;
}

export default function TwitchChat({ channel }: TwitchChatProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!channel) {
    return (
      <Box sx={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        No chat channel configured
      </Box>
    );
  }

  if (!isClient) {
    return (
      <Box sx={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading chat...
      </Box>
    );
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  
  return (
    <Box sx={{ height: '600px', width: '100%' }}>
      <iframe
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${hostname}`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Twitch Chat"
      />
    </Box>
  );
}