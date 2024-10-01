import { formatDate } from '@utils/index';
import { Card } from 'antd';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the required components from Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type StatsLineChartProps = {
  chartData: any;
};

const StatsLineChart = ({ chartData }: StatsLineChartProps) => {
  const data = {
    labels: chartData.map((item: any) => item.date), // X-axis data (e.g., dates)
    datasets: [
      {
        label: 'Category A',
        data: chartData.filter((item: any) => item.type === 'Category A').map((item: any) => item.value), // Y-axis data for Category A
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color under the line
        fill: true,
        tension: 0.4, // Smooth the line
      },
      {
        label: 'Category B',
        data: chartData.filter((item: any) => item.type === 'Category B').map((item: any) => item.value), // Y-axis data for Category B
        borderColor: 'rgba(255, 99, 132, 1)', // Line color
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill color under the line
        fill: true,
        tension: 0.4, // Smooth the line
      },
    ],
  };

  const options = {
    aspectRatio: 2,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Line Chart Example',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <Card title={`${formatDate(new Date(), 'Do [of] MMMM YYYY')} Progress`}>
      <Line data={data} options={options} />
    </Card>
  );
};

export default StatsLineChart;
