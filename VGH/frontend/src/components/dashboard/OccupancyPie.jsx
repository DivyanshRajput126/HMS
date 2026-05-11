import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function OccupancyPie({ available, occupied }) {
  const data = [
    { name: "Available", value: available },
    { name: "Occupied", value: occupied },
  ];

  // Colors matching your Sidebar and Header theme
  const COLORS = ["#10b981", "#3b82f6"]; // Green for Available, Blue for Occupied

  return (
    <div style={styles.chartWrapper}>
      <h3 style={styles.chartTitle}>Occupancy Status</h3>

      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}  // Makes it a Donut Chart
              outerRadius={100}
              paddingAngle={5}  // Adds space between segments
              dataKey="value"
              stroke="none"      // Removes the white border
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={styles.tooltip}
              itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>

        {/* --- CENTRAL TOTAL LABEL --- */}
        <div style={styles.centerLabel}>
          <span style={styles.totalNum}>{available + occupied}</span>
          <span style={styles.totalText}>Rooms</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  chartWrapper: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    position: "relative",
    width: "350px"
  },
  chartTitle: {
    margin: "0 0 10px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center"
  },
  chartContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  centerLabel: {
    position: "absolute",
    top: "43%", // Centers text inside the donut
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  totalNum: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: "1"
  },
  totalText: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase"
  },
  tooltip: {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    padding: "10px"
  }
};