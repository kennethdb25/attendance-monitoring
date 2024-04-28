/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../Context/Context';
import {
  HomeOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import './style.css';
import 'antd/dist/antd.min.css';
import Dashboard from './DashboardPage/Dashboard';
import Reports from './DashboardPage/Reports';
import Accounts from './DashboardPage/Accounts';
import Settings from './DashboardPage/Settings';
import { Drawer, Space, message } from 'antd';
import AttendanceDashboard from '../Attendance/AttendanceDashboard';

const HomeDashboard = (props) => {
  const history = useNavigate();
  const [currentActive, setCurrentActive] = useState(1);
  const [adminAccount, setAdminAccount] = useState();
  const [employeeInfo, setEmployeeInfo] = useState();
  const [timeSheetInfo, setTimeSheetInfo] = useState();
  const { loginData, setLoginData } = useContext(LoginContext);

  const { setData, getStatisticData, statisticsInfo, graphInfo } = props;

  const getInventoryData = async () => {
    const adminData = await fetch('/api/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resAdmin = await adminData.json();
    if (resAdmin.status === 200) {
      setAdminAccount(resAdmin.body);
    }

    const employeeData = await fetch('/api/employee', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resEmployee = await employeeData.json();
    if (resAdmin.status === 200) {
      setEmployeeInfo(resEmployee.body);
    }

    const timeSheetData = await fetch('/api/get-all-attendance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resTimeSheet = await timeSheetData.json();
    if (resTimeSheet.status === 200) {
      setTimeSheetInfo(resTimeSheet.body);
    }
  };

  const handleLogout = async () => {
    let token = localStorage.getItem('adminToken');
    const res = await fetch('/api/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    const data = await res.json();

    if (data.status === 201) {
      message.warn('Logging Out');
      setTimeout(() => {
        localStorage.removeItem('adminToken');
        history('/');
        setLoginData(null);
        setData(true);
      }, 3000);
    } else {
      message.error('Error Occured');
    }
  };

  return (
    <>
      <input type='checkbox' id='nav-toggle' />
      <div className='sidebar'>
        <div className='sidebar-brand'>
          <h2>
            <span className='lab la-accusoft'>
              <img
                style={{ width: '130px', height: '90px', marginLeft: '-45px' }}
                src={require('../../Assets/1.png')}
                alt='logo-dashboard'
              />
            </span>
            <span style={{ color: 'white' }}>
              <img
                style={{ width: '140px', height: '95px', marginLeft: '-45px' }}
                src={require('../../Assets/1.png')}
                alt='logo-dashboard'
              />
              UCV MONITORING
            </span>
          </h2>
        </div>
        <div className='sidebar-menu'>
          <ul>
            <li key='li1'>
              <a
                key={1}
                className={currentActive === 1 ? 'active' : 'none'}
                onClick={() => (setCurrentActive(1), getStatisticData())}
              >
                <HomeOutlined />
                <span className='las la-igloo'></span>
                <span>Dashboard</span>
              </a>
            </li>
            <li key='li2'>
              <a
                key={2}
                className={currentActive === 2 ? 'active' : 'none'}
                onClick={() => (setCurrentActive(2), getInventoryData())}
              >
                <BarChartOutlined />
                <span className='las la-clipboard-list'></span>
                <span>Reports</span>
              </a>
            </li>
            {loginData.validUser?.userType === 'Super Admin' ? (
              <>
                <li key='li3'>
                  <a
                    key={3}
                    className={currentActive === 3 ? 'active' : 'none'}
                    onClick={() => (setCurrentActive(3), getInventoryData())}
                  >
                    <UserOutlined />
                    <span className='las la-clipboard-list'></span>
                    <span>Accounts</span>
                  </a>
                </li>
                <li key='li4'>
                  <a
                    key={4}
                    className={currentActive === 4 ? 'active' : 'none'}
                    onClick={() => (setCurrentActive(4), getInventoryData())}
                  >
                    <UsergroupAddOutlined />
                    <span className='las la-clipboard-list'></span>
                    <span>Employee</span>
                  </a>
                </li>
              </>
            ) : null}
            {loginData.validUser?.userType !== 'Super Admin' ? (
              <>
                <li key='li5'>
                  <a key={5} onClick={() => setCurrentActive(5)}>
                    <ScheduleOutlined />
                    <span className='las la-clipboard-list'></span>
                    <span>Facial Recognition</span>
                  </a>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
      <div className='main-content'>
        {currentActive === 1 ? (
          <>
            <Dashboard
              handleLogout={handleLogout}
              employeeInfo={employeeInfo}
              statisticsInfo={statisticsInfo}
              graphInfo={graphInfo}
            />
          </>
        ) : currentActive === 2 ? (
          <>
            <Reports timeSheetInfo={timeSheetInfo} handleLogout={handleLogout} />
          </>
        ) : currentActive === 3 ? (
          <>
            <Accounts getInventoryData={getInventoryData} adminAccount={adminAccount} handleLogout={handleLogout} />
          </>
        ) : currentActive === 4 ? (
          <>
            <Settings getInventoryData={getInventoryData} employeeInfo={employeeInfo} handleLogout={handleLogout} />
          </>
        ) : null}
      </div>
      <Drawer
        title='FACIAL RECOGNITION'
        placement='left'
        onClose={() => setCurrentActive(1)}
        open={currentActive === 5 ? true : false}
        height='100vh'
        width='100%'
        style={{ display: 'flex', justifyContent: 'center' }}
        extra={<Space></Space>}
      >
        <AttendanceDashboard />
      </Drawer>
    </>
  );
};

export default HomeDashboard;
