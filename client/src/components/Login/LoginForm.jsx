import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Row, Col, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Box, Link } from "@mui/material";
import useStyles from "./style";
import "antd/dist/antd.min.css";

const { Title } = Typography;

const LoginForm = () => {
  const classes = useStyles();
  const history = useNavigate();

  const onFinish = async (values) => {
    const data = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();
    if (res.status === 201) {
      message.success("Logged In");
      setTimeout(() => {
        let arry = res.result.userEmail.tokens;
        let lastElement = arry[arry.length - 1];
        localStorage.setItem("adminToken", lastElement.token);
        window.location.reload();
        setTimeout(() => {
          history("/dashboard");
        }, 1000);
      }, 3000);
    } else {
      message.error(res.message);
    }
  };
  const onFinishFailed = async (error) => {
    console.log("Failed:", error);
  };

  return (
    <Box className={classes.loginCard}>
      <Box alignItems="center">
        <Title level={2}>ACCOUNT LOGIN</Title>
      </Box>
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className={classes.Form}
      >
        <Form.Item
          name="email"
          rules={[
            {
              message: "Email is required",
              required: true,
            },
            { whitespace: true },
            { type: "email", message: "Please enter a valid email" },
          ]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined style={{ marginRight: "10px" }} />}
            placeholder="Please enter your email address"
            style={{ borderRadius: "10px" }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Password is required!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ marginRight: "10px" }} />}
            placeholder="Please enter your password"
            style={{ borderRadius: "10px" }}
          />
        </Form.Item>
        <Box>
          <Row gutter={8}>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <Form.Item>
                  <Typography
                    component={Link}
                    style={{ textDecoration: "none", color: "gray" }}
                    href="/forgot-password"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    Forgot Password?
                  </Typography>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Form.Item>
            <div className={classes.loginDetails}>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  backgroundColor: "blue",
                  border: "1px solid #d9d9d9",
                  padding: '20px'
                }}
              >
                <span style={{ fontSize: "16px" }}>LOGIN</span>
              </Button>
            </div>
          </Form.Item>
        </Box>
      </Form>
    </Box>
  );
};

export default LoginForm;
