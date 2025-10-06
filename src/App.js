import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("https://dashboard-backend-elzh.onrender.com/api/logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  // === Metrics ===
  const totalMessages = logs.length;
  const stressedMessages = logs.filter((l) => l.Stress_label === "Stressed");
  const stressedCount = stressedMessages.length;
  const notStressedCount = totalMessages - stressedCount;

  // Severity counts
  const severityCounts = [
    stressedMessages.filter((l) => l.Stress_category === "Low").length,
    stressedMessages.filter((l) => l.Stress_category === "Medium").length,
    stressedMessages.filter((l) => l.Stress_category === "High").length,
  ];

  // Keyword frequency
  const keywordFrequency = {};
  stressedMessages.forEach((l) => {
    if (l.Stress_Reason) {
      keywordFrequency[l.Stress_Reason] =
        (keywordFrequency[l.Stress_Reason] || 0) + 1;
    }
  });

  const bubbles = Object.entries(keywordFrequency).map(([keyword, count]) => {
    const size = Math.min(180, 50 + count * 15);
    return (
      <div
        key={keyword}
        style={{
          width: size,
          height: size,
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#222",
          fontWeight: "600",
          margin: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          padding: "10px",
        }}
      >
        {keyword}
      </div>
    );
  });

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        Stress Detection Dashboard
      </h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        Total messages analyzed: <b>{totalMessages}</b> | Stressed:{" "}
        <b>{stressedCount}</b>
      </p>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "40px",
        }}
      >
        {/* Donut Chart */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Stressed vs Non-Stressed
          </h2>
          <Doughnut
            data={{
              labels: ["Stressed", "Not Stressed"],
              datasets: [
                {
                  data: [stressedCount, notStressedCount],
                  backgroundColor: ["#FF6384", "#36A2EB"],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </div>

        {/* Bar Chart */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Stress Severity Distribution
          </h2>
          <Bar
            data={{
              labels: ["Low", "Moderate", "High"],
              datasets: [
                {
                  label: "Messages",
                  data: severityCounts,
                  backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } },
              },
            }}
          />
        </div>
      </div>

      {/* Bubble Section (Neat Grid) */}
      <div
        style={{
          background: "#f5f5f5",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          marginTop: "40px",
          minHeight: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Distribution of Stress Factors
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {bubbles}
        </div>
      </div>
    </div>
  );
}

export default App;
