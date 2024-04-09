/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
import React, { useContext, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import { LogoutOutlined } from "@ant-design/icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { LoginContext } from "../../../Context/Context";
import { Divider } from "antd";
import "./style.css";
import "antd/dist/antd.min.css";

Chart.register(CategoryScale);

const Dashboard = (props) => {
  const { handleLogout } = props;
  const { loginData } = useContext(LoginContext);

  const data = [
    { month: "January", count: 10 },
    { month: "February", count: 20 },
    { month: "March", count: 15 },
    { month: "April", count: 25 },
    { month: "May", count: 22 },
    { month: "June", count: 30 },
    { month: "July", count: 28 },
    { month: "August", count: 25 },
    { month: "September", count: 22 },
    { month: "October", count: 30 },
    { month: "November", count: 28 },
    { month: "December", count: 15 },
  ];

  const data2 = [
    { month: "January", count: 20 },
    { month: "February", count: 10 },
    { month: "March", count: 15 },
    { month: "April", count: 5 },
    { month: "May", count: 8 },
    { month: "June", count: 0 },
    { month: "July", count: 2 },
    { month: "August", count: 5 },
    { month: "September", count: 8 },
    { month: "October", count: 0 },
    { month: "November", count: 2 },
    { month: "December", count: 15 },
  ];

  const [chartData, setChartData] = useState({
    labels: data.map((datas) => datas.month),
    datasets: [
      {
        label: "ABSENCES",
        data: data2.map((data) => data.count),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "pink",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
          "orange",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  const [ratingsData, setRatingsData] = useState({
    labels: data.map((datas) => datas.month),
    datasets: [
      {
        label: "TOTAL TIME-IN AND TIME-OUT",
        data: data.map((data) => data.count),
        backgroundColor: ["purple", "green", "yellow", "blue", "red"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  return (
    <>
      <header>
        <h1 style={{ marginBottom: "0px" }}>
          <label htmlFor="nav-toggle">
            <span
              className="las la-bars"
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <GiHamburgerMenu style={{ cursor: "pointer" }} />
              Dashboard
            </span>
          </label>
        </h1>
        <div className="user-wrapper">
          <div>
            <h4>{`${loginData?.validUser?.firstName} ${loginData?.validUser?.lastName}`}</h4>
            <small>{`${loginData?.validUser?.userType}`}</small>
          </div>
          <div
            onClick={() => handleLogout()}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "5px",
              marginLeft: "15px",
              color: "red",
            }}
          >
            <LogoutOutlined />
            <h3 style={{ margin: "0", color: "red" }}>Logout</h3>
          </div>
        </div>
      </header>
      <main>
        <div className="cards">
          <div className="card-single">
            <div>
              <h1>{0}</h1>
              <span>Total Employee</span>
            </div>
            <div>
              <span className="las la-users"></span>
            </div>
          </div>
          <div className="card-single">
            <div>
              <h1>{0}</h1>
              <span>Time-In Today</span>
            </div>
            <div>
              <span className="las la-clipboard-list"></span>
            </div>
          </div>
          <div className="card-single">
            <div>
              <h1>{0}</h1>
              <span>Time-Out Today</span>
            </div>
            <div>
              <span className="las la-shopping-bag"></span>
            </div>
          </div>
          <div className="card-single">
            <div>
              <h1>{0}</h1>
              <span>Total Absences Yesterday</span>
            </div>
            <div>
              <span className="lab la-google-wallet"></span>
            </div>
          </div>
        </div>
        <div className="recents-grid">
          <div className="customers">
            <div className="card-header">
              <Divider orientation="left" orientationMargin="0">
                <h3>Total Time-In and Time-Out</h3>
              </Divider>
            </div>
            <div className="card-body">
              <Bar
                data={ratingsData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Company Total Time-In and Time-Out",
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="customers">
            <div className="card-header">
              <Divider orientation="left" orientationMargin="0">
                <h3>Total Absences</h3>
              </Divider>
            </div>
            <div className="card-body">
              <Bar
                data={chartData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Company Total Absences",
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
