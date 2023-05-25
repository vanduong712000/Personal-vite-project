import { Button, Table, Col, Row, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchListUser, callDeleteUser } from '../../../services/api';
import InputSearch from './InputSearch';
import ViewTable from './ViewTable';
import {
    PlusOutlined, ImportOutlined, ExportOutlined, UndoOutlined,
    DeleteTwoTone, EditTwoTone
} from '@ant-design/icons';
import ModalCreateNewUser from './ModalCreateNewUser';
import UserImport from './UserImport';
import * as XLSX from "xlsx";
import ModalEditUser from './ModalEditUser';

const UserTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState('');
    const [openViewDetail, setOpenViewDetail] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalImportUser, setOpenModalImportUser] = useState(false);

    const [openModalEditUser, setOpenModalEditUser] = useState(false);
    const [dataUpdate, setDataUpdate] = useState('');
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>{record._id}</a>
                )
            }
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Action',
            width: 100,
            render: (text, record, index) => {
                return (
                    <>
                        <div style={{ display: "flex", gap: "7px" }}>
                            < Popconfirm
                                placement="leftTop"
                                title={`Xác nhận xóa user ${record.fullName}`}
                                description={`Bạn có chắc chắn muốn xóa User này ?`}
                                onConfirm={() => handleDeleteUser(record._id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <span>
                                    <DeleteTwoTone twoToneColor="#eb2f96" />
                                </span>
                            </Popconfirm>

                            <EditTwoTone twoToneColor="#f57800"
                                onClick={() => {
                                    setOpenModalEditUser(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </div>
                    </>
                )
            }
        },
    ];


    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >Export
                    </Button>
                    <Button
                        icon={<ImportOutlined />}
                        type="primary"
                        onClick={() => { setOpenModalImportUser(true) }}
                    >Import
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            setOpenModalCreate(true)
                        }}
                    >
                        Thêm mới
                    </Button>
                    <Button type='ghost' onClick={() => {
                        setFilter("");
                        setSortQuery("");
                    }
                    }
                    >
                        <UndoOutlined />
                    </Button>
                </span>
            </div>
        );
    }
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);

    const fetchUser = async () => {
        setLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
        }
        setLoading(false);
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` :
                `sort=-${sorter.field}`;
            setSortQuery(q);
        }
        console.log('params', pagination, filters, sorter, extra);
    };

    const handleSearch = (query) => {
        setFilter(query);
    }

    const handleExportData = () => {
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.csv");
        }
    }

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('Xóa user thành công');
            fetchUser();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            })
        }
    }

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    < InputSearch
                        handleSearch={handleSearch}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={loading}

                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={{
                            current: current,
                            PageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} rows</div>) }
                        }}
                    />
                </Col>
            </Row >
            < ViewTable
                setOpenViewDetail={setOpenViewDetail}
                openViewDetail={openViewDetail}
                setDataViewDetail={setDataViewDetail}
                dataViewDetail={dataViewDetail}
            />
            <ModalCreateNewUser
                setOpenModalCreate={setOpenModalCreate}
                openModalCreate={openModalCreate}
                fetchUser={fetchUser}
            />
            <UserImport
                setOpenModalImportUser={setOpenModalImportUser}
                openModalImportUser={openModalImportUser}
                fetchUser={fetchUser}
            />
            <ModalEditUser
                setOpenModalEditUser={setOpenModalEditUser}
                openModalEditUser={openModalEditUser}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                fetchUser={fetchUser}
            />

        </>
    )
}

export default UserTable;