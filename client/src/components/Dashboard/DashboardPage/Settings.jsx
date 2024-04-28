/* eslint-disable no-sequences */
import React, { useContext, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { GiHamburgerMenu } from 'react-icons/gi';
import { LoginContext } from '../../../Context/Context';
import { Col, Row, Table, Button, Space, Input, Form, message, Upload, Modal, Divider, Drawer, Typography } from 'antd';
import {
  SearchOutlined,
  ReadOutlined,
  UndoOutlined,
  PlusCircleOutlined,
  RollbackOutlined,
  LogoutOutlined,
  PlusOutlined,
  GlobalOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import './style.css';
import 'antd/dist/antd.min.css';

const { Title } = Typography;

Chart.register(CategoryScale);

const Settings = (props) => {
  const { handleLogout } = props;
  const { loginData } = useContext(LoginContext);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [viewEDetailsData, setViewEDetailsData] = useState(null);
  const [viewEDetailsModal, setViewEDetailsModal] = useState(false);
  const [employeeVisible, setEmployeeVisible] = useState(false);

  const { employeeInfo, getInventoryData } = props;

  const [form] = Form.useForm();

  const onViewEmployeeDetails = async (record, e) => {
    e.defaultPrevented = true;
    setViewEDetailsData(record);
    setViewEDetailsModal(true);
  };

  let employeeCount = 0;
  for (var key1 in employeeInfo) {
    if (employeeInfo.hasOwnProperty(key1)) {
      employeeCount++;
    }
  }

  // eslint-disable-next-line no-unused-vars
  const [paginationEmployee, setPaginationEmployee] = useState({
    defaultCurrent: 1,
    pageSize: 10,
    total: employeeCount,
  });

  const handleOpenEmployeeModal = () => {
    setEmployeeVisible(true);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, colName) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          prefix={<SearchOutlined style={{ marginRight: '10px' }} />}
          placeholder={`Search ${colName}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            borderRadius: '10px',
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 100,
            }}
          >
            Search
          </Button>
          <Button
            type='link'
            size='small'
            icon={<UndoOutlined />}
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
              confirm({
                closeDropdown: true,
              });
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : 'white',
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const onFinishEmployee = async (values) => {
    const newdata = new FormData();
    newdata.append('photos', values.photo1.file.originFileObj);
    newdata.append('photos', values.photo2.file.originFileObj);
    newdata.append('firstName', values.firstName);
    newdata.append('middleName', values.middleName);
    newdata.append('lastName', values.lastName);
    newdata.append('employeeId', values.employeeId);
    newdata.append('role', values.role);
    newdata.append('department', values.department);
    newdata.append('email', values.email);

    const res = await fetch('/api/add-employee', {
      method: 'POST',
      body: newdata,
    });
    if (res.status === 201) {
      message.success('Book Added Successfully');
      getInventoryData();
      onCloseAdmin();
    }
  };

  const onCloseAdmin = () => {
    setEmployeeVisible(false);
    form.resetFields();
  };

  const columnEmployee = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: '10%',
      ...getColumnSearchProps('employeeId', 'Employee ID'),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: '10%',
      ...getColumnSearchProps('lastName', 'Last Name'),
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: '10%',
      ...getColumnSearchProps('firstName', 'First Name'),
    },
    {
      title: 'Middle Name',
      dataIndex: 'middleName',
      key: 'middleName',
      width: '10%',
      ...getColumnSearchProps('middleName', 'Middle Name'),
    },
    {
      title: 'Created Date',
      dataIndex: 'created',
      key: 'created',
      width: '15%',
      render: (text, row) => <>{new Date(row['created']).toLocaleString()}</>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '10%',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: '10%',
    },
    {
      title: (
        <>
          <div>
            <Button
              type='primary'
              shape='round'
              icon={<PlusCircleOutlined />}
              onClick={() => handleOpenEmployeeModal()}
              style={{
                backgroundColor: '#000080',
                border: '1px solid #d9d9d9',
              }}
            >
              EMPLOYEE DATA
            </Button>
          </div>
        </>
      ),
      dataIndex: '',
      key: 'actionButton',
      width: '10%',
      render: (record) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button
              icon={<ReadOutlined />}
              type='primary'
              onClick={(e) => {
                onViewEmployeeDetails(record, e);
              }}
              style={{ backgroundColor: 'purple', border: '1px solid #d9d9d9' }}
            >
              Employee Details
            </Button>
          </div>
        </>
      ),
    },
  ];

  // IMAGE METHOD FOR SINGLE UPLOAD
  const imgprops = {
    beforeUpload: (file) => {
      const isIMG = file.type.startsWith('image/png');

      if (!isIMG) {
        message.error(`${file.name} is not an png image`);
      }

      return isIMG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const imgprops2 = {
    beforeUpload: (file) => {
      const isIMG = file.type.startsWith('image/png');

      if (!isIMG) {
        message.error(`${file.name} is not an png image`);
      }

      return isIMG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  const onPreview2 = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <>
      <header>
        <h1 style={{ marginBottom: '0px' }}>
          <label htmlFor='nav-toggle'>
            <span
              className='las la-bars'
              style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <GiHamburgerMenu style={{ cursor: 'pointer' }} />
              Employee
            </span>
          </label>
        </h1>
        <div className='user-wrapper'>
          <div
            style={{
              marginRight: '40px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // cursor: "pointer",
              gap: '20px',
            }}
          >
            <GlobalOutlined />
            WWW.UCV.EDU.PH
          </div>
          <div
            style={{
              marginRight: '60px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // cursor: "pointer",
              gap: '20px',
            }}
          >
            <PhoneOutlined />
            377-4618 | 375-2913 | 377-4616 | 377-4617
          </div>
          <div>
            <h4>{`${loginData?.validUser?.firstName} ${loginData?.validUser?.lastName}`}</h4>
            <small>{`${loginData?.validUser?.userType}`}</small>
          </div>
          <div
            onClick={() => handleLogout()}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '15px',
              color: 'red',
            }}
          >
            <LogoutOutlined />
            <h3 style={{ margin: '0', color: 'red' }}>Logout</h3>
          </div>
        </div>
      </header>
      <main>
        <Row gutter={20}>
          <Col span={24}>
            <Divider orientation='left' orientationMargin='0'>
              <h3 style={{ marginTop: '20px' }}>EMPLOYEE INFORMATIONS</h3>
            </Divider>
            <Table
              key='adminTable'
              columns={columnEmployee}
              dataSource={employeeInfo}
              // pagination={paginationAdmin}
            />
          </Col>
        </Row>

        <Modal
          key='employeeDetails'
          title='EMPLOYEE DETAILS'
          width={1200}
          open={viewEDetailsModal}
          onCancel={() => {
            setViewEDetailsModal(false);
            setViewEDetailsData();
          }}
          footer={[
            <Button
              type='primary'
              icon={<RollbackOutlined />}
              key='cancel'
              onClick={() => {
                setViewEDetailsModal(false);
                setViewEDetailsData();
              }}
            >
              Cancel
            </Button>,
          ]}
        >
          <Row>
            <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Employee ID
                  </Title>
                  <Input value={viewEDetailsData?.employeeId} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    First Name
                  </Title>
                  <Input value={viewEDetailsData?.firstName} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Middle Name
                  </Title>
                  <Input value={viewEDetailsData?.middleName} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Last Name
                  </Title>
                  <Input value={viewEDetailsData?.lastName} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Role
                  </Title>
                  <Input value={viewEDetailsData?.role} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Department
                  </Title>
                  <Input value={viewEDetailsData?.department} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Created
                  </Title>
                  <Input
                    value={new Date(viewEDetailsData?.created).toLocaleString()}
                    readOnly
                    style={{ borderRadius: '10px' }}
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Email
                  </Title>
                  <Input value={viewEDetailsData?.email} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>

        <Drawer
          key='addingEmployee'
          title='EMPLOYEE REGISTRATION'
          placement='right'
          onClose={onCloseAdmin}
          open={employeeVisible}
          height='100%'
          width='50%'
          style={{ display: 'flex', justifyContent: 'center' }}
          extra={<Space></Space>}
          footer={[
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '15px',
              }}
            >
              <Button type='primary' icon={<PlusOutlined />} onClick={() => form.submit()}>
                Confirm Registration
              </Button>
              <Button type='primary' icon={<RollbackOutlined />} onClick={onCloseAdmin}>
                Cancel
              </Button>
            </div>,
          ]}
        >
          <Form
            form={form}
            labelCol={{
              span: 8,
            }}
            layout='horizontal'
            onFinish={onFinishEmployee}
            autoComplete='off'
            style={{
              width: '100%',
            }}
          >
            <Row>
              {/* <Col xs={{ span: 0 }} md={{ span: 4 }}></Col> */}
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
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
                          message: 'Please input your first name!',
                        },
                        {
                          pattern: /^[a-zA-Z_ ]*$/,
                          message: 'First name should have no number.',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your first name' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
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
                          pattern: /^[a-zA-Z]*$/,
                          message: 'Middle name should have no number.',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your middle name' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
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
                          message: 'Please input your last name!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your last name' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
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
                          message: 'Please input your employee ID!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your employee ID' />
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label='Role'
                      name='role'
                      labelCol={{
                        span: 24,
                        //offset: 2
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Please input your role!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your role' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label='Department'
                      name='department'
                      labelCol={{
                        span: 24,
                        //offset: 2
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Please input your department!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your department' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Form.Item
                      label='Email'
                      name='email'
                      labelCol={{
                        span: 24,
                        //offset: 2
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                      rules={[
                        {
                          type: 'email',
                          required: true,
                          message: 'Please enter a valid email',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your email' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item
                      label='Employee Image 1'
                      name='photo1'
                      labelCol={{
                        span: 24,
                        //offset: 2
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Please upload an image',
                        },
                      ]}
                    >
                      <Upload {...imgprops} listType='picture-card' maxCount={1} onPreview={onPreview}>
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item
                      label='Employee Image 2'
                      name='photo2'
                      labelCol={{
                        span: 24,
                        //offset: 2
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Please upload an image',
                        },
                      ]}
                    >
                      <Upload {...imgprops2} listType='picture-card' maxCount={1} onPreview={onPreview2}>
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
            </Row>
          </Form>
        </Drawer>
      </main>
    </>
  );
};

export default Settings;
