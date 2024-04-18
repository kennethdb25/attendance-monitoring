/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
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
  Button,
  message,
} from "antd";
import * as faceapi from "face-api.js";
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
  const [labels, setLabels] = useState();
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [timeInDisabled, setTimeInDisabled] = useState(false);
  const [timeOutDisabled, setTimeOutDisabled] = useState(false);
  const [attendanceData, setAttendanceData] = useState("");

  const videoRef = useRef();
  // const canvasRef = useRef();
  useEffect(() => {
    getEmployeeId();
    setTimeout(() => {
      startWebcam();
      videoRef && loadModels();
    }, 2000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEmployeeId = async () => {
    const res = await fetch("/api/get-employeeId", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.status === 200) {
      setLabels(data.body);
    }
  };

  const onProcessAttendance = async (employeeId, attendanceStats) => {
    console.log(attendanceStats);
    const request = { employeeId: employeeId, status: attendanceStats };

    const data = await fetch("/api/add/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const res = await data.json();

    if (res.status === 201) {
      message.success("Attendance Successfully Added!");
      setAttendanceData(res.body);
      setTimeout(() => {
        setAttendanceData();
      }, 3000);
    } else {
      message.error(
        "Something went wrong, please contact the HR or Tech Support!"
      );
    }
  };

  const onClickTimeIn = () => {
    setAttendanceStatus("TIME-IN");
    onPlayVideo();
    setTimeOutDisabled(true);
  };

  const onClickTimeOut = () => {
    setAttendanceStatus("TIME-OUT");
    onPlayVideo();
    setTimeInDisabled(true);
  };

  const loadModels = () => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    ]).then(startWebcam);
  };

  function startWebcam() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function stopWebcam() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        stream.getVideoTracks().forEach((track) => {
          track.stop();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getLabeledFaceDescriptions() {
    // const labels = ["Kenneth", "Felipe"];
    return Promise.all(
      labels.map(async (label) => {
        console.log(label);
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(
            `/labels/${label.employeeId}/${i}.png`
          );
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(
          label.employeeId,
          descriptions
        );
      })
    );
  }

  const onPlayVideo = async () => {
    setTimeout(async () => {
      const labeledFaceDescriptors = await getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      document.getElementById("scanner").append(canvas);

      faceapi.matchDimensions(canvas, {
        width: 940,
        height: 650,
      });
      // setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });
      results.forEach((result, i) => {
        console.log(result.label);
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result,
        });
        // drawBox.draw(canvas);
        if (result.label !== "unknown") {
          console.log(attendanceStatus);
          onProcessAttendance(result.label, attendanceStatus);
          setTimeout(() => {
            // setAttendanceStatus();
            setTimeInDisabled(false);
            setTimeOutDisabled(false);
          }, 3000);
        } else {
          message.error(
            "Please try again and make sure to face in front of the camera!"
          );
          // setAttendanceStatus();
          setTimeInDisabled(false);
          setTimeOutDisabled(false);
        }
      });
      // }, 10000);
    }, 2000);
  };

  const updateTime = () => {
    time = new Date().toLocaleTimeString();
    date = new Date().toDateString();
    setCtime(time);
    setCdate(date);
  };

  setInterval(updateTime, 1000);
  let employeeName = attendanceData
    ? `${attendanceData?.lastName}, ${attendanceData?.firstName} ${attendanceData.middleName}`
    : "";
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
                    value={employeeName}
                    prefix={<UserOutlined style={{ marginRight: "10px" }} />}
                    placeholder="Employee Name"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <Input
                    value={attendanceData?.employeeId}
                    prefix={<UserOutlined style={{ marginRight: "10px" }} />}
                    placeholder="Employee ID"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <Input
                    value={attendanceData?.email}
                    prefix={<MailOutlined style={{ marginRight: "10px" }} />}
                    placeholder="Email Address"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <Input
                    value={attendanceData?.department}
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
                    value={attendanceData?.role}
                    prefix={
                      <InfoCircleOutlined style={{ marginRight: "10px" }} />
                    }
                    placeholder="Role"
                    style={{ borderRadius: "10px", marginTop: "15px" }}
                    readOnly
                  />
                </Col>

                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      type="primary"
                      style={{ width: "150px" }}
                      onClick={() => onClickTimeIn()}
                      disabled={timeInDisabled}
                    >
                      TIME-IN
                    </Button>
                  </div>
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 12 }} layout="vertical">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      type="primary"
                      style={{ width: "150px" }}
                      onClick={() => onClickTimeOut()}
                      disabled={timeOutDisabled}
                    >
                      TIME-OUT
                    </Button>
                  </div>
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
          <Descriptions.Item label="SCANNER">
            <div className="display-flex justify-content-center" id="scanner">
              <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </Box>
  );
};

export default AttendanceDashboard;
