import React, { useState } from "react";
import { Box } from "@mui/material";
import { Space, Drawer, Button, Form } from "antd";
import useStyles from "./style";
import LoginForm from "./LoginForm";

const LoginContent = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [section, setSection] = useState();
  const classes = useStyles();

  const onClose = () => {
    setVisible(false);
    form.resetFields();
    setSection();
  };

  const width = window.innerWidth;

  return (
    <Box className={classes.loginContainer}>
      <LoginForm />
      <Drawer
        title="Sign Up"
        placement="left"
        onClose={onClose}
        open={visible}
        height="100%"
        width={width >= 450 ? 900 : 400}
        style={{ display: "flex", justifyContent: "center" }}
        extra={<Space></Space>}
        footer={[
          <div
            style={
              width >= 450
                ? { display: "flex", justifyContent: "flex-end" }
                : { display: "flex", justifyContent: "flex-start" }
            }
          >
            <Button type="primary" onClick={() => form.submit()}>
              Confirm Registration
            </Button>
          </div>,
        ]}
      >
      </Drawer>
    </Box>
  );
};

export default LoginContent;
