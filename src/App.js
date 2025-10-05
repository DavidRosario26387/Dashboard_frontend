import { useEffect, useState } from 'react';
import axios from 'axios';
import DonutChart from './components/DonutChart';
import BarChart from './components/BarChart';
import BubbleChart from './components/BubbleChart';

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('https://dashboard-backend-elzh.onrender.com')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  // Compute metrics
  const totalMessages = logs.length;
  const stressedCount = logs.filter(l => l.Stress_label === 'Stressed').length;
  const notStressedCount = totalMessages - stressedCount;

  const severityCounts = [
    logs.filter(l => l.Stress_category === 'Low').length,
    logs.filter(l => l.Stress_category === 'Moderate').length,
    logs.filter(l => l.Stress_category === 'High').length
  ];

  const keywordFrequency = {};
  logs.forEach(l => {
    if (l.Stress_Reason) {
      keywordFrequency[l.Stress_Reason] = (keywordFrequency[l.Stress_Reason] || 0) + 1;
    }
  });
  const bubbleData = Object.entries(keywordFrequency).map(([keyword, count]) => ({ keyword, count }));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Total messages analyzed: {totalMessages}</h1>
      <DonutChart data={[stressedCount, notStressedCount]} />
      <BarChart data={severityCounts} />
      <BubbleChart data={bubbleData} />
    </div>
  );
}

export default App;
