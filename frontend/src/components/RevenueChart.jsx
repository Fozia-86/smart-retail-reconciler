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
  const [data, setData] =useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/chart-data")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="chart-box">
      <h2>Monthly Revenue</h2>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(59,130,246,.15)"
          />

          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            style={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "10px",
              color: "white",
            }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;