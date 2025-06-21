/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission no        <div className="ant-progress-project">
          <Progress percent={90} size="small" />
          <span>
            <Link to="#" onClick={(e) => e.preventDefault()}>
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>ll be included in all copies or substantial portions of the Software.
*/
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  Spin,
  Tag,
  Modal,
  Descriptions,
  Divider,
} from "antd";

import { ToTopOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { userService } from "../../services/userService";

// Images
import ava1 from "../../assets/images/logo-shopify.svg";
import ava2 from "../../assets/images/logo-atlassian.svg";
import ava3 from "../../assets/images/logo-slack.svg";
import ava5 from "../../assets/images/logo-jira.svg";
import ava6 from "../../assets/images/logo-invision.svg";
import face from "../../assets/images/face-1.jpg";
import face2 from "../../assets/images/face-2.jpg";
import face3 from "../../assets/images/face-3.jpg";
import face4 from "../../assets/images/face-4.jpg";
import face5 from "../../assets/images/face-5.jpeg";
import face6 from "../../assets/images/face-6.jpeg";
import pencil from "../../assets/images/pencil.svg";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
// table code start
const columns = [
  {
    title: "USER",
    dataIndex: "user",
    key: "user",
    width: "30%",
  },
  {
    title: "CONTACT",
    dataIndex: "contact",
    key: "contact",
    width: "20%",
  },
  {
    title: "ROLES",
    key: "roles",
    dataIndex: "roles",
    width: "15%",
  },
  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
    width: "10%",
  },
  {
    title: "CREATED",
    key: "created",
    dataIndex: "created",
    width: "15%",
  },
  {
    title: "ACTIONS",
    key: "actions",
    dataIndex: "actions",
    width: "10%",
  },
];

const data = [];
// project table start
const project = [
  {
    title: "COMPANIES",
    dataIndex: "name",
    width: "32%",
  },
  {
    title: "BUDGET",
    dataIndex: "age",
  },
  {
    title: "STATUS",
    dataIndex: "address",
  },
  {
    title: "COMPLETION",
    dataIndex: "completion",
  },
];
const dataproject = [
  {
    key: "1",

    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava1} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}>Spotify Version</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$14,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={30} size="small" />
          <span>
            <Link to="#" onClick={(e) => e.preventDefault()}>
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "2",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava2} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}>Progress Track</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$3,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={10} size="small" />
          <span>
            <Link to="#" onClick={(e) => e.preventDefault()}>
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "3",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava3} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}> Jira Platform Errors</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">Not Set</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">done</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={100} size="small" format={() => "done"} />
          <span>
            <Link to="#" onClick={(e) => e.preventDefault()}>
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "4",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava5} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}> Launch new Mobile App</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$20,600</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">canceled</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress
            percent={50}
            size="small"
            status="exception"
            format={() => "50%"}
          />
          <span>
            <Link to="#" onClick={(e) => e.preventDefault()}>
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "5",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava5} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}>Web Dev</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$4,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={80} size="small" />
          <span>
            <Link to="#" onClick={(e) => e.preventDefault()}>
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "6",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava6} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}>Redesign Online Store</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$2,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">canceled</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={0} size="small" />
          <span>
            <Link to="#" onClick={(e) => e.preventDefault()}>
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },
];

