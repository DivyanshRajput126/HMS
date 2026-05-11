export default function ExpenseTable({ data, onEdit, onDelete, isAdmin }) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Month & Year</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Amount</th>
            {isAdmin && <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 5 : 4} style={styles.emptyState}>
                No expenses found.
              </td>
            </tr>
          ) : (
            data.map((e) => (
              <tr key={e.id} style={styles.tr} onMouseEnter={(el) => el.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(el) => el.currentTarget.style.backgroundColor = "transparent"}>
                <td style={styles.td}>
                  {new Date(e.expense_date).toLocaleString('en', { month: 'long', year: 'numeric' })}
                </td>
                <td style={styles.td}>
                  <span style={styles.badge}>{e.expense_type}</span>
                </td>
                <td style={{ ...styles.td, color: "#4a5568" }}>{e.expense_details || "-"}</td>
                <td style={{ ...styles.td, fontWeight: "bold", color: "#2d3748" }}>
                  ₹ {Number(e.expense_amount).toLocaleString()}
                </td>

                {isAdmin && (
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <div style={styles.actionGroup}>
                      <button
                        onClick={() => onEdit(e)}
                        style={styles.editBtn}
                        title="Edit Entry"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(e.id)}
                        style={styles.deleteBtn}
                        title="Delete Entry"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    textAlign: "left",
  },
  th: {
    backgroundColor: "#f7fafc",
    color: "#718096",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "0.05em",
    padding: "16px",
    borderBottom: "2px solid #edf2f7",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #edf2f7",
    verticalAlign: "middle",
  },
  tr: {
    transition: "background-color 0.2s ease",
  },
  timeText: {
    display: "block",
    fontSize: "11px",
    color: "#a0aec0",
    marginTop: "4px",
  },
  badge: {
    backgroundColor: "#ebf8ff",
    color: "#2b6cb0",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  actionGroup: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
  editBtn: {
    padding: "6px 12px",
    backgroundColor: "#fff",
    color: "#3182ce",
    border: "1px solid #3182ce",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#fff",
    color: "#e53e3e",
    border: "1px solid #e53e3e",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#a0aec0",
    fontStyle: "italic",
  }
};