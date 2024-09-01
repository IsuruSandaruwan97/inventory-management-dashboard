/** @format */

import DatePicker from '@components/DatePicker';
import { StyleSheet } from '@configs/stylesheet';
import { KeyValuePair } from '@configs/types';
import {
  DeliveryTable,
  ProductionProgressCard,
  ProductionTable,
  RecentActivities,
  StockTable,
  StoreTable,
} from '@features/dashboard/components';
import { Card, Col, Flex, Radio, Row, Space } from 'antd';
import { Key, useMemo, useState } from 'react';

type TFilter = 'stock' | 'production' | 'store' | 'delivery';

const dataTableFilters: KeyValuePair[] = [
  { value: 'stock', label: 'Stock Items' },
  { value: 'production', label: 'Production Items' },
  { value: 'store', label: 'Store Items' },
  { value: 'delivery', label: 'Delivery' },
];

const renderTable = (type: TFilter) => {
  switch (type) {
    case 'store':
      return <StoreTable />;
    case 'delivery':
      return <DeliveryTable />;
    case 'production':
      return <ProductionTable />;
    default:
      return <StockTable />;
  }
};

const Dashboard = () => {
  const [tableFilter, setTableFilter] = useState<Key>(dataTableFilters[0].value as Key);

  const SelectedTable = useMemo(() => renderTable(tableFilter as TFilter), [tableFilter]);

  return (
    <Space size={'large'} style={styles.fullWidth} direction="vertical">
      <Row>
        <Col xs={24} lg={8} xl={8}>
          <ProductionProgressCard />
        </Col>
        <Col xs={24} lg={8} xl={8}>
          <ProductionProgressCard />
        </Col>
        <Col xs={24} lg={8} xl={8}>
          <RecentActivities />
        </Col>
      </Row>

      <Card>
        <Flex style={styles.fullWidth}>
          <Row style={styles.actionRow}>
            <Col>
              <Radio.Group
                defaultValue={tableFilter}
                onChange={(e) => setTableFilter(e?.target?.value)}
                style={styles.tableTitle}
              >
                {dataTableFilters.map((item: KeyValuePair, index: number) => (
                  <Radio.Button value={item.value} key={index}>
                    {item.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Col>
            <Col>
              <DatePicker onSelectDate={function (): void {}} />
            </Col>
          </Row>
        </Flex>

        {SelectedTable}
      </Card>
    </Space>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  tableTitle: {
    width: '100%',
    marginBottom: 8,
  },
  actionRow: {
    width: '100%',

    display: 'flex',
    justifyContent: 'space-between',
  },
});
