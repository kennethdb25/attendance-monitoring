import React, { useEffect, useState } from "react";
import useStyles from "./style";
import { Box } from "@mui/material";
import {
  PageHeader,
  Descriptions,
  Row,
  Col,
  Input,
  Image,
  Divider,
} from "antd";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  UserOutlined,
  InfoCircleOutlined,
  MailOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "./styles.css";

const AttendanceDashboard = () => {
  let time = new Date().toLocaleTimeString();
  let date = new Date().toDateString();
  const classes = useStyles();
  const [viewDeatailsImg, setViewDeatailsImg] = useState();
  const [ctime, setCtime] = useState(time);
  const [cdate, setCdate] = useState(date);
  const [totalStudents, seTotalStudents] = useState("");
  const [totalTimeIn, setTotalTimeIn] = useState("");
  const [totalTimeOut, setTotalTimeOut] = useState("");

  const updateTime = () => {
    time = new Date().toLocaleTimeString();
    date = new Date().toDateString();
    setCtime(time);
    setCdate(date);
  };

  setInterval(updateTime, 1000);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader-library", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(successReadLibraryCard, errorReadLibraryCard);

    function successReadLibraryCard(result) {
      scanner.pause();
      setTimeout(() => {
        scanner.resume();
        // setStudentInfo("");
        // setViewDeatailsImg();
        // getAttendaceAnalytics();
      }, 5000);
      // setScannerOpen(false);
      // setEnableBookScanBtn(false);
      // fetchStudentData(result);
    }

    function errorReadLibraryCard(error) {
      // scanner.clear();
      // console.error(error);
    }
  }, []);

  return (
    <Box className={classes.attendanceContainer}>
      <PageHeader
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
        ghost={false}
        title="ATTENDANCE MONITORING"
      >
        <Descriptions title={"ATTENDANCE ANALYSIS"} size="medium" column={3}>
          <Descriptions.Item label="Total Employee(Today)">
            {totalStudents}
          </Descriptions.Item>
          <Descriptions.Item label="Total Time-in(Today)">
            {totalTimeIn}
          </Descriptions.Item>
          <Descriptions.Item label="Total Time-out(Today)">
            {totalTimeOut}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={
            <Divider>
              <h3>EMPLOYEE DETAILS</h3>
            </Divider>
          }
          size="medium"
          column={2}
        >
          <Descriptions.Item label="EMPLOYEE INFO" style={{ margin: 20 }}>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout="vertical">
                  <Input
                    // value={studName}
                    prefix={<UserOutlined style={{ marginRight: "10px" }} />}
                    placeholder="Employee Name"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <Input
                    // value={studentInfo?.studentId}
                    prefix={<UserOutlined style={{ marginRight: "10px" }} />}
                    placeholder="Employee ID"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <Input
                    // value={studentInfo?.email}
                    prefix={<MailOutlined style={{ marginRight: "10px" }} />}
                    placeholder="Email Address"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <Input
                    // value={studentInfo?.grade}
                    prefix={
                      <InfoCircleOutlined style={{ marginRight: "10px" }} />
                    }
                    placeholder="Department"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <Input
                    // value={studentInfo?.section}
                    prefix={
                      <InfoCircleOutlined style={{ marginRight: "10px" }} />
                    }
                    placeholder="Role"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                {viewDeatailsImg ? (
                  <>
                    <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                      <Input
                        // value={attendanceData.attendanceStatus}
                        prefix={
                          <UserOutlined style={{ marginRight: "10px" }} />
                        }
                        placeholder="Student ID"
                        style={{ borderRadius: "10px", marginTop: "15px" }}
                        readOnly
                      />
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                      <Input
                        // value={new Date(
                        //   attendanceData.attendanceDate
                        // ).toLocaleString()}
                        prefix={
                          <UserOutlined style={{ marginRight: "10px" }} />
                        }
                        placeholder="Student ID"
                        style={{ borderRadius: "10px", marginTop: "15px" }}
                        readOnly
                      />
                    </Col>
                  </>
                ) : null}
                {!viewDeatailsImg ? (
                  <Col
                    xs={{ span: 24 }}
                    md={{ span: 24 }}
                    layout="vertical"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginTop: "30px",
                      backgroundColor: "blue",
                      // padding: 10,
                      borderRadius: "10px",
                    }}
                  >
                    <h1
                      style={{
                        marginBottom: 0,
                        color: "white",
                      }}
                    >
                      <FieldTimeOutlined /> {ctime}
                    </h1>
                    <h1
                      style={{
                        marginBottom: 0,
                        color: "white",
                      }}
                    >
                      <CalendarOutlined /> {cdate}
                    </h1>
                  </Col>
                ) : null}
              </Row>
              {viewDeatailsImg ? (
                <>
                  <Row
                    gutter={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Col xs={{ span: 24 }} md={{ span: 24 }} layout="vertical">
                      <Image
                        height={300}
                        width={300}
                        src={viewDeatailsImg}
                        alt="Student Image"
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </Col>
          </Descriptions.Item>
          <Descriptions.Item label="FACIAL SCANNER">
            <div
              id="reader-library"
              style={{ height: 500, width: 600, margin: 20 }}
            ></div>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </Box>
  );
};

export default AttendanceDashboard;
