import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  const chartData = {
    labels: ['Low', 'Moderate', 'High'],
    datasets: [{
      label: 'Stress Severity',
      data: data,
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
    }]
  };
  return <Bar data={chartData} />;
};

export default BarChart;
