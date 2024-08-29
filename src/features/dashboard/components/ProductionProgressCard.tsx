import {
  Card,
  CardProps,
  Col,
  Select,
  Row,
  Space,
  Typography,
  Flex,
} from 'antd';
import { Line } from '@ant-design/charts';
import { useState } from 'react';
import { KeyValuePair } from '@configs/types';
import { StyleSheet } from '@configs/stylesheet';
import dayjs from 'dayjs';
const today = dayjs();

const TypeIndicatorData = [
  {
    title: 'Not started',
    color: '#ff4d4f',
  },
  {
    title: 'In Progress',
    color: '#2194ff',
  },
  {
    title: 'Completed',
    color: '#36c361',
  },
];

const RadialChart = () => {
  const data = [
    { label: '1991', value: 3, category: 'A' },
    { label: '1992', value: 4, category: 'A' },
    { label: '1993', value: 3.5, category: 'A' },
    { label: '1994', value: 5, category: 'A' },
    { label: '1995', value: 4.9, category: 'A' },
    { label: '1996', value: 6, category: 'A' },
    { label: '1997', value: 7, category: 'A' },
    { label: '1998', value: 9, category: 'A' },
    { label: '1999', value: 13, category: 'A' },
    { label: '1991', value: 2, category: 'B' },
    { label: '1992', value: 3, category: 'B' },
    { label: '1993', value: 2.5, category: 'B' },
    { label: '1994', value: 4, category: 'B' },
    { label: '1995', value: 3.9, category: 'B' },
    { label: '1996', value: 5, category: 'B' },
    { label: '1997', value: 6, category: 'B' },
    { label: '1998', value: 8, category: 'B' },
  ];

  const props = {
    data,
    xField: 'label',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    color: ['#1979C9', '#D62A0D'],
  };

  return <Line {...props} />;
};

const items: KeyValuePair[] = [
  ...(today.date() > 2 ? [{ value: 'daily', label: 'Daily' }] : []),
  ...(today.date() > 7 ? [{ value: 'weekly', label: 'Weekly' }] : []),
  ...(today.month() > 1 ? [{ value: 'monthly', label: 'Monthly' }] : []),
];

type Props = CardProps;

const ProductionProgressCard = ({ ...others }: Props) => {
  const [filter, setFilter] = useState<string>(items[0]?.value as string);
  return (
    <Card
      title="Production Progress"
      extra={
        <Select
          value={filter}
          style={{ width: 120 }}
          onChange={(value) => setFilter(value)}
          options={items}
        />
      }
      {...others}>
      <RadialChart />

      <Row style={styles.indicatorRow}>
        {TypeIndicatorData?.map((data, index) => (
          <Col key={index} span={8}>
            <Space>
              <div
                style={{ ...styles.colorLabel, backgroundColor: data.color }}
              />
              <Typography.Text>{data.title}</Typography.Text>
            </Space>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default ProductionProgressCard;

const styles = StyleSheet.create({
  colorLabel: {
    height: '16px',
    width: '16px',
    borderRadius: '4px',
  },
  indicatorRow: {
    textAlign: 'center',
  },
});
