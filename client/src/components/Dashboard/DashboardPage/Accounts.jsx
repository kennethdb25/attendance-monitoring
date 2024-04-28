import React, { useContext, useRef, useState } from 'react';
import { LoginContext } from '../../../Context/Context';
import { Col, Row, Table, Button, Space, Input, Form, message, Modal, Divider, Drawer, Typography, Select } from 'antd';
import {
  SearchOutlined,
  ReadOutlined,
  UndoOutlined,
  PlusCircleOutlined,
  RollbackOutlined,
  LogoutOutlined,
  GlobalOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

import Highlighter from 'react-highlight-words';
import { GiHamburgerMenu } from 'react-icons/gi';
import './style.css';
import 'antd/dist/antd.min.css';

const { Title } = Typography;

const Accounts = (props) => {
  const { loginData } = useContext(LoginContext);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [viewADetailsData, setViewADetailsData] = useState(null);
  const [viewADetailsModal, setViewADetailsModal] = useState(false);
  const [adminVisible, setAdminVisible] = useState(false);

  const { adminAccount, getInventoryData, handleLogout } = props;

  const [form] = Form.useForm();

  const onViewAdminDetails = async (record, e) => {
    e.defaultPrevented = true;
    setViewADetailsData(record);
    setViewADetailsModal(true);
  };

  let adminCount = 0;
  for (var key1 in adminAccount) {
    if (adminAccount.hasOwnProperty(key1)) {
      adminCount++;
    }
  }
  // eslint-disable-next-line no-unused-vars
  const [paginationAdmin, setPaginationAdmin] = useState({
    defaultCurrent: 1,
    pageSize: 10,
    total: adminCount,
  });

  const handleOpenAdminModal = () => {
    setAdminVisible(true);
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

  const onFinishAdmin = async (values) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (res.status === 201) {
      message.success('Registered Successfully');
      getInventoryData();
      onCloseAdmin();
      form.resetFields();
    } else {
      message.error('ID already exists!');
    }
  };

  const onCloseAdmin = () => {
    setAdminVisible(false);
    form.resetFields();
  };

  const columnAdmin = [
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
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
      width: '10%',
    },
    {
      title: 'Accoount Status',
      dataIndex: 'acctStatus',
      key: 'acctStatus',
      width: '15%',
      filters: [
        {
          text: 'Active',
          value: 'Active',
        },
        {
          text: 'Disabled',
          value: 'Disabled',
        },
      ],
      onFilter: (value, record) => record.acctStatus.indexOf(value) === 0,
    },
    {
      title: (
        <>
          <div>
            <Button
              type='primary'
              shape='round'
              icon={<PlusCircleOutlined />}
              onClick={() => handleOpenAdminModal()}
              style={{
                backgroundColor: '#000080',
                border: '1px solid #d9d9d9',
              }}
            >
              ADMIN ACCOUNT
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
                onViewAdminDetails(record, e);
              }}
              style={{ backgroundColor: 'purple', border: '1px solid #d9d9d9' }}
            >
              Account Details
            </Button>
          </div>
        </>
      ),
    },
  ];

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
              Accounts
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
              <h3 style={{ marginTop: '20px' }}>ACCOUNT INFORMATION</h3>
            </Divider>
            <Table key='adminTable' columns={columnAdmin} dataSource={adminAccount} pagination={paginationAdmin} />
          </Col>
        </Row>

        <Modal
          key='AccountDetails'
          title='ACCOUNT DETAILS'
          width={1200}
          open={viewADetailsModal}
          onCancel={() => {
            setViewADetailsModal(false);
            setViewADetailsData();
          }}
          footer={[
            <Button
              type='primary'
              icon={<RollbackOutlined />}
              key='cancel'
              onClick={() => {
                setViewADetailsModal(false);
                setViewADetailsData();
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
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Employee ID
                  </Title>
                  <Input value={viewADetailsData?.employeeId} readOnly style={{ borderRadius: '10px' }} />
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
                  <Input value={viewADetailsData?.firstName} readOnly style={{ borderRadius: '10px' }} />
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
                  <Input value={viewADetailsData?.middleName} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Last Name
                  </Title>
                  <Input value={viewADetailsData?.lastName} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    User Type
                  </Title>
                  <Input value={viewADetailsData?.userType} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Email
                  </Title>
                  <Input value={viewADetailsData?.email} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>

        <Drawer
          key='accountRegistration'
          title='ACCOUNT REGISTRATION'
          placement='right'
          onClose={onCloseAdmin}
          open={adminVisible}
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
              <Button type='primary' onClick={() => form.submit()}>
                Confirm Registration
              </Button>
              <Button type='primary' onClick={onCloseAdmin}>
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
            onFinish={onFinishAdmin}
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
                          message: 'Please input your employee id!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your employee id' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
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
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label='User Type'
                      name='userType'
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
                          message: 'Please enter a user type',
                        },
                      ]}
                    >
                      <Select placeholder='Select a user type'>
                        <Select.Option key='1' value='User'>
                          User
                        </Select.Option>
                        <Select.Option key='2' value='Super Admin'>
                          Super Admin
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item
                      label='Password'
                      name='password'
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
                          message: 'Please input your password!',
                        },
                        { whitespace: true },
                        { min: 8 },
                        { max: 26 },
                        {
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,26}$/,
                          message: 'Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
                        },
                      ]}
                    >
                      <Input.Password placeholder='********' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item
                      label='Confirm Password'
                      name='confirmPassword'
                      labelCol={{
                        span: 24,
                        //offset: 2
                      }}
                      wrapperCol={{
                        span: 24,
                        //offset: 2
                      }}
                      hasFeedback
                      dependencies={['password']}
                      rules={[
                        {
                          required: true,
                          message: 'Confirm Password is required!',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }

                            return Promise.reject('Passwords does not matched.');
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder='********' />
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

export default Accounts;
