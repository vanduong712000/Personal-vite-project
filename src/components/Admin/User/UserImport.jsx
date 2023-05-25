import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Modal, Table, notification } from 'antd';
import { useState } from 'react';
import * as XLSX from "xlsx";
import { callBulkCreateUser } from '../../../services/api';
import templateFile from './template.xlsx?url';

const UserImport = (props) => {
    const { openModalImportUser, setOpenModalImportUser, fetchUser } = props;
    const { Dragger } = Upload;

    const [dataExcel, setDataExcel] = useState([]);

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: dummyRequest,
        onChange(info) {
            console.log('>>>>info', info);
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        let data = new Uint8Array(reader.result);
                        let workbook = XLSX.read(data, { type: 'array' });
                        let sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ["fullName", "email", "phone"],
                            range: 1
                        });
                        if (json && json.length > 0) setDataExcel(json)
                    }
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const handleSubmit = async () => {
        const data = dataExcel.map(item => {
            item.password = '123456';
            return item;
        })
        const res = await callBulkCreateUser(data);
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: "Upload thành công",
            })
            setDataExcel([]);
            setOpenModalImportUser(false);
            fetchUser();
        } else {
            notification.error({
                description: res.message,
                message: "Đã có lỗi xảy ra",
            })
        }
    }

    return (
        <>
            <Modal
                title="Basic Modal"
                open={openModalImportUser}
                onOk={() => handleSubmit()}
                onCancel={() => {
                    setOpenModalImportUser(false);
                    setDataExcel([]);
                }}
                cancelText="Hủy"
                okText="Import data"
                okButtonProps={{
                    disabled: dataExcel.length < 1
                }}
                maskClosable={false}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload.Only accept.scv,.xls,.xlsx.or
                        <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download >Download sample File</a>
                    </p>

                </Dragger>

                <div style={{ paddingTop: 20 }}>
                    <Table
                        dataSource={dataExcel}
                        title={() => <span>Dữ liệu upload:</span>}
                        columns={[
                            { title: 'Tên hiển thị', dataIndex: 'fullName' },
                            { title: 'Email', dataIndex: 'email' },
                            { title: 'Số điện thoại', dataIndex: 'phone' },
                        ]}
                    ></Table>

                </div>

            </Modal>
        </>
    )

}

export default UserImport;
