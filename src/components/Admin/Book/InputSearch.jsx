
import { Button, Col, Form, Input, Row, Space, theme } from 'antd';



const InputSearch = (props) => {
    const { token } = theme.useToken();
    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    }
    const [form] = Form.useForm();

    const onFinish = (values) => {
        let query = "";
        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`
        }
        if (values.author) {
            query += `&author=/${values.author}/i`
        }
        if (values.createdAt) {
            query += `&phone=/${values.createdAt}/i`
        }
        if (query) {
            props.handleSearch(query);
        }

        // console.log('Received values of form: ', values);
    };


    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name={`mainText`} label={`Tên sách`} labelCol={{ span: 24 }}>
                        <Input placeholder="Tìm tên" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={`author`} label={`Tác giả`} labelCol={{ span: 24 }}>
                        <Input placeholder="Tìm email" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name={`category`} label={`Thể loại`} labelCol={{ span: 24 }}>
                        <Input placeholder="Tìm số điện thoại" />
                    </Form.Item>
                </Col>
            </Row>
            <div style={{ textAlign: 'right', }}>
                <Space size="small">
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button onClick={() => { form.resetFields(); }}>
                        Clear
                    </Button>
                </Space>
            </div>
        </Form>
    );
};
export default InputSearch;