function Tables() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const handleViewUser = async (userId) => {
    try {
      setUserDetailLoading(true);
      setDetailModalVisible(true);
      const result = await userService.getUserById(userId);

      if (result.status === 200) {
        setSelectedUser(result.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      message.error(error.message || 'Failed to fetch user details');
      setDetailModalVisible(false);
    } finally {
      setUserDetailLoading(false);
    }
  };
  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setSelectedUser(null);
  };

  const fetchUsers = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const result = await userService.getUsers(page, size, 'email,asc');

      if (result.status === 200) {
        const userData = result.data.content.map((user, index) => ({
          key: user.id.toString(),
          user: (
            <Avatar.Group>
              <Avatar
                className="shape-avatar"
                shape="cricle"
                size={40}
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName || 'U'}+${user.lastName || 'ser'}&background=random`}
              />
              <div className="avatar-info">
                <Title level={5}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email.split('@')[0]
                  }
                </Title>
                <p>{user.email}</p>
              </div>
            </Avatar.Group>
          ),
          contact: (
            <div className="author-info">
              <Title level={5}>{user.phone || 'No phone'}</Title>
              <p>{user.address?.address || 'No address'}</p>
            </div>
          ),
          roles: (
            <div>
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, idx) => (
                  <Tag key={idx} color={role === 'admin' ? 'red' : role === 'driver' ? 'blue' : 'green'}>
                    {role.toUpperCase()}
                  </Tag>
                ))
              ) : (
                <Tag color="default">USER</Tag>
              )}
            </div>
          ),
          status: (
            <Button type="primary" className={user.active ? "tag-primary" : "tag-badge"}>
              {user.active ? 'ACTIVE' : 'INACTIVE'}
            </Button>
          ), created: (
            <div className="ant-employed">
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>Edit</a>
            </div>
          ),
          actions: (
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewUser(user.id)}
              title="View Details"
            />
          ),
        }));

        setUsers(userData);
        setPagination({
          current: result.data.number + 1,
          pageSize: result.data.size,
          total: result.data.totalElements,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current - 1, pagination.pageSize);
  };

  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Users Table"
              extra={
                <>
                  <Radio.Group onChange={onChange} defaultValue="a">
                    <Radio.Button value="a">All</Radio.Button>
                    <Radio.Button value="b">ACTIVE</Radio.Button>
                  </Radio.Group>
                </>
              }
            >
              <div className="table-responsive">
                <Spin spinning={loading}>
                  <Table
                    columns={columns}
                    dataSource={users}
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} users`,
                    }}
                    onChange={handleTableChange}
                    className="ant-border-space"
                  />
                </Spin>
              </div>
            </Card>

            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Projects Table"
              extra={
                <>
                  <Radio.Group onChange={onChange} defaultValue="all">
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="online">ONLINE</Radio.Button>
                    <Radio.Button value="store">STORES</Radio.Button>
                  </Radio.Group>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={project}
                  dataSource={dataproject}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
              <div className="uploadfile pb-15 shadow-none">
                <Upload {...formProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </div>            </Card>
          </Col>
        </Row>
      </div>

      {/* User Detail Modal */}
      <Modal
        title="User Details"
        open={detailModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
        width={800}
      >
        <Spin spinning={userDetailLoading}>
          {selectedUser && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar
                  size={80}
                  src={selectedUser.profilePicture || `https://ui-avatars.com/api/?name=${selectedUser.firstName || 'U'}+${selectedUser.lastName || 'ser'}&background=random&size=80`}
                />
                <Title level={4} style={{ marginTop: 16 }}>
                  {selectedUser.firstName && selectedUser.lastName
                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                    : selectedUser.email.split('@')[0]
                  }
                </Title>
                <div>
                  {selectedUser.roles && selectedUser.roles.length > 0 ? (
                    selectedUser.roles.map((role, idx) => (
                      <Tag key={idx} color={role === 'admin' ? 'red' : role === 'driver' ? 'blue' : 'green'}>
                        {role.toUpperCase()}
                      </Tag>
                    ))
                  ) : (
                    <Tag color="default">USER</Tag>
                  )}
                </div>
              </div>

              <Divider />

              <Descriptions title="Personal Information" bordered column={2}>
                <Descriptions.Item label="First Name">
                  {selectedUser.firstName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                  {selectedUser.lastName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedUser.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedUser.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={selectedUser.active ? 'green' : 'red'}>
                    {selectedUser.active ? 'ACTIVE' : 'INACTIVE'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created At" span={2}>
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At" span={2}>
                  {new Date(selectedUser.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              {selectedUser.address && selectedUser.address.address && (
                <>
                  <Divider />
                  <Descriptions title="Address Information" bordered column={1}>
                    <Descriptions.Item label="Address">
                      {selectedUser.address.address}
                    </Descriptions.Item>
                    {selectedUser.address.latitude && selectedUser.address.longitude && (
                      <Descriptions.Item label="Coordinates">
                        Lat: {selectedUser.address.latitude}, Lng: {selectedUser.address.longitude}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </>
              )}

              {selectedUser.bankInformation && (selectedUser.bankInformation.bankName || selectedUser.bankInformation.accountNumber) && (
                <>
                  <Divider />
                  <Descriptions title="Bank Information" bordered column={2}>
                    <Descriptions.Item label="Bank Name">
                      {selectedUser.bankInformation.bankName || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Number">
                      {selectedUser.bankInformation.accountNumber || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Holder" span={2}>
                      {selectedUser.bankInformation.accountHolderName || 'N/A'}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </>
          )}
        </Spin>
      </Modal>
    </>
  );
}

export default Tables;
