import { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut, Bar, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement
);

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get('https://dashboard-backend-elzh.onrender.com/api/logs')
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Compute metrics
  const totalMessages = logs.length;
  const stressedCount = logs.filter((l) => l.Stress_label === 'Stressed').length;
  const notStressedCount = totalMessages - stressedCount;

  // Stress reason frequency
  const reasonFrequency = {};
  logs.forEach((l) => {
    if (l.Stress_Reason) {
      reasonFrequency[l.Stress_Reason] = (reasonFrequency[l.Stress_Reason] || 0) + 1;
    }
  });

  // Bubble chart data (keywords)
  const keywordFrequency = {};
  logs.forEach((l) => {
    if (l.Stress_Reason) {
      keywordFrequency[l.Stress_Reason] = (keywordFrequency[l.Stress_Reason] || 0) + 1;
    }
  });

  const bubbleData = {
    datasets: Object.entries(keywordFrequency).map(([keyword, count], index) => ({
      label: keyword,
      data: [{ x: index + 1, y: count, r: count * 5 }],
      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
    })),
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Total messages analyzed: {totalMessages}</h1>

      {/* Flex container for Donut + Horizontal Bar */}
      <div style={{ display: 'flex', gap: '40px', margin: '40px 0', flexWrap: 'wrap' }}>
        {/* Donut chart */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2># of stressed vs non-stressed messages</h2>
          <Doughnut
            data={{
              labels: ['Stressed', 'Not Stressed'],
              datasets: [
                {
                  data: [stressedCount, notStressedCount],
                  backgroundColor: ['#FF6384', '#36A2EB'],
                },
              ],
            }}
          />
        </div>

        {/* Horizontal bar chart for stress reasons */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>Stress reasons contribution</h2>
          <Bar
            data={{
              labels: Object.keys(reasonFrequency),
              datasets: [
                {
                  label: 'Number of Messages',
                  data: Object.values(reasonFrequency),
                  backgroundColor: '#FFCE56',
                },
              ],
            }}
            options={{
              indexAxis: 'y', // horizontal
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>

      {/* Bubble chart */}
      <div style={{ margin: '40px 0' }}>
        <h2>Trending stress topics</h2>
        <Bubble
          data={bubbleData}
          options={{ responsive: true, plugins: { legend: { display: true } } }}
        />
      </div>
    </div>
  );
}

export default App;
