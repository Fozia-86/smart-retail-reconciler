function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="header">
      <div>
        <h1>Smart Retail Dashboard</h1>
        <p>{today}</p>
      </div>

      <div>
        <p>Welcome, Fozia 👋</p>
      </div>
    </div>
  );
}

export default Header;