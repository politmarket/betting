// HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchContractsWithData, fetchMyBets } from '../contracts/Getters';
import TabsComponent from '../components/TabsComponent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { Box, CircularProgress } from '@mui/material';
import { Bet } from '../contracts/ChildContract';
import { BetInfo } from '../contracts/wrappers';
import CenterCropImage from '../components/CenterCropImage';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import CoefficientContainer from '../components/CoefContainer';
import { fromNano } from 'ton-core';

const ListPage: React.FC = () => {

  //fetching data start 
  //load list of contracts
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Bet[]>([]);
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();


  const loadContractsData = async (type: number) => {
    const retry = async () => {
      try {
        setLoading(true);
        setActiveTab(0)
        const result = await fetchContractsWithData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    try {
      console.log("type: ", type)
      if (type == 0) {
        const result = await fetchContractsWithData();
        setData(result);
      } else {
        const result = await fetchMyBets(userFriendlyAddress);
        setData(result);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Unknown address type")) {
          console.error("Caught the specific 'Unknown address type' error:", error);
          retry()
        } else {
          console.error("Caught a different error:", error);
        }
      } else {
        console.error("Caught a non-error object:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContractsData(activeTab);
  }, []);
  //fetching data end 

  //navigation start 
  const navigate = useNavigate();
  const handleClick = (item: Bet) => {
    navigate('/bet/'.concat(item.address), { state: serializeBet(item) });
  };
  //navigation end 

  //tabs start
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue == 1 && !tonConnectUI.connected) {
      tonConnectUI.openModal()
      return;
    }

    if (loading) {
      setActiveTab(activeTab)
      return;
    }
    if (activeTab != newValue) {
      setActiveTab(newValue);
      loadContractsData(newValue)
    }
  };
  //tabs end

  return (
    <div className='listpage'>

      <TabsComponent activeTab={activeTab} handleTabChange={handleTabChange} />

      <div className="list">
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            marginTop: '28px'
          }}>
            <CircularProgress sx={{ color: '#2c9cdb' }} />
          </div>
        ) : (
          <List sx={{ width: '100%' }}>
            {data.map((item, i) => (
              <div key={i}>
                <ListItem alignItems="center" onClick={() => handleClick(item)}>
                  <BetItem betInfo={item.betInfo} />
                </ListItem>
              </div>
            ))}
          </List>
        )
        }
      </div>
    </div >
  );
}

const BetItem: React.FC<{ betInfo: BetInfo }> = ({ betInfo }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#1d2b39',
        color: 'white',
        width: '100%',
        textAlign: 'center',
        borderRadius: '10px',
        padding: '16px',
        boxShadow: 1,
        border: '1px solid #2c3f50'
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>

        <CenterCropImage imageUrl={betInfo.image} width='48px' height='48px' />
        <Typography variant="body1" sx={{ color: 'white' }}>
          {betInfo.title}
        </Typography>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          {"TON ".concat((fromNano(betInfo.total_bet_a + betInfo.total_bet_b)).toString())}
        </Typography>
        <CoefficientContainer greenValue={betInfo.odds_a} redValue={betInfo.odds_b} />
      </div>
    </Box>
  );
}


function serializeBet(bet: Bet): string {
  return JSON.stringify(bet, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export default ListPage;