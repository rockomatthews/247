'use client';

import { Box } from '@mui/material';

interface TwitchChatProps {
  channel: string;
}

export default function TwitchChat({ channel }: TwitchChatProps) {
  if (!channel) {
    return (
      <Box sx={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        No chat channel configured
      </Box>
    );
  }

  return (
    <Box sx={{ height: '600px', width: '100%' }}>
      <iframe
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}`}
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