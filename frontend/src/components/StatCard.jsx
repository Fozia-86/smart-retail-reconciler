import {
  FaFileInvoice,
  FaDollarSign,
  FaStore,
  FaClock,
  FaArrowUp,
} from "react-icons/fa";

function StatCard({ title, value, trend }) {
  let icon;

  if (title === "Total Invoices") {
    icon = <FaFileInvoice />;
  } else if (title === "Total Revenue") {
    icon = <FaDollarSign />;
  } else if (title === "Vendors") {
    icon = <FaStore />;
  } else {
    icon = <FaClock />;
  }

  return (
    <div className="card">
      <div className="card-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{value}</p>

      {trend && (
        <div className="card-trend">
          <FaArrowUp style={{ marginRight: "4px" }} />
          {trend}
        </div>
      )}
    </div>
  );
}

export default StatCard;