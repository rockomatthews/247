'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent,
  Chip,
  Alert,
  InputAdornment
} from '@mui/material';
import { 
  CreditCard, 
  CurrencyBitcoin, 
  Favorite
} from '@mui/icons-material';

interface TippingPlatformProps {
  streamerName?: string;
}

export default function TippingPlatform({ streamerName = "Projector Bach" }: TippingPlatformProps) {
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');
  const [showSuccess, setShowSuccess] = useState(false);

  const quickAmounts = [5, 10, 25, 50, 100];

  const handleStripePayment = () => {
    // This would integrate with Stripe's Payment Element
    console.log('Processing Stripe payment:', { amount: tipAmount, message: tipMessage });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCryptoPayment = () => {
    // This would integrate with NOWPayments widget
    console.log('Processing crypto payment:', { amount: tipAmount, message: tipMessage });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card sx={{ 
      maxWidth: 600, 
      mx: 'auto', 
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
      border: '2px solid #FFD700',
      borderRadius: 3
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: '"Act of Rejection", sans-serif',
              color: '#FFD700',
              mb: 1,
              fontWeight: 'bold'
            }}
          >
            <Favorite sx={{ mr: 1, verticalAlign: 'middle' }} />
            Tip {streamerName}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.8 }}>
            Show your support for the 24/7 stream!
          </Typography>
        </Box>

        {showSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, backgroundColor: '#4caf50', color: 'white' }}
          >
            🎉 Thank you for your tip! Your support means everything!
          </Alert>
        )}

        {/* Payment Method Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Choose Payment Method
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant={paymentMethod === 'stripe' ? 'contained' : 'outlined'}
              onClick={() => setPaymentMethod('stripe')}
              startIcon={<CreditCard />}
              sx={{
                py: 2,
                backgroundColor: paymentMethod === 'stripe' ? '#FFD700' : 'transparent',
                color: paymentMethod === 'stripe' ? 'black' : 'white',
                borderColor: '#FFD700',
                '&:hover': {
                  backgroundColor: paymentMethod === 'stripe' ? '#FFC107' : 'rgba(255, 215, 0, 0.1)',
                }
              }}
            >
              Card / PayPal
            </Button>
            <Button
              fullWidth
              variant={paymentMethod === 'crypto' ? 'contained' : 'outlined'}
              onClick={() => setPaymentMethod('crypto')}
              startIcon={<CurrencyBitcoin />}
              sx={{
                py: 2,
                backgroundColor: paymentMethod === 'crypto' ? '#FFD700' : 'transparent',
                color: paymentMethod === 'crypto' ? 'black' : 'white',
                borderColor: '#FFD700',
                '&:hover': {
                  backgroundColor: paymentMethod === 'crypto' ? '#FFC107' : 'rgba(255, 215, 0, 0.1)',
                }
              }}
            >
              Cryptocurrency
            </Button>
          </Box>
        </Box>

        {/* Quick Amount Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Quick Amounts
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {quickAmounts.map((amount) => (
              <Chip
                key={amount}
                label={`$${amount}`}
                onClick={() => setTipAmount(amount.toString())}
                sx={{
                  backgroundColor: tipAmount === amount.toString() ? '#FFD700' : 'rgba(255, 215, 0, 0.2)',
                  color: tipAmount === amount.toString() ? 'black' : 'white',
                  '&:hover': {
                    backgroundColor: '#FFD700',
                    color: 'black'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Custom Amount */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Custom Amount"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#FFD700',
                },
                '&:hover fieldset': {
                  borderColor: '#FFC107',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              },
            }}
          />
        </Box>

        {/* Tip Message */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Leave a message (optional)"
            value={tipMessage}
            onChange={(e) => setTipMessage(e.target.value)}
            placeholder="Say something nice..."
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#FFD700',
                },
                '&:hover fieldset': {
                  borderColor: '#FFC107',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              },
            }}
          />
        </Box>

        {/* Payment Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={paymentMethod === 'stripe' ? handleStripePayment : handleCryptoPayment}
          disabled={!tipAmount || parseFloat(tipAmount) <= 0}
          sx={{
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            backgroundColor: '#FFD700',
            color: 'black',
            '&:hover': {
              backgroundColor: '#FFC107',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 215, 0, 0.3)',
              color: 'rgba(0, 0, 0, 0.5)',
            }
          }}
          startIcon={paymentMethod === 'stripe' ? <CreditCard /> : <CurrencyBitcoin />}
        >
          {paymentMethod === 'stripe' 
            ? `Tip $${tipAmount || '0'} with Card/PayPal` 
            : `Tip $${tipAmount || '0'} with Crypto`
          }
        </Button>

        {/* Supported Methods Info */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {paymentMethod === 'stripe' 
              ? '💳 Supports all major credit cards, debit cards, Apple Pay, Google Pay'
              : '₿ Supports 300+ cryptocurrencies including Bitcoin, Ethereum, USDT'
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}