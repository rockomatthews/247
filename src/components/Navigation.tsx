'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { LiveTv, Info } from '@mui/icons-material';
import Link from 'next/link';

export default function Navigation() {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontFamily: '"Act of Rejection", sans-serif',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          <span style={{ color: '#FFD700' }}>Projector Bach</span>{' '}
          <span style={{ color: 'white' }}>TV</span>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            sx={{ color: 'white' }}
            component={Link}
            href="/"
            startIcon={<LiveTv />}
          >
            Stream
          </Button>
          <Button
            sx={{ color: 'white' }}
            component={Link}
            href="/about"
            startIcon={<Info />}
          >
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}