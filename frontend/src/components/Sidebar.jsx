import {
  FaHome,
  FaFileInvoice,
  FaStore,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div>
      <h2>🛒 Smart Retail</h2>

      <p className="active">
        <FaHome />
        Dashboard
      </p>

      <p>
        <FaFileInvoice />
        Invoices
      </p>

      <p>
        <FaStore />
        Vendors
      </p>

      <p>
        <FaChartLine />
        Reports
      </p>

      <p>
        <FaCog />
        Settings
      </p>
    </div>
  );
}

export default Sidebar;