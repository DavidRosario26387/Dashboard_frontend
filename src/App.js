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

  const severityCounts = [
    logs.filter((l) => l.Stress_category === 'Low').length,
    logs.filter((l) => l.Stress_category === 'Moderate').length,
    logs.filter((l) => l.Stress_category === 'High').length,
  ];

  // Bubble chart data (keyword frequency)
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
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Total messages analyzed: {totalMessages}</h1>

      <div style={{ margin: '40px 0' }}>
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

      <div style={{ margin: '40px 0' }}>
        <h2>Stress severity distribution</h2>
        <Bar
          data={{
            labels: ['Low', 'Moderate', 'High'],
            datasets: [
              {
                label: 'Number of Messages',
                data: severityCounts,
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
              },
            ],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      <div style={{ margin: '40px 0' }}>
        <h2>Trending stress topics</h2>
        <Bubble data={bubbleData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
      </div>
    </div>
  );
}

export default App;
