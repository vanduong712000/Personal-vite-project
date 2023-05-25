import { Modal, Form, Input, notification, message, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { callUpdateUser } from '../../../services/api';

const ModalEditUser = (props) => {


    const [form] = Form.useForm();
    const { setOpenModalEditUser, openModalEditUser, setDataUpdate, dataUpdate,
        fetchUser } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        const { _id, fullName, phone } = values;
        setIsSubmit(true);
        const res = await callUpdateUser(_id, fullName, phone);
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            setOpenModalEditUser(false);
            await fetchUser();
        } else {
            notification.error({
                message: 'có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        form.setFieldsValue(dataUpdate)

    }, [dataUpdate]);

    return (
        <>
            <>
                <Modal
                    title="Cập nhật người dùng"
                    open={openModalEditUser}
                    onOk={() => { form.submit() }}
                    onCancel={() => {
                        setOpenModalEditUser(false);
                        setDataUpdate(null);
                    }}
                    cancelText={"Hủy"}
                    okText={"Cập nhật"}
                    confirmLoading={isSubmit}
                >
                    <div className="register-page" style={{ padding: '50px' }}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            onFinish={onFinish}
                            autoComplete="off"
                        // initialValues={dataUpdate}
                        >
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="Id"
                                name="_id"
                                rules={[{ required: true, message: 'Please input your Id!' }]}

                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên hiển thị"
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
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone!' }]}

                            >
                                <Input />
                            </Form.Item>
                            <Form.Item

                                labelCol={{ span: 24 }}
                                label="Avatar"
                                name="avatar"
                                rules={[{ required: true, message: 'Please input your Avatar!' }]}

                            >
                            </Form.Item>
                        </Form>
                    </div >
                </Modal>
            </>
        </>
    )
}

export default ModalEditUser;