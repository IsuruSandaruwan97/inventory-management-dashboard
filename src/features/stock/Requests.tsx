import { PlusOutlined } from '@ant-design/icons';
import FilterItems from '@components/FilterItems';
import { TABLE_STATUS } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { TListType } from '@configs/types';
import { stock_requests } from '@data/stock/stock_requests';
import { Card, Collapse, Pagination, Space, Tag } from 'antd';
import { CSSProperties, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ActionButtons from './components/ActionButtons';
import ItemContent from './components/ItemContent';

const maxCount: number = 5;
const Stock = () => {
  const isMobile = useMediaQuery({ maxWidth: 769 });

  const [listType, setListType] = useState<TListType>(TABLE_STATUS[0].value as TListType);

  return (
    <Space direction="vertical" style={styles.space}>
      <Card style={{ padding: 0 }}>
        <FilterItems
          items={TABLE_STATUS}
          value={listType}
          onChangeValue={(value) => setListType(value.toString() as TListType)}
        />
      </Card>
      <Card>
        <Space direction="vertical" style={styles.space}>
          <Collapse
            expandIcon={() => null}
            style={styles.collaps}
            accordion
            items={stock_requests.map((item, index) => {
              return {
                key: index,
                label: (
                  <div style={styles.label}>
                    <Space>
                      <PlusOutlined />
                      {item.title}
                      <Tag color="orange">New</Tag>
                    </Space>
                    <div>{!isMobile && listType !== 'history' && <ActionButtons />}</div>
                  </div>
                ),
                children: (
                  <ItemContent
                    title={item.title}
                    styles={styles}
                    isMobile={isMobile}
                    items={item.request}
                    date={item.date}
                    listType={listType}
                  />
                ),
              };
            })}
          />
          <Pagination style={styles.pagination} defaultCurrent={1} pageSize={maxCount} total={stock_requests.length} />
        </Space>
      </Card>
    </Space>
  );
};

export default Stock;

const styles = StyleSheet.create({
  space: {
    width: '100%',
  } as CSSProperties,
  stockFilters: {
    display: 'flex',
    justifyContent: 'flex-end',
  } as CSSProperties,

  collaps: { width: '100%' } as CSSProperties,
  pagination: { justifyContent: 'center' } as CSSProperties,
  label: {
    width: '100%',

    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as CSSProperties,
  description: {
    display: 'flex',
    marginTop: -5,
    marginBottom: 10,
    fontSize: 12,
    alignContent: 'center',
  } as CSSProperties,
  mobileActionButtons: {
    marginTop: 12,
    justifyContent: 'flex-end',
  } as CSSProperties,
});
