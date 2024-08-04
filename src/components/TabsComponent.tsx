import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';

interface TabsComponentProps {
    activeTab: number;
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const CustomTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: 'transparent', // Remove the default blue indicator
    },
});

const CustomTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        backgroundColor: 'transparent',
        color: 'white', // Selected text color
        borderBottom: '2px solid #2c9cdb', // Custom underline color and thickness
    },
    '&.Mui-selected span': {
        color: 'white', // Ensures that the text inside span also gets the color
    },
    '&:not(.Mui-selected)': {
        color: 'white', // Unselected text color
    },
    '&:not(.Mui-selected) span': {
        color: 'white', // Ensures that the text inside span also gets the color
    },
    '&:focus': {
        outline: 'none', // Remove focus outline
    },
    flexGrow: 1,
}));

const TabsComponent: React.FC<TabsComponentProps> = ({ activeTab, handleTabChange }) => {
    return (
        <CustomTabs value={activeTab} onChange={handleTabChange} centered>
            <CustomTab label="Active bets" value={0}/>
            <CustomTab label="My bets" value={1} />
        </CustomTabs>
    );
};

export default TabsComponent;
