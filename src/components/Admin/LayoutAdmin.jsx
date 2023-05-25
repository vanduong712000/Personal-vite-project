import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DollarOutlined,
    UserOutlined,
    BookOutlined,
    AppstoreOutlined,
    HeartTwoTone
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './LayoutAdmin.scss';
import '../../styles/reset.scss';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../services/api';
import { message } from 'antd';
import { doLogoutAccount } from '../../redux/account/accountSlice';

const LayoutAdmin = () => {
    const { Sider, Content, Footer } = Layout;
    const items = [
        {
            key: 'dashboard',
            icon: <AppstoreOutlined />,
            label: <Link to='/admin'>Dashboard </Link>,
        },
        {
            key: 'manageUser',
            icon: <UserOutlined />,
            label: 'Manage Users',
            children: [
                {
                    key: 'crud',
                    icon: <UserOutlined />,
                    label: <Link to='/admin/user'>CRUD</Link>,
                },
                {
                    key: 'files1',
                    icon: <UserOutlined />,
                    label: 'Files1',
                },
            ]
        },
        {
            key: 'book',
            icon: <BookOutlined />,
            label: <Link to='/admin/book'>Manage Books</Link>,
        },
        {
            key: 'order',
            icon: <DollarOutlined />,
            label: <Link to='/admin/order'>Manage Orders</Link>,
        },
    ];

    const itemsDropdown = [
        {
            label: <label>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label>Trang chủ</label>,
            key: 'home',
        },
        {
            label: <label
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    const [collapsed, setCollapsed] = useState(false);
    const user = useSelector(state => state.account.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAccount());
            message.success('Đăng Xuất thành công');
            navigate('/');
        }
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avartar}`;

    return (
        <Layout theme="light">
            <Sider trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light">
                <div style={{ textAlign: 'center', margin: '16px 0 24px 0', }} >
                    Admin
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                />
            </Sider>

            <Layout>
                <div className='admin-header'>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <span className='admin-dropdown'>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Avatar src={urlAvatar} />
                                    {user?.fullName}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </span>
                </div>
                <Content >
                    <Outlet />
                </Content>
                <Footer style={{ padding: 0 }}>
                    Year 2023. Made with <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
}

export default LayoutAdmin;