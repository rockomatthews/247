'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle, 
  Home
} from '@mui/icons-material';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const tipAmount = searchParams.get('amount');
    const tipMessage = searchParams.get('message');
    
    if (tipAmount) setAmount(tipAmount);
    if (tipMessage) setMessage(decodeURIComponent(tipMessage));
  }, [searchParams]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      p: 2
    }}>
      <Card sx={{ 
        maxWidth: 500, 
        width: '100%',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
        border: '2px solid #4caf50',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ 
            fontSize: 80, 
            color: '#4caf50', 
            mb: 2 
          }} />
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: '"Act of Rejection", sans-serif',
              color: '#4caf50',
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            Payment Successful!
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              mb: 1
            }}
          >
            Thank you for your ${amount} tip!
          </Typography>
          
          {message && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                backgroundColor: '#2196f3', 
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              }}
            >
              Your message: &quot;{message}&quot;
            </Alert>
          )}
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              mb: 3 
            }}
          >
            Your support means everything to Projector Bach and helps keep the 24/7 stream running!
          </Typography>
          
          <Link href="/" passHref>
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: '#FFD700',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#FFC107',
                }
              }}
            >
              Back to Stream
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}