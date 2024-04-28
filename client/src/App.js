import { useEffect, useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LoginContext } from './Context/Context';
import { ToastContainer } from 'react-toastify';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';
import ROUTE from './Routes/Route';
import LoginContent from './components/Login/LoginContent';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import HomeDashboard from './components/Dashboard/Dashboard';

function App() {
  const [data, setData] = useState('');
  const [statisticsInfo, setStatisticsInfo] = useState();
  const [graphInfo, setGraphInfo] = useState();
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();

  const LoginValid = async () => {
    if (localStorage.getItem('adminToken')) {
      let validToken = localStorage.getItem('adminToken');
      const res = await fetch('/api/valid', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: validToken,
        },
      });

      const data = await res.json();

      if (data.status === 401 || !data || data.status === 404) {
        console.log(data.error);
        history(ROUTE.PAGENOTFOUND);
      } else {
        console.log('Verified User');
        setLoginData(data);
        history('/dashboard');
      }
    } else {
      setData(true);
    }
  };
  const getStatisticData = async () => {
    const statisticData = await fetch('/api/get-statistics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resStatistic = await statisticData.json();
    if (resStatistic.status === 201) {
      setStatisticsInfo(resStatistic.body);
    }

    const graphData = await fetch('/api/graph-attendance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resGraph = await graphData.json();
    if (resGraph.status === 200) {
      setGraphInfo(resGraph.body);
    }
  };

  useEffect(() => {
    getStatisticData();
    setTimeout(() => {
      LoginValid();
    }, 3000);
    setTimeout(() => {
      setData(true);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ToastContainer />
      {data ? (
        <>
          <Routes>
            <Route path={ROUTE.HOMEPAGE} element={<LoginContent />} />
            <Route path={ROUTE.FORGOTPASSWORD} element={<ForgotPassword />} />
            <Route
              path={ROUTE.DASHBOARD}
              element={
                <HomeDashboard
                  setData={setData}
                  getStatisticData={getStatisticData}
                  statisticsInfo={statisticsInfo}
                  graphInfo={graphInfo}
                />
              }
            />
          </Routes>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          Loading Portal &nbsp;
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default App;
