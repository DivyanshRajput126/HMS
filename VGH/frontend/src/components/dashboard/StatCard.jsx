export default function StatCard({ title, value }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

const card = {
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 12,
  minWidth: 180,
  background: "#fff",
};
