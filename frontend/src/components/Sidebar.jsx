import {
  FaHome,
  FaFileInvoice,
  FaStore,
  FaChartBar,
  FaCog,
  FaShoppingCart,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <h2><FaShoppingCart style={{ marginRight: '8px', fontSize: '20px' }} /> Smart Retail</h2>
        <hr />

        <p style={{ color: '#0ea5e9' }}><FaHome /> Dashboard</p>
        <p><FaFileInvoice /> Invoices</p>
        <p><FaStore /> Vendors</p>
        <p><FaChartBar /> Reports</p>
        <p><FaCog /> Settings</p>
      </div>

      <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(148, 163, 184, 0.1)', color: '#64748b', fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>
        © 2026 Smart Retail<br/>v1.0.0
      </div>
    </div>
  );
}

export default Sidebar;