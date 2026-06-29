function InvoiceTable() {
  const invoices = [
    {
      id: "INV-1001",
      vendor: "Istanbul Mall",
      date: "29 Jun 2026",
      amount: "$250",
      status: "Processed",
    },
    {
      id: "INV-1002",
      vendor: "Metro Store",
      date: "29 Jun 2026",
      amount: "$180",
      status: "Pending",
    },
    {
      id: "INV-1003",
      vendor: "Forum Mall",
      date: "28 Jun 2026",
      amount: "$425",
      status: "Processed",
    },
    {
      id: "INV-1004",
      vendor: "Carousel Mall",
      date: "27 Jun 2026",
      amount: "$360",
      status: "Processed",
    },
    {
      id: "INV-1005",
      vendor: "Capitol Mall",
      date: "26 Jun 2026",
      amount: "$520",
      status: "Pending",
    },
  ];

  return (
    <div className="table-container">
      <h2>Recent Invoices</h2>

      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Vendor</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td style={{ fontWeight: 600, color: "#38bdf8" }}>{inv.id}</td>
              <td>{inv.vendor}</td>
              <td>{inv.date}</td>
              <td style={{ fontWeight: 500 }}>{inv.amount}</td>
              <td>
                <span
                  className={`status-badge status-${inv.status.toLowerCase()}`}
                >
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;