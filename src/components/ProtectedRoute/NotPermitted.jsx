import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotPermitted = () => {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button
                        type="primary"
                        onClick={() => navigate('/')}
                    >Back Home</Button>}
                />
            </div>
        </>
    )
}

export default NotPermitted;