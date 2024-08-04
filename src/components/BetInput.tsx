import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Box, Button, Typography } from '@mui/material';
import NumericTextField from './NumericTextField';
import { Bet } from '../contracts/ChildContract';

interface InputProps {
  onConfirm: (amount: string) => void;
  bet: Bet | null;
  betType: string;
}

const BetInput: React.FC<InputProps> = ({ onConfirm, bet, betType }) => {
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setInputValue] = useState<string>('1.00');
  const [estimate, setEstimate] = useState<string>('0');

  useEffect(() => {
    if (bet != null) {
      setEstimate(calculateEstimate(bet, betType, Number(amount)).toString())
    }
  }, [betType, bet]);

  const handleSubmit = () => {
    if (!tonConnectUI.connected) {
      tonConnectUI.openModal()
      return;
    }
    console.log("amount? - ", amount)
    if (amount !== "") {
      try {
        onConfirm(amount)
      } catch (error) {
        console.log("Sending betting transaction error: ", error)
      }
    }
  }

  const handleAmountChange = (val: string) => {
    if (bet != null) {
      setEstimate(calculateEstimate(bet, betType, Number(val)).toString())
    }
    setInputValue(val)
  }

  return (
    <Box
      sx={{
        display: 'flex', // Use flexbox layout to arrange children horizontally
        alignItems: 'center', // Align items vertically centered
        width: '100%', // Ensure the Box takes full width of its container
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <NumericTextField
          value={amount}
          id="betinput"
          label="Enter amount"
          inputProps={{ inputMode: 'decimal' }}
          variant="standard"
          onChange={handleAmountChange}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: '#848d91', mr: 1, }}
          >
            Potential return:
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#25af60', }}
          >
            {estimate}
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          ml: 2, // Margin to the left of the button
          backgroundColor: '#2c9cdb',
          color: 'white',
          borderColor: '#25af60', // Set the default border color
          borderRadius: 20, // Adjust the value to control the roundness
          padding: '8px 16px', // Adjust padding as needed

          '&:hover': {
            borderColor: '#25af60', // Ensure the border color is consistent on hover
            backgroundColor: 'rgba(44, 156, 219, 1)' // Optional: Light background color on hover
          },
          '&.Mui-focused': {
            borderColor: '#25af60', // Ensure the border color is consistent when focused
            boxShadow: `0 0 0 2px rgba(44, 156, 219, 1)` // Optional: Shadow for focus state
          },
          '&:focus': {
            outline: 'none', // Remove focus outline
          },
        }}
      >
        Submit
      </Button>
    </Box>

  );
};

function calculateEstimate(bet: Bet, betType: string, amount: number): string | number {
  const totalBetA = Number(bet.betInfo.total_bet_a);
  const totalBetB = Number(bet.betInfo.total_bet_b);

  if (isNaN(totalBetA) || isNaN(totalBetB) || amount <= 0) {
    return amount;
  }

  let odds = 0;

  if (betType === '1') {
    if (totalBetA === 0) {
      return amount;
    }
    odds = ((totalBetB * 1000) / (totalBetA + amount)) * 90 / 100;
  } else if (betType === '2') {
    if (totalBetB === 0) {
      return amount;
    }
    odds = ((totalBetA * 1000) / (totalBetB + amount)) * 90 / 100;
  } else {
    return amount;
  }

  if (isNaN(odds)) {
    return amount;
  }

  let estimate = (amount * odds) / 1000 + amount;

  return isNaN(estimate) ? amount : estimate.toFixed(3);
}

export default BetInput;