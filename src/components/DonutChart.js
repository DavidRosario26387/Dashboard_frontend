import { Doughnut } from 'react-chartjs-2';

const DonutChart = ({ data }) => {
  const chartData = {
    labels: ['Stressed', 'Not Stressed'],
    datasets: [{
      data: data,
      backgroundColor: ['#FF6384', '#36A2EB'],
    }]
  };
  return <Doughnut data={chartData} />;
};

export default DonutChart;
