/* eslint-disable no-sequences */
import React, { useContext, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { LogoutOutlined } from "@ant-design/icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { LoginContext } from "../../../Context/Context";
import "./style.css";
import "antd/dist/antd.min.css";

Chart.register(CategoryScale);

const Reports = () => {
  const { loginData } = useContext(LoginContext);
  const [img, setImg] = useState();

  return (
    <>
      <header>
        <h1>
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
              Reports
            </span>
          </label>
        </h1>
        <div className="user-wrapper">
          <div
            style={{
              marginRight: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // cursor: "pointer",
            }}
          ></div>
          <img src={img} width="40px" height="40px" alt="" />
          <div>
            <h4>{`${loginData?.validUser?.firstName} ${loginData?.validUser?.lastName}`}</h4>
            <small>{`${loginData?.validUser?.userType}`}</small>
          </div>
          <div
            // onClick={() => handleLogout()}
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
      <main></main>
    </>
  );
};

export default Reports;
