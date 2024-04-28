/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
import React, { useContext, useState } from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { LogoutOutlined, GlobalOutlined, PhoneOutlined } from '@ant-design/icons';
import { GiHamburgerMenu } from 'react-icons/gi';
import { LoginContext } from '../../../Context/Context';
import { Divider, Select } from 'antd';
import './style.css';
import 'antd/dist/antd.min.css';

Chart.register(CategoryScale);

const Dashboard = (props) => {
  const { handleLogout, statisticsInfo, graphInfo } = props;
  const { loginData } = useContext(LoginContext);

  const [chartData, setChartData] = useState({
    labels: graphInfo.attendanceGraphTimeOut.map((datas) => datas._id),
    datasets: [
      {
        label: 'TOAL TIME-OUT',
        data: graphInfo.attendanceGraphTimeOut.map((data) => data.count),
        backgroundColor: ['rgba(75,192,192,1)', 'pink', '#50AF95', '#f3ba2f', '#2a71d0', 'orange'],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });

  const [ratingsData, setRatingsData] = useState({
    labels: graphInfo.attendanceGraphTimeIn.map((datas) => datas._id),
    datasets: [
      {
        label: 'TOTAL TIME-IN',
        data: graphInfo.attendanceGraphTimeIn.map((data) => data.count),
        backgroundColor: ['purple', 'green', 'yellow', 'blue', 'red'],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });
  return (
    <>
      <header>
        <h1 style={{ marginBottom: '0px' }}>
          <label htmlFor='nav-toggle'>
            <span
              className='las la-bars'
              style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <GiHamburgerMenu style={{ cursor: 'pointer' }} />
              Dashboard
            </span>
          </label>
        </h1>
        <div className='user-wrapper'>
          <div
            style={{
              marginRight: '40px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // cursor: "pointer",
              gap: '20px',
            }}
          >
            <GlobalOutlined />
            WWW.UCV.EDU.PH
          </div>
          <div
            style={{
              marginRight: '60px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // cursor: "pointer",
              gap: '20px',
            }}
          >
            <PhoneOutlined />
            377-4618 | 375-2913 | 377-4616 | 377-4617
          </div>
          <div>
            <h4>{`${loginData?.validUser?.firstName} ${loginData?.validUser?.lastName}`}</h4>
            <small>{`${loginData?.validUser?.userType}`}</small>
          </div>
          <div
            onClick={() => handleLogout()}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '15px',
              color: 'red',
            }}
          >
            <LogoutOutlined />
            <h3 style={{ margin: '0', color: 'red' }}>Logout</h3>
          </div>
        </div>
      </header>
      <main>
        <div className='cards'>
          <div className='card-single'>
            <div>
              <h1>{statisticsInfo.getTotalEmployee}</h1>
              <span>Total Employee</span>
            </div>
            <div>
              <span className='las la-users'></span>
            </div>
          </div>
          <div className='card-single'>
            <div>
              <h1>{statisticsInfo.totalTimeinToday.length}</h1>
              <span>Time-In Today</span>
            </div>
            <div>
              <span className='las la-clipboard-list'></span>
            </div>
          </div>
          <div className='card-single'>
            <div>
              <h1>{statisticsInfo.totalTimeOutToday.length}</h1>
              <span>Time-Out Today</span>
            </div>
            <div>
              <span className='las la-shopping-bag'></span>
            </div>
          </div>
          <div className='card-single'>
            <div>
              <h1>{statisticsInfo.totalAbsencesYesterday}</h1>
              <span>Total Absences Today</span>
            </div>
            <div>
              <span className='lab la-google-wallet'></span>
            </div>
          </div>
        </div>
        <div className='recents-grid'>
          <div className='customers'>
            <div className='card-header'>
              <Divider orientation='left' orientationMargin='0'>
                <h3>Total Time-In</h3>
              </Divider>
            </div>
            <div className='card-body'>
              <Bar
                data={ratingsData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Employee Total Time-In',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className='customers'>
            <div className='card-header'>
              <Divider orientation='left' orientationMargin='0'>
                <h3>Total Time-Out</h3>
              </Divider>
            </div>
            <div className='card-body'>
              <Bar
                data={chartData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Employee Total Time-Out',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
