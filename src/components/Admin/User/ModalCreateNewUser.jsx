import React, { useState } from 'react';
import { Modal, Form, Input, notification, message } from 'antd';

import { callCreateUser } from '../../../services/api';

const ModalCreateNewUser = (props) => {
    const { setOpenModalCreate, openModalCreate, fetchUser } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsSubmit(true);
        const res = await callCreateUser(fullName, email, password, phone);
        if (res && res.data) {
            message.success('Tạo mới user thành công');
            form.resetFields();

            setOpenModalCreate(false);
            await fetchUser();
        } else {
            notification.error({
                message: 'có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Basic Modal"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => setOpenModalCreate(false)}
                cancelText={"Hủy"}
                okText={"Tạo mới"}
                confirmLoading={isSubmit}
            >
                <div className="register-page" style={{ padding: '50px' }}>
                    <h3 style={{ textAlign: 'center' }}>Đăng ký người dùng mới</h3>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
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
                    </Form>
                </div >
            </Modal>
        </>

    );
}

export default ModalCreateNewUser;















