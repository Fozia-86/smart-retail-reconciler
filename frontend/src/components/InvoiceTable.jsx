import { useEffect, useState } from "react";

function InvoiceTable() {

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.log(err));
  }, []);

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

          {invoices.map((inv, index) => (

            <tr key={index}>

              <td style={{color:"#2563eb",fontWeight:"600"}}>
                {inv.id}
              </td>

              <td>{inv.vendor}</td>

              <td>{inv.date}</td>

              <td>{inv.amount}</td>

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