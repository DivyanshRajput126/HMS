import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ProfitPie({ income, expense }) {
  // Define our professional colors
  const COLORS = {
    Income: "#2e7d32", // Deep Green
    Expense: "#d32f2f", // Deep Red
  };

  const data = [
    { name: "Income", value: Number(income) || 0 },
    { name: "Expense", value: Number(expense) || 0 },
  ];

  const netResult = income - expense;
  const isProfit = netResult >= 0;

  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      textAlign: "center"
    }}>
      <h3 style={{ marginBottom: "10px", color: "#333" }}>Financial Overview</h3>

      {/* Container to make chart responsive */}
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60} // Makes it a Donut Chart for a modern look
              paddingAngle={5}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Profit/Loss Summary */}
      <div style={{ marginTop: "15px", padding: "10px", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>Net Result</p>
        <h2 style={{ margin: 0, color: isProfit ? "#2e7d32" : "#d32f2f" }}>
          {isProfit ? "+" : ""}₹{netResult.toLocaleString()}
          <span style={{ fontSize: "16px", marginLeft: "8px" }}>
            ({isProfit ? "Profit" : "Loss"})
          </span>
        </h2>
      </div>
    </div>
  );
}