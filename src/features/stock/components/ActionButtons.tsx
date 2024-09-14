import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { StyleSheet } from '@configs/stylesheet';
import { Button, Popconfirm, Space } from 'antd';

const ActionButtons = ({
  iconsOnly,
  onAccept,
  onReject,
}: {
  iconsOnly?: boolean;
  onAccept: Function;
  onReject: Function;
}) => {
  return (
    <Space {...(iconsOnly && { size: 'large' })} style={styles.container}>
      <Popconfirm
        title="Reject the request"
        description="Are you sure to reject this request?"
        okText="Yes"
        cancelText="No"
        onConfirm={() => onReject()}
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
        onConfirm={() => onAccept()}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 999,
  },
});
