/* eslint-disable no-sequences */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../Context/Context";
import {
  HomeOutlined,
  BookOutlined,
  FileProtectOutlined,
  ReadOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import "./style.css";
import "antd/dist/antd.min.css";
import Dashboard from "./DashboardPage/Dashboard";
// import { Drawer, Space, message } from "antd";

const HomeDashboard = () => {
  const history = useNavigate();
  const [currentActive, setCurrentActive] = useState(1);

  return (
    <>
      <input type="checkbox" id="nav-toggle" />
      <div className="sidebar">
        <div className="sidebar-brand">
          <h2>
            <span className="lab la-accusoft">
              {/* <img
                // style={{ width: "70px", height: "70px", marginRight: "10px" }}
                src={require("../../Assets/logo.png")}
                alt="logo-dashboard"
              /> */}
            </span>
            <span style={{ color: "white" }}>
              {/* <img
                style={{ width: "70px", height: "70px", marginRight: "10px" }}
                src={require("../../Assets/logo.png")}
                alt="logo-dashboard"
              /> */}
              ATTENDANCE MONITORING
            </span>
          </h2>
        </div>
        <div className="sidebar-menu">
          <ul>
            <li key="li1">
              <a
                key={1}
                className={currentActive === 1 ? "active" : "none"}
                onClick={() => setCurrentActive(1)}
              >
                <HomeOutlined />
                <span className="las la-igloo"></span>
                <span>Dashboard</span>
              </a>
            </li>
            {/* <li key="li2">
              <a
                key={2}
                className={currentActive === 2 ? "active" : "none"}
                onClick={() => (
                  setCurrentActive(2)
                )}
              >
                <FileProtectOutlined />
                <span className="las la-users"></span>
                <span>Available Books</span>
              </a>
            </li>
            <li key="li3">
              <a
                key={3}
                className={currentActive === 3 ? "active" : "none"}
                onClick={() => (
                  setCurrentActive(3)
                )}
              >
                <BookOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Borrowed Books</span>
              </a>
            </li>
            <li key="li4">
              <a
                key={4}
                className={currentActive === 4 ? "active" : "none"}
                onClick={() => (
                  setCurrentActive(4)
                )}
              >
                <ReadOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Shelf</span>
              </a>
            </li> */}
            {/* <li key="li5">
              <a
                key={5}
                className={currentActive === 5 ? "active" : "none"}
                onClick={() => (
                  setCurrentActive(5)
                )}
              >
                <FileDoneOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Catalog</span>
              </a>
            </li> */}
            <li key="li6">
              <a
                key={6}
                className={currentActive === 6 ? "active" : "none"}
                onClick={() => setCurrentActive(6)}
              >
                <BarChartOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Reports</span>
              </a>
            </li>
            <li key="li7">
              <a
                key={7}
                className={currentActive === 7 ? "active" : "none"}
                onClick={() => setCurrentActive(7)}
              >
                <UserOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Accounts</span>
              </a>
            </li>
            <li key="li8">
              <a
                key={8}
                className={currentActive === 8 ? "active" : "none"}
                onClick={() => setCurrentActive(8)}
              >
                <SettingOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Settings</span>
              </a>
            </li>
            <li key="li9">
              <a key={9} onClick={() => setCurrentActive(9)}>
                <ScheduleOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Attendance Dashboard</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="main-content">
        <Dashboard />
      </div>
    </>
  );
};

export default HomeDashboard;
