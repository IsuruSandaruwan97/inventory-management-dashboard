import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';

const ActionButtons = ({ iconsOnly }: { iconsOnly?: boolean }) => {
  return (
    <Space {...(iconsOnly && { size: 'large' })}>
      <Popconfirm
        title="Reject the request"
        description="Are you sure to reject this request?"
        okText="Yes"
        cancelText="No"
      >
        {iconsOnly ? (
          <DeleteOutlined style={{ color: 'red' }} />
        ) : (
          <Button danger>
            <DeleteOutlined />
            Reject
          </Button>
        )}
      </Popconfirm>

      <Popconfirm
        title="Approve the request"
        description="Are you sure to approve this request?"
        okText="Yes"
        cancelText="No"
      >
        {iconsOnly ? (
          <CheckOutlined style={{ color: 'blue' }} />
        ) : (
          <Button type="primary">
            <CheckOutlined />
            Approve
          </Button>
        )}
      </Popconfirm>
    </Space>
  );
};

export default ActionButtons;
