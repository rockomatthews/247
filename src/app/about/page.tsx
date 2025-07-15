import { Container, Typography, Paper, Box } from '@mui/material';
import Navigation from '@/components/Navigation';

export default function About() {
  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            About Our Live Stream
          </Typography>
          
          <Typography variant="body1" paragraph>
            Welcome to our 24/7 live streaming platform! This site is designed to provide 
            continuous streaming capabilities using OBS Studio with real-time viewer interaction 
            through our live comments system.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Technical Features
          </Typography>
          
          <Typography variant="body1" paragraph>
            Our platform utilizes modern web technologies to deliver a seamless streaming experience:
          </Typography>

          <Box component="ul" sx={{ ml: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              <strong>RTMP Ingestion:</strong> Stream directly from OBS Studio using RTMP protocol
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              <strong>HLS Delivery:</strong> Adaptive bitrate streaming for optimal viewing quality
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              <strong>Low Latency:</strong> Optimized for real-time interaction with viewers
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              <strong>Live Comments:</strong> Real-time chat system using WebSocket connections
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              <strong>Responsive Design:</strong> Works seamlessly on desktop and mobile devices
            </Typography>
          </Box>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            How to Stream
          </Typography>
          
          <Typography variant="body1" paragraph>
            To start streaming to this platform:
          </Typography>

          <Box component="ol" sx={{ ml: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Open OBS Studio and go to Settings → Stream
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Set Service to &quot;Custom...&quot;
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Enter the RTMP server URL provided by the administrator
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Add your stream key and start streaming
            </Typography>
          </Box>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Built With
          </Typography>
          
          <Typography variant="body1" paragraph>
            This platform is built using Next.js, Material-UI, HLS.js for video playback, 
            and Socket.IO for real-time comments. The streaming infrastructure supports 
            24/7 operation with automatic failover and quality adaptation.
          </Typography>
        </Paper>
      </Container>
    </>
  );
}