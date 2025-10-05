import { Bubble } from 'react-chartjs-2';

const BubbleChart = ({ data }) => {
  const chartData = {
    datasets: data.map(item => ({
      label: item.keyword,
      data: [{ x: Math.random()*10, y: Math.random()*10, r: item.count*2 }],
      backgroundColor: 'rgba(255,99,132,0.5)'
    }))
  };
  return <Bubble data={chartData} />;
};

export default BubbleChart;
