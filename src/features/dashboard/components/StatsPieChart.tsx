import { formatDate } from '@utils/index';
import { Card } from 'antd';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsPieChart = ({ chartData }: { chartData: any }) => {
  return (
    <Card title={`${formatDate(new Date(), 'Do [of] MMMM YYYY')} Progress`}>
      <Pie data={chartData} options={{ responsive: true, aspectRatio: 2 }} />
    </Card>
  );
};

export default StatsPieChart;
