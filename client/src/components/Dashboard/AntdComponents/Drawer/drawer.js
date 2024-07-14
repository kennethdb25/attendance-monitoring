import { Button, Typography, Space, Drawer, Form, Row, Col, Input } from 'antd';
import { FormOutlined, RollbackOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const EmployeeUpdateDetail = (props) => {
  const { onCloseUpdate, updateOpen, form, onFinishUpdate, onFinishUpdateFailed, initialValues, onConfirmUpdate } =
    props;
  return (
    <Drawer
      title='UPDATE EMPLOYEE INFORMATION'
      key='updateeBook'
      placement='right'
      onClose={onCloseUpdate}
      open={updateOpen}
      height='100%'
      width='100%'
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '342px',
      }}
      footer={[
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            icon={<FormOutlined />}
            type='primary'
            key='update'
            onClick={() => onConfirmUpdate()}
            style={{ marginRight: '10px' }}
          >
            Update
          </Button>
          <Button type='primary' icon={<RollbackOutlined />} key='cancel' onClick={() => onCloseUpdate()}>
            Cancel
          </Button>
        </div>,
      ]}
      extra={<Space></Space>}
    >
      <div className='custom-form'>
        <Form
          form={form}
          labelCol={{
            span: 12,
          }}
          initialValues={initialValues}
          layout='horizontal'
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishUpdateFailed}
          autoComplete='off'
          style={{
            width: '100%',
          }}
        >
          <Row>
            <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <Title
                level={5}
                style={{
                  marginTop: '20px',
                }}
              >
                PERSONAL INFORMATION
              </Title>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Form.Item
                    label='First Name'
                    name='firstName'
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
                        message: 'Please input first name!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter first name' />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Form.Item
                    label='Middle Name'
                    name='middleName'
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
                        message: 'Please input middle name!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter middle name' />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Form.Item
                    label='Last Name'
                    name='lastName'
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
                        message: 'Please input last name!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter Last Name' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Form.Item
                    label='Employee ID'
                    name='employeeId'
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
                        message: 'Please input Employee ID!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter Employee ID' />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Form.Item
                    label='Designation'
                    name='role'
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
                        message: 'Please input designation!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter Designation' />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Form.Item
                    label='Department'
                    name='department'
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
                        message: 'Please input department!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter Department' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Form.Item
                    label='Email'
                    name='email'
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
                        message: 'Please input email!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter Email Address' />
                  </Form.Item>
                </Col>
              </Row>
              <Title
                level={5}
                style={{
                  marginTop: '20px',
                }}
              >
                COMPANY INFORMATION
              </Title>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Form.Item
                    label='Employer Name'
                    name='employerName'
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
                        message: 'Please input employer name!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter Employer Name' />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Form.Item
                    label='Employer Address'
                    name='employerAddress'
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
                        message: 'Please input employer address!',
                      },
                    ]}
                  >
                    <Input placeholder='Enter Employer Address' />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Form.Item
                    label='Employer Contact Details'
                    name='employerContact'
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
                        message: 'Please input your Employer Contact Details!',
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: 'Should be a number',
                      },
                      { min: 11 },
                      { max: 11 },
                    ]}
                  >
                    <Input placeholder='Enter your company 11-digits phone number' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </Drawer>
  );
};
