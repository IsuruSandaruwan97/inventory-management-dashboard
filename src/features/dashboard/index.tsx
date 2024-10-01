import DatePicker from '@components/DatePicker';
import { StyleSheet } from '@configs/stylesheet';
import { KeyValuePair } from '@configs/types';
import { DeliveryTable, ProductionTable, StockTable, StoreTable } from '@features/dashboard/components';
import { Card, Col, Flex, Radio, Row, Space } from 'antd';
import { Key, useMemo, useState } from 'react';
import StatsBarChart from './components/StatsBarChart';
import StatsLineChart from './components/StatsLineChart';
import StatsPieChart from './components/StatsPieChart';

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
    <Space size={'large'} direction="vertical" style={{ overflowY: 'scroll' }}>
      <Row>
        <Col xs={24} lg={12}>
          <StatsPieChart
            chartData={{
              labels: ['store', 'production', 'delivery', 'damage', 'return', 'stock'],
              datasets: [
                {
                  label: 'Color Distribution',
                  data: [12, 19, 3, 5, 2], // Values corresponding to each label
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </Col>
        <Col xs={24} lg={12}>
          <StatsBarChart
            chartData={{
              labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
              datasets: [
                {
                  label: 'Dataset 1',
                  data: [30, 20, 50, 40, 60], // Y-axis data for each category
                  backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
                  borderColor: 'rgba(75, 192, 192, 1)', // Border color for bars
                  borderWidth: 1, // Width of the border
                },
                {
                  label: 'Dataset 2',
                  data: [40, 35, 60, 30, 55], // Second dataset for comparison
                  backgroundColor: 'rgba(255, 99, 132, 0.6)', // Bar color
                  borderColor: 'rgba(255, 99, 132, 1)', // Border color for bars
                  borderWidth: 1, // Width of the border
                },
              ],
            }}
          />
        </Col>
        <Col xs={24}>
          <StatsLineChart
            chartData={[
              { date: '2024-01-01', value: 30, type: 'Category A' },
              { date: '2024-01-02', value: 40, type: 'Category A' },
              { date: '2024-01-03', value: 35, type: 'Category A' },
              { date: '2024-01-04', value: 50, type: 'Category A' },
              { date: '2024-01-01', value: 50, type: 'Category B' },
              { date: '2024-01-02', value: 60, type: 'Category B' },
              { date: '2024-01-03', value: 55, type: 'Category B' },
              { date: '2024-01-04', value: 70, type: 'Category B' },
            ]}
          />
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
