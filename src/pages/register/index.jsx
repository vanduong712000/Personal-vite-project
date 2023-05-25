import React, { useState } from 'react';
import { Button, Form, Input, notification, message } from 'antd';
import { callRegister } from '../../services/api';
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsLoading(true);
        const res = await callRegister(fullName, email, password, phone);
        setIsLoading(false);
        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công');
            navigate('/login');
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
        <>
            <div className="register-page" style={{ padding: '50px' }}>
                <h3 style={{ textAlign: 'center' }}>Đăng ký người dùng mới</h3>
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
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your fullname!' }]}

                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
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
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}

                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div >
        </>
    )
}

export default RegisterPage;