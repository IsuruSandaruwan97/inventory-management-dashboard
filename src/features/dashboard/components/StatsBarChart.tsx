import { Card } from 'antd';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsBarChart = ({ chartData }: { chartData: any }) => {
  const options = {
    responsive: true,
    //aspectRatio: 4, // Aspect ratio
    maintainAspectRatio: false, // Allows for size customization
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bar Chart Example',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categories',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  };

  return (
    <Card>
      <div style={{ width: '600px', height: '400px' }}>
        {' '}
        {/* Customize size */}
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default StatsBarChart;
