import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
import { v4 as uuidv4 } from 'uuid';

const BookViewDetail = (props) => {
    const { openBookViewDetail, dataBookViewDetail, setOpenBookViewDetail, setDataBookViewDetail } = props;
    const onClose = () => {
        setOpenBookViewDetail(false);
        setDataBookViewDetail(null);
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (dataBookViewDetail) {
            let imgThumbnail = {}, imgSlider = []
            if (dataBookViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataBookViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBookViewDetail.thumbnail}`,
                }
            }
            if (dataBookViewDetail.slider && dataBookViewDetail.slider.length > 0) {
                dataBookViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataBookViewDetail]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                onClose={onClose}
                open={openBookViewDetail}
                width={"50vw"}
            >
                <Descriptions
                    bordered
                    title="Thông tin Book"
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataBookViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataBookViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataBookViewDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataBookViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBookViewDetail?.price ?? 0)}</Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataBookViewDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataBookViewDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                </Descriptions>

                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer >


        </>
    );
}

export default BookViewDetail;