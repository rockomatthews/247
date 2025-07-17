'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  Box, 
  Typography, 
  Button, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Snackbar
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { 
  Close,
  ContentCopy,
  Wallet,
  CheckCircle,
  AccessTime,
  Error as ErrorIcon,
  Launch
} from '@mui/icons-material';

interface CryptoPaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  message: string;
  onSuccess: () => void;
}

interface Currency {
  id: string;
  name: string;
  network?: string;
  logo?: string;
}

interface PaymentData {
  paymentId: string;
  paymentAddress: string;
  paymentAmount: string;
  payCurrency: string;
  paymentUrl?: string;
  paymentStatus: string;
  network?: string;
  orderId: string;
}

const POPULAR_CURRENCIES = [
  { id: 'btc', name: 'Bitcoin', network: 'BTC' },
  { id: 'eth', name: 'Ethereum', network: 'ETH' },
  { id: 'usdt', name: 'Tether', network: 'ERC20' },
  { id: 'usdc', name: 'USD Coin', network: 'ERC20' },
  { id: 'bnb', name: 'Binance Coin', network: 'BNB' },
  { id: 'ada', name: 'Cardano', network: 'ADA' },
  { id: 'dot', name: 'Polkadot', network: 'DOT' },
  { id: 'sol', name: 'Solana', network: 'SOL' },
  { id: 'matic', name: 'Polygon', network: 'MATIC' },
  { id: 'avax', name: 'Avalanche', network: 'AVAX' },
];

export default function CryptoPaymentModal({ 
  open, 
  onClose, 
  amount, 
  message, 
  onSuccess 
}: CryptoPaymentModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [, setAvailableCurrencies] = useState<Currency[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [statusPolling, setStatusPolling] = useState<NodeJS.Timeout | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const startStatusPolling = useCallback(() => {
    if (statusPolling) clearInterval(statusPolling);
    
    const interval = setInterval(async () => {
      if (!paymentData?.paymentId) return;
      
      try {
        const response = await fetch(`/api/payments/nowpayments/status?paymentId=${paymentData.paymentId}`);
        if (response.ok) {
          const status = await response.json();
          setPaymentStatus(status.payment_status);
          
          if (status.payment_status === 'finished' || status.payment_status === 'partially_paid') {
            clearInterval(interval);
            onSuccess();
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 5000);
    
    setStatusPolling(interval);
  }, [paymentData, statusPolling, onSuccess]);

  useEffect(() => {
    if (open) {
      fetchAvailableCurrencies();
    }
  }, [open]);

  useEffect(() => {
    if (paymentData && paymentData.paymentId) {
      startStatusPolling();
    }
    return () => {
      if (statusPolling) {
        clearInterval(statusPolling);
      }
    };
  }, [paymentData, statusPolling, startStatusPolling]);

  const fetchAvailableCurrencies = async () => {
    setIsLoadingCurrencies(true);
    try {
      const response = await fetch('/api/payments/nowpayments');
      if (response.ok) {
        const data = await response.json();
        setAvailableCurrencies(data.currencies || []);
      }
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
      setAvailableCurrencies(POPULAR_CURRENCIES);
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  const createPayment = async () => {
    setIsCreatingPayment(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payments/nowpayments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          message: message,
          currency: selectedCurrency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const result = await response.json();
      setPaymentData(result);
      setPaymentStatus(result.paymentStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment creation failed');
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'confirming': return 'info';
      case 'confirmed': return 'success';
      case 'finished': return 'success';
      case 'partially_paid': return 'warning';
      case 'failed': return 'error';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <AccessTime />;
      case 'confirming': case 'confirmed': return <CircularProgress size={20} />;
      case 'finished': return <CheckCircle />;
      case 'partially_paid': return <AccessTime />;
      case 'failed': case 'expired': return <ErrorIcon />;
      default: return <AccessTime />;
    }
  };

  const handleClose = () => {
    if (statusPolling) clearInterval(statusPolling);
    setPaymentData(null);
    setPaymentStatus('');
    setError(null);
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '2px solid #FFD700',
            borderRadius: 3,
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: '#FFD700',
          fontWeight: 'bold'
        }}>
          <Typography variant="h5">
            🚀 Crypto Payment - ${amount} USD
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2, backgroundColor: '#f44336', color: 'white' }}
            >
              {error}
            </Alert>
          )}

          {!paymentData ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Select Your Preferred Cryptocurrency
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Choose Currency
                </InputLabel>
                <Select
                  value={selectedCurrency}
                  label="Choose Currency"
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  disabled={isLoadingCurrencies}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD700',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFC107',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD700',
                    },
                  }}
                >
                  {POPULAR_CURRENCIES.map((currency) => (
                    <MenuItem key={currency.id} value={currency.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{currency.name}</Typography>
                        <Chip 
                          label={currency.network} 
                          size="small" 
                          variant="outlined"
                          sx={{ color: '#FFD700', borderColor: '#FFD700' }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                💡 <strong>Why crypto?</strong> Fast, secure, and decentralized payments with lower fees
              </Typography>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={createPayment}
                disabled={isCreatingPayment}
                startIcon={isCreatingPayment ? <CircularProgress size={20} /> : <Wallet />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#FFD700',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#FFC107',
                  }
                }}
              >
                {isCreatingPayment ? 'Creating Payment...' : 'Create Payment'}
              </Button>
            </Box>
          ) : (
            <Box>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Chip 
                  icon={getStatusIcon(paymentStatus)}
                  label={`Status: ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}`}
                  color={getStatusColor(paymentStatus) as 'default' | 'error' | 'info' | 'success' | 'warning'}
                  sx={{ mb: 2 }}
                />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Send exactly <strong>{paymentData.paymentAmount} {paymentData.payCurrency.toUpperCase()}</strong>
                </Typography>
              </Box>

              <Paper sx={{ p: 2, mb: 3, backgroundColor: '#333', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  Payment Address:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'white', 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      flex: 1
                    }}
                  >
                    {paymentData.paymentAddress}
                  </Typography>
                  <Tooltip title="Copy Address">
                    <IconButton 
                      onClick={() => copyToClipboard(paymentData.paymentAddress)}
                      sx={{ color: '#FFD700' }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Network
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {paymentData.network || paymentData.payCurrency.toUpperCase()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Order ID
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {paymentData.orderId}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {paymentData.paymentUrl && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Launch />}
                  onClick={() => window.open(paymentData.paymentUrl, '_blank')}
                  sx={{
                    mb: 2,
                    color: '#FFD700',
                    borderColor: '#FFD700',
                    '&:hover': {
                      borderColor: '#FFC107',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    }
                  }}
                >
                  Open in Wallet
                </Button>
              )}

              <Alert 
                severity="info" 
                sx={{ backgroundColor: '#2196f3', color: 'white' }}
              >
                <Typography variant="body2">
                  ⏱️ <strong>Payment expires in 15 minutes</strong><br/>
                  💰 Send the exact amount shown above<br/>
                  ✅ Payment will be confirmed automatically
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Address copied to clipboard!"
      />
    </>
  );
}