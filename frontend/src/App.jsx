import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import VendorChart from "./components/VendorChart";
import InvoiceTable from "./components/InvoiceTable";

function App() {
  const [stats, setStats] = useState({
    invoices: 0,
    revenue: 0,
    vendors: 0,
    pending: 0,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8080/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log("API Error:", err));
  }, []);

  return (
    <div className="layout">
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="content">
        <Header />

        <SearchBar />

        <div className="dashboard-cards">
          <StatCard
            title="Total Invoices"
            value={stats.invoices}
            trend="↑ 8% from last month"
          />

          <StatCard
            title="Total Revenue"
            value={`$${Number(stats.revenue).toLocaleString()}`}
            trend="↑ 12% from last month"
          />

          <StatCard
            title="Vendors"
            value={stats.vendors}
            trend="2 new this month"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            trend="↓ 4 resolved today"
          />
        </div>

        <div className="charts-row">
          <RevenueChart />
          <VendorChart />
        </div>

        <InvoiceTable />

        <footer className="footer">
          © 2026 Smart Retail Reconciler | Built with React + Flask + BigQuery
        </footer>
      </div>
    </div>
  );
}

export default App;