/* eslint-disable array-callback-return */
/* eslint-disable no-sequences */
import React, { useContext, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useReactToPrint } from 'react-to-print';
import { CategoryScale } from 'chart.js';
import { GiHamburgerMenu } from 'react-icons/gi';
import { LoginContext } from '../../../Context/Context';
import {
  Col,
  Row,
  Table,
  Button,
  Space,
  Input,
  Form,
  message,
  Upload,
  Modal,
  Divider,
  Drawer,
  Typography,
  Popconfirm,
  DatePicker,
} from 'antd';
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
  CheckOutlined,
  PrinterOutlined,
  VerticalLeftOutlined,
  EditOutlined,
  CameraOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import './style.css';
import 'antd/dist/antd.min.css';
import { EmployeeUpdateDetail } from '../AntdComponents/Drawer/drawer';
import Camera from '../../Camera/Camera';

const { Title } = Typography;
const { RangePicker } = DatePicker;

Chart.register(CategoryScale);

const Settings = (props) => {
  const { handleLogout } = props;
  const { loginData } = useContext(LoginContext);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [viewEDetailsData, setViewEDetailsData] = useState('');
  const [viewEDetailsModal, setViewEDetailsModal] = useState(false);
  const [employeeVisible, setEmployeeVisible] = useState(false);
  const [monthModal, setMOnthModal] = useState(false);
  const [dtrModal, setDtrModal] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);

  const [updateOpen, setUpdateOpen] = useState(false);

  const contentToPrint = useRef(null);
  const [dtrData, setDtrData] = useState();

  const initialValues = {
    employeeId: viewEDetailsData?.employeeId,
    firstName: viewEDetailsData?.firstName,
    middleName: viewEDetailsData?.middleName,
    lastName: viewEDetailsData?.lastName,
    department: viewEDetailsData?.department,
    role: viewEDetailsData?.role,
    email: viewEDetailsData?.email,
    employerName: viewEDetailsData?.employerName,
    employerAddress: viewEDetailsData?.employerAddress,
    employerContact: viewEDetailsData?.employerContact,
  };

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

  const onProcessTagAsResigned = async (employeeId) => {
    if (employeeId) {
      const data = await fetch(`/api/tag-as-resigned/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await data.json();

      if (res.status === 200) {
        message.success('Process Completed');
        setViewEDetailsData('');
        getInventoryData();
        setViewEDetailsModal(false);
      } else {
        message.error('Something went wrong. Please try again later');
      }
    }
  };

  const onChange = async (date, dateString) => {
    console.log(dateString);
    if (dateString.length > 0) {
      const data = await fetch(
        `/api/print-dtr?employeeId=${viewEDetailsData.employeeId}&startDate=${dateString[0]}&endDate=${dateString[1]}`
      );
      const res = await data.json();
      setDtrData(res.body);
    }
  };

  const handlePrint = useReactToPrint({
    documentTitle: 'Print This Document',
    onBeforePrint: () => console.log('before printing...'),
    onAfterPrint: () => console.log('after printing...'),
    removeAfterPrint: true,
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
    newdata.append('employerName', values.employerName);
    newdata.append('employerAddress', values.employerAddress);
    newdata.append('employerContact', values.employerContact);

    const res = await fetch('/api/add-employee', {
      method: 'POST',
      body: newdata,
    });
    if (res.status === 201) {
      message.success('Employee Added Successfully');
      getInventoryData();
      onCloseAdmin();
    } else {
      message.error(res.error ? res.error : 'Duplicate Entity');
    }
  };

  const onCloseAdmin = () => {
    setEmployeeVisible(false);
    form.resetFields();
  };

  // update employee

  const onCloseUpdate = () => {
    setViewEDetailsData('');
    setUpdateOpen(false);
    form.resetFields();
  };

  const handleUpdateModal = () => {
    setViewEDetailsModal(false);
    setUpdateOpen(true);
    form.resetFields();
  };

  const onOpenCamera = () => {
    setCameraModal(true);
  };

  const onCloseCamera = () => {
    setCameraModal(false);
  };

  const onFinishUpdate = async (values) => {
    const data = await fetch(`/api/update-employee/${viewEDetailsData._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();
    if (res.status === 201) {
      message.success('Employee Information Updated Successfully');
      onCloseUpdate();
      getInventoryData();
    }
  };

  const onFinishUpdateFailed = async (error) => {
    console.error(error);
  };

  const onConfirmUpdate = () => {
    form.submit();
  };

  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setSortedInfo(sorter);
  };

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
      width: '10%',
      ...getColumnSearchProps('middleName', 'Middle Name'),
      sorter: (a, b) => a.middleName.length - b.middleName.length,
      sortOrder: sortedInfo.columnKey === 'middleName' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Designation',
      dataIndex: 'role',
      key: 'role',
      width: '9%',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: '9%',
    },
    {
      title: 'Employment Status',
      dataIndex: 'employmentStatus',
      key: 'employmentStatus',
      width: '8%',
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
            +63 123 4567
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
              onChange={handleChange}
              // pagination={paginationAdmin}
            />
          </Col>
        </Row>

        <Modal
          key='selectMonth'
          title='SELECT MONTH'
          width={300}
          onCancel={() => {
            setMOnthModal(false);
          }}
          open={monthModal}
          footer={[
            <Button
              type='primary'
              icon={<RollbackOutlined />}
              key='cancel'
              onClick={() => {
                setMOnthModal(false);
              }}
            >
              Cancel
            </Button>,
            <Button
              type='primary'
              icon={<VerticalLeftOutlined />}
              key='cancel'
              disabled={dtrData ? false : true}
              onClick={() => {
                setMOnthModal(false);
                setDtrModal(true);
              }}
            >
              Next
            </Button>,
          ]}
        >
          <Space direction='vertical'>
            <RangePicker onChange={onChange} />
          </Space>
        </Modal>

        <Modal
          key='camera'
          title='CAMERA'
          width={1000}
          onCancel={() => {
            onCloseCamera();
          }}
          open={cameraModal}
          footer={[
            <Button
              key='Cancel Camera'
              type='primary'
              icon={<CloseCircleOutlined />}
              onClick={() => {
                onCloseCamera();
              }}
            >
              Close Camera
            </Button>,
          ]}
        >
          <Row>
            <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <Camera />
            </Col>
          </Row>
        </Modal>

        <Modal
          key='dtrPrint'
          title=''
          width={400}
          onCancel={() => {
            setDtrModal(false);
          }}
          open={dtrModal}
          footer={[
            <Button
              type='primary'
              icon={<RollbackOutlined />}
              key='cancelPrint'
              onClick={() => {
                setDtrModal(false);
              }}
            >
              Cancel
            </Button>,
            <Button
              type='primary'
              icon={<PrinterOutlined />}
              key='Print'
              disabled={dtrData ? false : true}
              onClick={() => {
                handlePrint(null, () => contentToPrint.current);
              }}
            >
              Print
            </Button>,
          ]}
        >
          <>
            <div ref={contentToPrint}>
              <caption>
                <p class='civil_service_title'>
                  <em>Civil Service Form No. 48</em>
                </p>
                <p class='dtr'>
                  <em>DAILY TIME RECORD</em>
                </p>
                <p class='line1'>
                  <em>_____________________________</em>
                </p>
                <p class='name'>
                  Employee Name: {dtrData ? `${dtrData?.employee.firstName} ${dtrData?.employee.lastName}` : ''}
                </p>
                <p class='name'>Designation: {dtrData ? `${dtrData?.employee.role}` : ''} </p>
                <p class='civil_service_title2'>
                  <em>
                    For the month of {dtrData ? dtrData.month : ''}
                    <br />
                    Official hours for TIME-IN
                    <br />
                    and TIME-OUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Year:
                    {dtrData ? dtrData.year : ''}
                    <br />
                    <br />
                  </em>
                </p>
              </caption>
              <table border='1'>
                <tr>
                  <th rowspan='2'>Day</th>
                  <th colspan='2'>TIME (A.M.)</th>
                  <th colspan='2'>TIME (P.M.)</th>
                  <th colspan='1'>Hours</th>
                </tr>
                <tr>
                  <th>IN</th>
                  <th>OUT</th>
                  <th>IN</th>
                  <th>OUT</th>
                  <th>Total</th>
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '1') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>1</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '2') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>2</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '3') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>3</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '4') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>4</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '5') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>5</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '6') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>6</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '7') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>7</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '8') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>8</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '9') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>9</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '10') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>10</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '11') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>11</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '12') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>12</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '13') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>13</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '14') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>14</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '15') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>15</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '16') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>16</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '17') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>17</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '18') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>18</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '19') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>19</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '20') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>20</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '21') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>21</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '22') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>22</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '23') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>23</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '24') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>24</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '25') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>25</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '26') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>26</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '27') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>27</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '28') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>28</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '29') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>29</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  {dtrData?.result
                    .filter((data) => {
                      if (data.day === '30') return data;
                    })
                    .map((result) => {
                      return (
                        <>
                          <th>30</th>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutAM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeInPM : ''}</td>
                          <td style={{ fontSize: '8px' }}>{result ? result?.timeData.timeOutPM : ''}</td>
                          <td style={{ fontSize: '10px' }}>{result ? result?.timeData.totalHoursToday : ''}</td>
                        </>
                      );
                    })}
                </tr>
                <tr>
                  <th colspan='5'>
                    <div>Total</div>
                  </th>
                  <td style={{ fontSize: '10px' }}>{dtrData && dtrData.sum ? dtrData.sum : 0}</td>
                </tr>
              </table>
              <p>
                I certify on my honor that the above is a true and correct
                <br />
                report of the hours of work performed, record of which was
                <br />
                made daily at the time of TIME-IN and TIME-OUT from office.
              </p>
              <br />
              ______________________________
              <br />
              <p>VERIFIED as to the prescribed office hours:</p>
              <br />
              ______________________________
              <br />
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; In Charge
              </p>
            </div>
          </>
        </Modal>

        <Modal
          key='employeeDetails'
          title='EMPLOYEE DETAILS'
          width={1200}
          open={viewEDetailsModal}
          onCancel={() => {
            setViewEDetailsModal(false);
            setViewEDetailsData('');
          }}
          footer={[
            <Popconfirm
              placement='top'
              title={`Proceed to PRINT DTR?`}
              onConfirm={() => setMOnthModal(true)}
              okText='Proceed'
              cancelText='Cancel'
            >
              <Button
                type='primary'
                icon={<PrinterOutlined />}
                hidden={viewEDetailsData && viewEDetailsData.employmentStatus === 'Resigned' ? true : false}
              >
                Print DTR
              </Button>
            </Popconfirm>,
            <Popconfirm
              placement='top'
              title={`Proceed to TAG IT AS RESIGNED? Employee Id: ${viewEDetailsData.employeeId}, Employee Name: ${viewEDetailsData.firstName} ${viewEDetailsData.middleName} ${viewEDetailsData.lastName}`}
              onConfirm={() => onProcessTagAsResigned(viewEDetailsData.employeeId)}
              okText='Confirm'
              cancelText='Cancel'
            >
              <Button
                type='primary'
                icon={<CheckOutlined />}
                hidden={viewEDetailsData && viewEDetailsData.employmentStatus === 'Resigned' ? true : false}
              >
                Tag as Resigned
              </Button>
            </Popconfirm>,
            <Button
              type='primary'
              icon={<EditOutlined />}
              key='cancel'
              onClick={() => {
                handleUpdateModal();
              }}
            >
              Update Employee Details
            </Button>,
            <Button
              type='primary'
              icon={<RollbackOutlined />}
              key='cancel'
              onClick={() => {
                setViewEDetailsModal(false);
                setViewEDetailsData('');
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
                <h3 style={{ marginTop: '30px' }}>PERSONAL INFORMATION</h3>
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
                  <Input value={viewEDetailsData?.employeeId} readOnly style={{ borderRadius: '10px' }} />
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
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Employment Status
                  </Title>
                  <Input value={viewEDetailsData?.employmentStatus} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Designation
                  </Title>
                  <Input value={viewEDetailsData?.role} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout='vertical'>
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
              <Divider orientation='left' orientationMargin='0'>
                <h3 style={{ marginTop: '30px' }}>COMPANY INFORMATION</h3>
              </Divider>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Employer Name
                  </Title>
                  <Input value={viewEDetailsData?.employerName} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Employer Address
                  </Title>
                  <Input value={viewEDetailsData?.employerAddress} readOnly style={{ borderRadius: '10px' }} />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout='vertical'>
                  <Title
                    level={5}
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    Employer Contact Details
                  </Title>
                  <Input value={viewEDetailsData?.employerContact} readOnly style={{ borderRadius: '10px' }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>

        {/* Employee Update */}
        <EmployeeUpdateDetail
          onCloseUpdate={onCloseUpdate}
          updateOpen={updateOpen}
          form={form}
          onFinishUpdate={onFinishUpdate}
          onFinishUpdateFailed={onFinishUpdateFailed}
          initialValues={initialValues}
          onConfirmUpdate={onConfirmUpdate}
        />

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
              <Button type='primary' icon={<CameraOutlined />} onClick={onOpenCamera}>
                Open Camera
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
                      label='Designation'
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
                          message: 'Please input your designation!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your designation' />
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
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Form.Item
                      label='Employer Name'
                      name='employerName'
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
                          message: 'Please input your Employer Name!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your Company Name' />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Form.Item
                      label='Employer Address'
                      name='employerAddress'
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
                          message: 'Please input your Employer Address!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter your Company Address' />
                    </Form.Item>
                  </Col>

                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item
                      label='Employer Contact Details'
                      name='employerContact'
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
                <Title
                  level={5}
                  style={{
                    marginTop: '20px',
                  }}
                >
                  UPLOAD IMAGE
                </Title>
                <Row gutter={12}>
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
