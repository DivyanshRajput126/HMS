export default function GuestTable({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div style={emptyState}>
        <p>No additional guests found for this stay.</p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <table style={table}>
        <thead>
          <tr style={headRow}>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Phone</th>
            <th style={th}>Date of Birth</th>
            <th style={th}>ID Document</th>
            <th style={th}>Document Number</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((g) => (
            <tr key={g.id} style={row} className="table-row-hover">
              <td style={td}>
                <span style={idBadge}>#{g.id}</span>
              </td>
              <td style={{ ...td, fontWeight: 600, color: "#1e293b" }}>
                {g.guest_name}
              </td>
              <td style={td}>{g.guest_phone || "—"}</td>
              <td style={td}>{g.guest_dob || "—"}</td>
              <td style={td}>
                <span style={docBadge}>{g.guest_document_type}</span>
              </td>
              <td style={{ ...td, fontFamily: "monospace", color: "#64748b" }}>
                {g.guest_document_number}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const wrap = {
  width: "100%",
  overflowX: "auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
};

const table = {
  width: "100%",
  minWidth: 800,
  borderCollapse: "separate",
  borderSpacing: 0,
  fontFamily: "'Inter', sans-serif",
};

const headRow = {
  backgroundColor: "#f8fafc",
};

const th = {
  padding: "16px 20px",
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
};

const row = {
  transition: "background-color 0.2s",
};

const td = {
  padding: "16px 20px",
  fontSize: "14px",
  color: "#475569",
  borderBottom: "1px solid #f1f5f9",
  verticalAlign: "middle",
};

const idBadge = {
  backgroundColor: "#f1f5f9",
  color: "#64748b",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "500",
};

const docBadge = {
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "500",
  border: "1px solid #dbeafe",
};

const emptyState = {
  padding: "40px",
  textAlign: "center",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "2px dashed #e2e8f0",
  color: "#94a3b8",
  fontSize: "14px",
};