import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Input, Row, Col, Typography, Button } from "antd";
import { MailOutlined, InboxOutlined, LockOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import emailjs from "@emailjs/browser";
import useStyles from "./style";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.min.css";

const { Title } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondtStep] = useState(false);
  const [thirdStep, setThirdStep] = useState(false);
  const [fourthStep, setFourthStep] = useState(false);
  const [sendButtonLabel, setSendButtonLabel] = useState("SEND");

  const classes = useStyles();
  const history = useNavigate();

  const onStepOne = async (values) => {
    const data = await fetch(`/student/forgot-password/${values.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    if (res.status === 200) {
      toast.success(res.body, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      setEmail(values.email);
      setFirstStep(false);
      setSecondtStep(true);
      setOTP(Math.floor(100000 + Math.random() * 900000));
    } else {
      toast.error(res.body, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
    }
  };

  const onStepOneFailed = (error) => {
    toast.error("Something went wrong, please try again later", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 500,
    });
  };

  const sendOTP = () => {
    setSendButtonLabel("RESEND");
    emailjs.send(
      "service_in36rqr",
      "template_x4esevh",
      {
        otp: OTP,
        email: email,
      },
      "dDsfpQqNAM0v0YbNC"
    );
  };

  const onStepTwo = (values) => {
    // eslint-disable-next-line eqeqeq
    if (values.code == OTP) {
      toast.success("OTP VERIFIED", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      setSecondtStep(false);
      setThirdStep(true);
      setSendButtonLabel("Send");
    } else {
      toast.error("INVALID OTP", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  };

  const onStepTwoFailed = (error) => {
    toast.error("Something went wrong, please try again later", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 500,
    });
  };

  const onStepThird = async (values) => {
    const data = await fetch(`/student/forgot-password/${values.email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const res = await data.json();
    if (res.status === 200) {
      toast.success(res.body, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      setThirdStep(false);
      setFourthStep(true);
      form.resetFields();
    }
  };

  const onStepThirdFailed = (error) => {};

  const backToLogin = () => {
    setFourthStep(false);
    setFirstStep(true);
    history("/");
  };

  return (
    <Box className={classes.forgotPassContainer}>
      <Box className={classes.forgotPassCard}>
        <Box paddingTop="20px">
          <Title level={2}>Forgot your Password?</Title>
        </Box>
        {firstStep ? (
          <>
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{
                remember: true,
              }}
              onFinish={onStepOne}
              onFinishFailed={onStepOneFailed}
              style={{ width: "80%" }}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please input your email!",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<MailOutlined style={{ marginRight: "10px" }} />}
                  placeholder="Please enter your email address"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Item>
              <Row
                gutter={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>SUBMIT</span>
                </Button>
              </Row>
            </Form>
          </>
        ) : null}
        {secondStep ? (
          <>
            <Form
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{
                remember: true,
              }}
              onFinish={onStepTwo}
              onFinishFailed={onStepTwoFailed}
              autoComplete="off"
              className={classes.Form}
            >
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your OTP!",
                  },

                  { min: 6 },
                  { max: 6 },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<InboxOutlined style={{ marginRight: "10px" }} />}
                  placeholder="Please verify the 6-digits code sent to your email"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Item>
              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Button
                    htmlType="submit"
                    type="primary"
                    style={{
                      border: "1px solid #d9d9d9",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>SUBMIT</span>
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      border: "1px solid #d9d9d9",
                    }}
                    onClick={sendOTP}
                  >
                    {sendButtonLabel}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        ) : null}
        {thirdStep ? (
          <>
            <Typography fontSize="16px" paddingTop="20px">
              You can now reset your password
            </Typography>
            <Form
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              onFinish={onStepThird}
              onFinishFailed={onStepThirdFailed}
              autoComplete="off"
              className={classes.Form}
              initialValues={{ email: email }}
            >
              <Form.Item hidden label="Email" name="email">
                <Input value={email} />
              </Form.Item>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Form.Item
                    name="password"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                      { whitespace: true },
                      { min: 8 },
                      { max: 26 },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,26}$/,
                        message:
                          "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ marginRight: "10px" }} />}
                      placeholder="Password"
                      style={{ borderRadius: "10px" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Form.Item
                    name="confirmPassword"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                      //offset: 2
                    }}
                    hasFeedback
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject("Passwords does not matched.");
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ marginRight: "10px" }} />}
                      placeholder="Confirm Password"
                      style={{ borderRadius: "10px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{
                    border: "1px solid #d9d9d9",
                  }}
                >
                  CONFIRM
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : null}
        {fourthStep ? (
          <>
            <Typography fontSize="16px" paddingTop="20px">
              Recovery of password has been successfully done!
            </Typography>
            <Button
              type="primary"
              style={{
                border: "1px solid #d9d9d9",
                marginTop: "20px",
              }}
              onClick={backToLogin}
            >
              BACK TO LOGIN
            </Button>
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
