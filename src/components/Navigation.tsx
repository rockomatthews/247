'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { LiveTv, Info } from '@mui/icons-material';
import Link from 'next/link';

export default function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Live Stream
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            href="/"
            startIcon={<LiveTv />}
          >
            Stream
          </Button>
          <Button
            color="inherit"
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