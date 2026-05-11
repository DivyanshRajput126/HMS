import { useEffect, useState } from "react";
import { fetchDashboard } from "../api/dashboard";
import StatCard from "../components/dashboard/StatCard";
import OccupancyPie from "../components/dashboard/OccupancyPie";

export default function Dashboard() {
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await fetchDashboard();
    setData(res);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Hotel Dashboard</h2>

      {/* Stat Cards */}

      <div style={grid}>
        <StatCard title="Total Rooms" value={data.rooms.total} />
        <StatCard title="Available Rooms" value={data.rooms.available} />
        <StatCard title="Occupied Rooms" value={data.rooms.occupied} />

        <StatCard title="Today Check-ins" value={data.today.checkins} />
        <StatCard title="Today Check-outs" value={data.today.checkouts} />

        {/* <StatCard title="Monthly Income" value={`₹ ${data.finance.income}`} />
        <StatCard title="Monthly Expense" value={`₹ ${data.finance.expense}`} /> */}
        {/* <StatCard
          title="Net"
          value={`₹ ${data.finance.net}`}
        /> */}
      </div>

      {/* Charts */}

      <div style={chartRow}>
        <div>
          <h3>Room Occupancy</h3>
          <OccupancyPie
            available={data.rooms.available}
            occupied={data.rooms.occupied}
          />
        </div>
      </div>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 30,
};

const chartRow = {
  display: "flex",
  gap: 40,
  flexWrap: "wrap",
};
