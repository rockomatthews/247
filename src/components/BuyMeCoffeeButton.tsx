'use client';

import { Button } from '@mui/material';
import { Coffee } from '@mui/icons-material';

export default function BuyMeCoffeeButton() {
  const handleClick = () => {
    window.open('https://buymeacoffee.com/projectorbach', '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      startIcon={<Coffee />}
      sx={{
        position: 'fixed',
        top: '80px', // Below the header
        left: '20px',
        zIndex: 1000,
        backgroundColor: '#FFDD44',
        color: '#000',
        fontWeight: 'bold',
        borderRadius: '25px',
        padding: '8px 16px',
        fontSize: '0.9rem',
        textTransform: 'none',
        boxShadow: '0 4px 12px rgba(255, 221, 68, 0.4)',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: '#FFD700',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(255, 221, 68, 0.6)',
        },
        '&:active': {
          transform: 'translateY(0px)',
        },
        // Make it responsive
        '@media (max-width: 768px)': {
          fontSize: '0.8rem',
          padding: '6px 12px',
          top: '70px',
          left: '10px',
        },
        // Hide on very small screens to avoid cluttering
        '@media (max-width: 480px)': {
          display: 'none',
        },
      }}
    >
      Buy me a coffee ☕
    </Button>
  );
}