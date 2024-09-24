import Table from '@components/Table';
import { StyleSheet } from '@stylesheet';
import { Button, Card, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
type ItemTableProps = {
  items: any[];
  columns: ColumnsType<any> | undefined;
  onSubmit: () => void;
  loading?: boolean;
};

const ItemTable = ({ items, columns, loading = false, onSubmit }: ItemTableProps) => {
  return (
    <Card style={styles.cardContainer}>
      <div style={styles.tableContainer}>
        <Table rowKey={'id'} dataSource={items || []} columns={columns} scroll={{ y: 200 }} />
      </div>
      <Space style={styles.submitButtonContainer}>
        <Button onClick={() => onSubmit()} loading={loading} style={styles.submitButton} type={'primary'}>
          Submit
        </Button>
      </Space>
    </Card>
  );
};
export default ItemTable;

const styles = StyleSheet.create({
  cardContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableContainer: {
    flexGrow: 1,
    minHeight: '290px',
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0',
  },
  submitButton: {
    width: 150,
  },
});
