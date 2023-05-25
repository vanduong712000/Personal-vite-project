
import React, { useState } from 'react';
import { Button, Form, Input, notification, message } from 'antd';
import { callLogin } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';


const LoginPage = () => {
    const navigation = useNavigate();
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);

    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password, delay } = values;
        setIsLoadingLogin(true);
        const res = await callLogin(username, password, delay);
        setIsLoadingLogin(false);
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(doLoginAction(res.data.user));
            message.success('Đăng nhập thành công');
            navigation('/')
        } else {
            notification.error({
                message: 'có lỗi xảy ra',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return (
        <div className="login-page" style={{ padding: '50px' }}>
            <h3 style={{ textAlign: 'center' }}>Đăng nhập</h3>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: '0 auto' }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}

                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}

                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoadingLogin}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default LoginPage;