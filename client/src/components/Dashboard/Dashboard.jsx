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
import Reports from "./DashboardPage/Reports";
import Accounts from "./DashboardPage/Accounts";
import Settings from "./DashboardPage/Settings";
import { Drawer, Space, message } from "antd";
import AttendanceDashboard from "../Attendance/AttendanceDashboard";

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
            <li key="li2">
              <a
                key={2}
                className={currentActive === 2 ? "active" : "none"}
                onClick={() => setCurrentActive(2)}
              >
                <BarChartOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Reports</span>
              </a>
            </li>
            <li key="li3">
              <a
                key={3}
                className={currentActive === 3 ? "active" : "none"}
                onClick={() => setCurrentActive(3)}
              >
                <UserOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Accounts</span>
              </a>
            </li>
            <li key="li4">
              <a
                key={4}
                className={currentActive === 4 ? "active" : "none"}
                onClick={() => setCurrentActive(4)}
              >
                <SettingOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Settings</span>
              </a>
            </li>
            <li key="li5">
              <a key={5} onClick={() => setCurrentActive(5)}>
                <ScheduleOutlined />
                <span className="las la-clipboard-list"></span>
                <span>Facial Recognition</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="main-content">
        {currentActive === 1 ? (
          <>
            <Dashboard />
          </>
        ): currentActive === 2 ? (
          <>
            <Reports />
          </>
        ): currentActive === 3 ? (
          <>
            <Accounts />
          </>
        ): currentActive === 4 ? (
          <>
            <Settings />
          </>
        ): null}
      </div>
      <Drawer
        title="FACIAL RECOGNITION"
        placement="left"
        onClose={() => setCurrentActive(1)}
        open={currentActive === 5 ? true : false}
        height="100vh"
        width="100%"
        style={{ display: "flex", justifyContent: "center" }}
        extra={<Space></Space>}
      >
        <AttendanceDashboard />
      </Drawer>
    </>
  );
};

export default HomeDashboard;
