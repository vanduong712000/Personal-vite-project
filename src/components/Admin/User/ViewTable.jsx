import { Descriptions, Drawer, Badge } from 'antd';
import moment from 'moment';

const ViewTable = (props) => {
    const { openViewDetail, dataViewDetail, setOpenViewDetail, setDataViewDetail } = props;
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <>
            <Drawer
                title="Basic Drawer"
                onClose={onClose}
                open={openViewDetail}
                width={"50vw"}
            >
                <Descriptions
                    bordered
                    title="Custom Size"
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY, hh:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY, hh:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>


        </>
    );
}

export default ViewTable;