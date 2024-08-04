import React, { ChangeEvent, useState } from 'react';
import { TextField, TextFieldProps, styled } from '@mui/material';
import { Bet } from '../contracts/ChildContract';

interface NumericTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
    // Default styles
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiFormHelperText-root': {
        color: theme.palette.error.main, // Error color for helper text
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: 'white', // Default underline color
    },
    '& .MuiInput-underline:hover': {
        borderBottomColor: 'white', // Underline color when hovered
    },
    '& .MuiInput-underline:hover:before': {
        borderBottomColor: '#2c9cdb', // Underline color when hovered
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#2c9cdb', // Underline color when active
    },
    '& .MuiInput-underline.Mui-error:after': {
        borderBottomColor: theme.palette.error.main, // Underline color in error state
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#2c9cdb', // Title color when focused
    },
    '& .MuiInputLabel-root.Mui-error': {
        color: theme.palette.error.main, // Label color in error state
    },
}));

const NumericTextField: React.FC<NumericTextFieldProps> = ({ value, onChange, ...rest }) => {
    const [isValid, setIsValid] = useState<boolean>(true)
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value === '' || /^[0-9]+([,.][0-9]*)?$/.test(value)) {
            onChange(value);
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    };

    return (
        <StyledTextField
            // error={!isValid}
            // helperText={
            //     !isValid ? (
            //         <>
            //             Amount should match example: <br />
            //             3.1415 or 3,1415
            //         </>
            //     ) : (
            //         ""
            //     )
            // }
            value={value}
            onChange={handleInputChange}
            inputProps={{ inputMode: 'decimal' }}
            variant="outlined"
            {...rest} // Pass down any additional props
        />
    );
};

export default NumericTextField;
