import React, { useContext, useEffect, useState, useRef } from 'react';
import { LoginContext } from '../../../Context/Context';
import {
  Col,
  Form,
  Row,
  Select,
  Divider,
  List,
  Skeleton,
  DatePicker,
  Space,
  Button,
  Typography,
  message,
  Table,
  Input,
  Modal,
} from 'antd';
import {
  BarChartOutlined,
  LogoutOutlined,
  SearchOutlined,
  ReadOutlined,
  UndoOutlined,
  RollbackOutlined,
  GlobalOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GiHamburgerMenu } from 'react-icons/gi';
import './style.css';
import 'antd/dist/antd.min.css';
import { ReportData } from '../../../Data/Data';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Reports = (props) => {
  const { timeSheetInfo, handleLogout } = props;
  const [form] = Form.useForm();
  const { loginData } = useContext(LoginContext);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [reportDate, setReportDate] = useState([]);
  const [viewTimesheetData, setViewTimesheetData] = useState(null);
  const [viewTimesheetModal, setViewTimesheetModal] = useState(false);
  const [targetedReport, setTargetedReport] = useState();

  const [sortedInfo, setSortedInfo] = useState({});
  const handleChanges = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setSortedInfo(sorter);
  };

  const onViewTimesheetDetails = async (record, e) => {
    e.defaultPrevented = true;
    setViewTimesheetData(record);
    setViewTimesheetModal(true);
  };

  let timeSheetCount = 0;
  for (var key1 in timeSheetInfo) {
    if (timeSheetInfo.hasOwnProperty(key1)) {
      timeSheetCount++;
    }
  }
  // eslint-disable-next-line no-unused-vars
  const [paginationTimeSheet, setPaginationTimeSheet] = useState({
    defaultCurrent: 1,
    pageSize: 5,
    total: timeSheetCount,
  });

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

  const columnEmployee = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: '8%',
      ...getColumnSearchProps('employeeId', 'Employee ID'),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: '8%',
      ...getColumnSearchProps('lastName', 'Last Name'),
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortOrder: sortedInfo.columnKey === 'lastName' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: '8%',
      ...getColumnSearchProps('firstName', 'First Name'),
      sorter: (a, b) => a.firstName.length - b.firstName.length,
      sortOrder: sortedInfo.columnKey === 'firstName' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Middle Name',
      dataIndex: 'middleName',
      key: 'middleName',
      width: '8%',
      ...getColumnSearchProps('middleName', 'Middle Name'),
      sorter: (a, b) => a.middleName.length - b.middleName.length,
      sortOrder: sortedInfo.columnKey === 'middleName' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'created',
      key: 'created',
      width: '10%',
      render: (text, row) => <>{new Date(row['created']).toLocaleString()}</>,
      sorter: (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
      sortOrder: sortedInfo.columnKey === 'created' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Designation',
      dataIndex: 'role',
      key: 'role',
      width: '10%',
    },
    {
      title: '',
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
                onViewTimesheetDetails(record, e);
              }}
              style={{ backgroundColor: 'purple', border: '1px solid #d9d9d9' }}
            >
              Timesheet Details
            </Button>
          </div>
        </>
      ),
    },
  ];

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('/api/report/get-generated')
      .then((res) => res.json())
      .then((body) => {
        setData([...body.body]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values) => {
    values.start = reportDate[0];
    values.end = reportDate[1];

    const data = await fetch('/api/report/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const res = await data.json();
    if (res.status === 201) {
      form.resetFields();
      setTargetedReport();
      message.success('Reports Successfully Generated and Ready to Download');
      loadMoreData();
    }
  };

  const onFinishFailed = (error) => {
    console.error(error);
  };

  const onChange = (value, dateString) => {
    setReportDate(dateString);
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };
  const onOk = (value) => {
    console.log('onOk: ', value);
  };

  const handleDownload = (filename) => {
    window.open(`/api/report/download-csv?filename=${filename}`, '_blank');
  };

  const handleChange = (value) => {
    setTargetedReport(value);
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
              Reports
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
            WWW.ATTENDANCE.COM
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
            +63 123 4567{' '}
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
        <Row>
          <Col span={24}>
            <Divider orientation='left' orientationMargin='0'>
              <h3 style={{ marginTop: '20px' }}>TIMESHEET INFORMATION</h3>
            </Divider>
            <Table
              key='timeSheetTable'
              columns={columnEmployee}
              dataSource={timeSheetInfo}
              pagination={paginationTimeSheet}
              onChange={handleChanges}
            />
          </Col>
        </Row>
        <Divider orientation='left' orientationMargin='0'></Divider>
        <Row>
          <Col span={12}>
            <Form
              form={form}
              labelCol={{
                span: 24,
              }}
              layout='horizontal'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete='off'
              style={{
                width: '100%',
              }}
            >
              <Col xs={24} md={12} layout='vertical'>
                <Form.Item
                  label='Please select a report'
                  name='report'
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
                      message: 'Please select a report!',
                    },
                  ]}
                >
                  <Select placeholder='Select a Report' onChange={handleChange}>
                    {ReportData.map((value, index) => (
                      <Select.Option key={index} value={value.value}>
                        {value.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} layout='vertical'>
                <Form.Item
                  label='Custom Date'
                  name='date'
                  labelCol={{
                    span: 24,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  hasFeedback
                  hidden={targetedReport === 'employeeData' ? true : false}
                >
                  <Space direction='vertical' size={12}>
                    <RangePicker format='YYYY-MM-DD' onChange={onChange} onOk={onOk} />
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} layout='vertical'>
                <Form.Item
                  name='employeeId'
                  labelCol={{
                    span: 24,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  hasFeedback
                >
                  <Input placeholder='Enter Employee ID' hidden={targetedReport === 'individual' ? false : true} />
                </Form.Item>
              </Col>
              <Row
                gutter={12}
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  paddingTop: '20px',
                }}
              >
                <Button
                  icon={<BarChartOutlined />}
                  style={{
                    backgroundColor: 'purple',
                    border: '1px solid #d9d9d9',
                  }}
                  type='primary'
                  htmlType='submit'
                >
                  Generate Report
                </Button>
              </Row>
            </Form>
          </Col>
          <Col span={12}>
            <Title level={4}>Recently Generated Report</Title>
            <div
              id='scrollableDiv'
              style={{
                height: 600,
                overflow: 'auto',
                padding: '0 16px',
                border: '1px solid rgba(140, 140, 140, 0.35)',
                backgroundColor: 'f9f9f9',
              }}
            >
              <InfiniteScroll
                dataLength={data.length}
                loader={
                  <Skeleton
                    avatar
                    paragraph={{
                      rows: 1,
                    }}
                    active
                  />
                }
                endMessage={<Divider plain>Nothing to follow</Divider>}
                scrollableTarget='scrollableDiv'
              >
                <List
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item key={item.filePath}>
                      <List.Item.Meta
                        title={<p>{item.filePath.toUpperCase()}</p>}
                        description={new Date(item.created).toLocaleString()}
                      />
                      <div
                        style={{
                          textDecorationLine: 'underline',
                          color: 'blue',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          handleDownload(item.filePath);
                        }}
                      >
                        Download
                      </div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Col>
        </Row>

        <Modal
          key='employeeDetails'
          title='EMPLOYEE DETAILS'
          width={1200}
          open={viewTimesheetModal}
          onCancel={() => {
            setViewTimesheetModal(false);
            setViewTimesheetData();
          }}
          footer={[
            <Button
              type='primary'
              icon={<RollbackOutlined />}
              key='cancel'
              onClick={() => {
                setViewTimesheetModal(false);
                setViewTimesheetData();
              }}
            >
              Cancel
            </Button>,
          ]}
        >
          <Row>
            <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <Divider orientation='left' orientationMargin='0'>
                <h3 style={{ marginTop: '20px' }}>PERSONAL INFORMATION</h3>
              </Divider>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Employee ID
                  </Title>
                  <Input value={viewTimesheetData?.employeeId} readOnly style={{ borderRadius: '10px' }} />
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
                    First Name
                  </Title>
                  <Input value={viewTimesheetData?.firstName} readOnly style={{ borderRadius: '10px' }} />
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
                  <Input value={viewTimesheetData?.middleName} readOnly style={{ borderRadius: '10px' }} />
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
                  <Input value={viewTimesheetData?.lastName} readOnly style={{ borderRadius: '10px' }} />
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
                    Designation
                  </Title>
                  <Input value={viewTimesheetData?.role} readOnly style={{ borderRadius: '10px' }} />
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
                  <Input value={viewTimesheetData?.department} readOnly style={{ borderRadius: '10px' }} />
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
                    Attendance Creation Date
                  </Title>
                  <Input
                    value={new Date(viewTimesheetData?.created).toLocaleString()}
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
                  <Input value={viewTimesheetData?.email} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
              <Divider orientation='left' orientationMargin='0'>
                <h3 style={{ marginTop: '20px' }}>COMPANY INFORMATION</h3>
              </Divider>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Company Name
                  </Title>
                  <Input value={viewTimesheetData?.employerName} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Company Address
                  </Title>
                  <Input value={viewTimesheetData?.employerAddress} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Company Contact Details
                  </Title>
                  <Input value={viewTimesheetData?.employerContact} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
              <Divider orientation='left' orientationMargin='0'>
                <h3 style={{ marginTop: '20px' }}>ATTENDANCE INFORMATION</h3>
              </Divider>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Day
                  </Title>
                  <Input value={viewTimesheetData?.day} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Month
                  </Title>
                  <Input value={viewTimesheetData?.month} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Year
                  </Title>
                  <Input value={viewTimesheetData?.year} readOnly style={{ borderRadius: '10px' }} />
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
                    Time-In AM
                  </Title>
                  <Input value={viewTimesheetData?.timeData.timeInAM} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Time-Out AM
                  </Title>
                  <Input value={viewTimesheetData?.timeData.timeOutAM} readOnly style={{ borderRadius: '10px' }} />
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
                    Time-In PM
                  </Title>
                  <Input value={viewTimesheetData?.timeData.timeInAM} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Time-Out PM
                  </Title>
                  <Input value={viewTimesheetData?.timeData.timeOutAM} readOnly style={{ borderRadius: '10px' }} />
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
                    Total Hours
                  </Title>
                  <Input
                    value={viewTimesheetData?.timeData.totalHoursToday}
                    readOnly
                    style={{ borderRadius: '10px' }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>
      </main>
    </>
  );
};

export default Reports;
