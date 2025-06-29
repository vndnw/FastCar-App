import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    CarOutlined,
    DashboardOutlined,
    CalendarOutlined,
    BarChartOutlined,
    UserOutlined,
    LogoutOutlined,
    HomeOutlined
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Sider, Content } = Layout;

function OwnerLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            key: '/owner/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/owner/cars',
            icon: <CarOutlined />,
            label: 'My Cars',
        },
        {
            key: '/owner/bookings',
            icon: <CalendarOutlined />,
            label: 'Bookings',
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} theme="light" style={{
                boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                zIndex: 1000
            }}>
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    margin: '0 16px'
                }}>
                    <h2 style={{
                        margin: 0,
                        color: '#51c09f',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>
                        Owner Panel
                    </h2>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ border: 'none', marginTop: 16 }}
                />

                <div style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16
                }}>
                    <Menu
                        mode="inline"
                        style={{ border: 'none', backgroundColor: 'transparent' }}
                        items={[
                            {
                                key: 'home',
                                icon: <HomeOutlined />,
                                label: 'Back to Site',
                                onClick: handleGoHome,
                            },
                            {
                                key: 'logout',
                                icon: <LogoutOutlined />,
                                label: 'Logout',
                                onClick: handleLogout,
                                style: { color: '#ff4d4f' }
                            }
                        ]}
                    />
                </div>
            </Sider>

            <Layout style={{ marginLeft: 250 }}>
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#333' }}>
                            Car Owner Dashboard
                        </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ color: '#666' }}>
                            Welcome, {user?.firstName || user?.email}
                        </span>
                    </div>
                </Header>

                <Content style={{
                    margin: '24px',
                    padding: '24px',
                    background: '#f0f2f5',
                    minHeight: 'calc(100vh - 112px)',
                    borderRadius: '8px'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default OwnerLayout;
