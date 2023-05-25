import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/Ai';
import { Avatar, Badge } from 'antd';
import './Header.scss';
import { callLogout } from '../../services/api';
import { message } from 'antd';
import { doLogoutAccount } from '../../redux/account/accountSlice';

const Header = () => {
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

    let items = [
        {
            label: <label>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'login',
        },
        {
            label: <label
                onClick={() => navigate('/login')}
            >Đăng nhập</label>,
            key: 'logout',
        },
    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avartar}`;

    return (
        <>
            <div className='header-container'>
                <div className='page-header'>
                    <header className='page-header__top'>
                        <div className='page-header_logo'>
                            <span>Dương APP</span>
                            <span className='icon-search'> <AiOutlineSearch /> </span>
                            <span className='input-search'>
                                <input
                                    type='text'
                                    placeholder=" Bạn muốn tìm gì hôm nay "
                                />
                            </span>
                        </div>
                        <nav className='page-header__bottom'>
                            <ul id='navigation' className='navigation'>
                                <li className='navigation__item'>
                                    <li href="#">
                                        <span className='badge-item'>
                                            <Badge count={5}>
                                                <Avatar shape="square" size="large" />
                                            </Badge>
                                        </span>
                                        <span className='icon-cart'><AiOutlineShoppingCart /></span>
                                    </li>
                                </li>
                                <li className='navigation_item mobile'></li>
                                <li className='navigation_item mobile'>
                                    <Dropdown menu={{ items: items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={urlAvatar} />
                                                {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                </li>
                            </ul>
                        </nav>
                    </header>
                </div>
            </div>
        </>
    )
}
export default Header;