import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/chart-data")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="chart-box">
      <h2>Revenue Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.15)" />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "8px",
              color: "#cbd5e1",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{
              fill: "#38bdf8",
              r: 5,
            }}
            activeDot={{
              r: 7,
              fill: "#60a5fa",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;