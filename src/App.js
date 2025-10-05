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
  const stressedMessages = logs.filter((l) => l.Stress_label === 'Stressed');
  const stressedCount = stressedMessages.length;
  const notStressedCount = totalMessages - stressedCount;

  // Severity counts
  const severityCounts = [
    stressedMessages.filter((l) => l.Stress_category === 'Low').length,
    stressedMessages.filter((l) => l.Stress_category === 'Medium').length,
    stressedMessages.filter((l) => l.Stress_category === 'High').length,
  ];

  // Keyword frequency for bubble chart
  const keywordFrequency = {};
  stressedMessages.forEach((l) => {
    if (l.Stress_Reason) {
      keywordFrequency[l.Stress_Reason] = (keywordFrequency[l.Stress_Reason] || 0) + 1;
    }
  });

  const bubbleData = {
    datasets: Object.entries(keywordFrequency).map(([keyword, count], index) => ({
      label: keyword,
      data: [{ x: index + 1, y: count, r: count * 5 }], // size proportional to count
      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
    })),
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <p>Total messages analyzed: {totalMessages}</p>
      <p>Total messages with stress: {stressedCount}</p>

      {/* Donut & Bar charts side by side */}
      <div style={{ display: 'flex', gap: '40px', margin: '40px 0', flexWrap: 'wrap' }}>
        {/* Donut chart */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>Stressed vs Non-stressed</h2>
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

        {/* Bar chart for severity */}
        <div style={{ flex: 1, minWidth: '300px' }}>
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
            options={{
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
