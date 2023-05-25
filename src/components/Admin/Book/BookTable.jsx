import { Button, Table, Col, Row, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchListUser, callDeleteBook, callFetchListBook } from '../../../services/api';
import InputSearch from './InputSearch';
import {
    PlusOutlined, ImportOutlined, ExportOutlined, UndoOutlined,
    DeleteTwoTone, EditTwoTone
} from '@ant-design/icons';
import * as XLSX from "xlsx";
import BookViewDetail from './BookViewDetail';
import BookModalCreate from './BookModalCreate';
import BookModalUpdate from './BookModalUpdate';
import moment from 'moment';
import { FORMAT_DATE_DISPLAY } from '../../../utils/constant';


const BookTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [dataBookViewDetail, setDataBookViewDetail] = useState('');
    const [openBookViewDetail, setOpenBookViewDetail] = useState(false);

    const [openBookModalCreate, setOpenBookModalCreate] = useState(false);

    const [openBookModalUpdate, setOpenBookModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState('');

    const [openModalBookImportUser, setOpenModalBookImportUser] = useState(false);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a onClick={() => {
                        setDataBookViewDetail(record);
                        setOpenBookViewDetail(true);
                    }}>{record._id}</a>
                )
            }
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            render: (text, record, index) => {
                return (
                    <div>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record?.price ?? 0)}
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: 'Ngày cập nhật',
            // dataIndex: 'createdAt',
            render: (text, record, index) => {
                return (
                    <div>
                        {moment(record?.createdAt).format(FORMAT_DATE_DISPLAY)} {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBookViewDetail?.price ?? 0)}
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: 'Action',
            width: 150,
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
                                    setOpenBookModalUpdate(true);
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
                    {/* <Button
                        icon={<ImportOutlined />}
                        type="primary"
                        onClick={() => { setOpenModalBookImportUser(true) }}
                    >Import
                    </Button> */}
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            setOpenBookModalCreate(true)
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
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBook = async () => {
        setLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchListBook(query);
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
        const res = await callDeleteBook(userId);
        if (res && res.data) {
            message.success('Xóa user thành công');
            fetchBook();
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
            < BookViewDetail
                setOpenBookViewDetail={setOpenBookViewDetail}
                openBookViewDetail={openBookViewDetail}
                setDataBookViewDetail={setDataBookViewDetail}
                dataBookViewDetail={dataBookViewDetail}
            />
            <BookModalCreate
                setOpenBookModalCreate={setOpenBookModalCreate}
                openBookModalCreate={openBookModalCreate}
                fetchBook={fetchBook}
            />

            <BookModalUpdate
                setOpenBookModalUpdate={setOpenBookModalUpdate}
                openBookModalUpdate={openBookModalUpdate}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                fetchBook={fetchBook}
            />

        </>
    )
}

export default BookTable;