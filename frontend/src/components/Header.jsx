function Header() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="header">

      <div>
        <h1>Smart Retail Dashboard</h1>
        <p>{today}</p>
      </div>

      <div className="header-right">

        <div className="notification">
          🔔
        </div>

        <div className="user-box">
          <div className="avatar">
            F
          </div>

          <div>
            <strong>Fozia</strong>
            <p>Administrator</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Header;