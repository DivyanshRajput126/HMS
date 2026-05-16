import { formatDate } from "../../utils/dateUtils";

export default function CustomerTable({ rows, onSettle, onEdit, onDelete }) {
  return (
    <div style={styles.outerWrapper}>
      <div style={styles.scrollContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {/* Sticky ID and Name columns */}
              <th style={{ ...styles.th, ...styles.stickyCol, left: 0, zIndex: 11 }}>ID</th>
              <th style={{ ...styles.th, ...styles.stickyCol, left: 0, zIndex: 11 }}>Registrar No</th>
              <th style={{ ...styles.th, ...styles.stickyCol, left: 45, zIndex: 11 }}>Guest Name</th>

              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>From / To</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Info</th>
              <th style={styles.th}>Vehicle</th>
              <th style={styles.th}>Pax</th>
              <th style={styles.th}>Document Details</th>
              <th style={styles.th}>Room</th>
              <th style={styles.th}>Check-in</th>
              <th style={styles.th}>Check-out</th>
              <th style={styles.th}>Billing</th>
              <th style={styles.th}>Pending Amount</th>
              <th style={styles.th}>Payment Mode</th>
              {/* Sticky Actions column */}
              <th style={{ ...styles.th, ...styles.stickyCol, right: 0, zIndex: 11 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((c, index) => (
              <tr
                key={c.id}
                style={{
                  ...styles.tr,
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#fcfcfc"
                }}
              >
                {/* Sticky ID and Name Cells */}
                <td style={{ ...styles.td, ...styles.stickyCol, left: 0, backgroundColor: "inherit" }}>
                  <span style={styles.idBadge}>{c.id}</span>
                </td>
                <td style={{ ...styles.td, ...styles.stickyCol, left: 45, fontWeight: 700, color: "#1a202c", backgroundColor: "inherit", borderRight: '2px solid #edf2f7' }}>
                  {c.registrar_no}
                </td>
                <td style={{ ...styles.td, ...styles.stickyCol, left: 45, fontWeight: 700, color: "#1a202c", backgroundColor: "inherit", borderRight: '2px solid #edf2f7' }}>
                  {c.full_name}
                </td>

                <td style={styles.td}>{c.phone}</td>
                <td style={styles.td}>{c.email || "-"}</td>
                <td style={{ ...styles.td, color: "#718096" }}>{c.full_address || "-"}</td>
                <td style={styles.td}>
                  <div style={styles.pathway}>
                    <span>{c.coming_from || "Start"}</span>
                    <span style={{ color: "#cbd5e0" }}> → </span>
                    <span>{c.going_to || "End"}</span>
                  </div>
                </td>
                <td style={styles.td}>{c.company_name || "-"}</td>
                <td style={styles.td}>
                  <div style={styles.subInfo}>
                    <span>{formatDate(c.dob)}</span>
                    <span style={styles.dot}>•</span>
                    <span>{c.sex}</span>
                  </div>
                </td>
                <td style={styles.td}>{c.vehicle_no || "-"}</td>
                <td style={styles.td}>{c.no_of_person}</td>
                <td style={styles.td}>
                  <div style={styles.docBox}>
                    <strong style={{ fontSize: '10px' }}>{c.document_type}</strong>
                    <span>{c.document_number}</span>
                    <small style={styles.storageText}>{c.document_storage_address}</small>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.roomBadge}>Room {c.room_id}</span>
                </td>
                <td style={styles.td}>
                  {formatDate(c.checkin_datetime)}
                  <div style={styles.timeText}>{new Date(c.checkin_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td style={styles.td}>
                  {c.checkout_datetime ? (
                    <>
                      {formatDate(c.checkout_datetime)}
                      <div style={styles.timeText}>{new Date(c.checkout_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </>
                  ) : (
                    <span style={styles.activePulse}>Currently In</span>
                  )}
                </td>
                <td style={{ ...styles.td, fontWeight: "800", color: "#2e7d32", fontSize: "14px" }}>
                  ₹{c.amount_collected?.toLocaleString()}
                </td>
                <td style={{ ...styles.td, fontWeight: "800", color: "#dc2626", fontSize: "14px" }}>
                  {c.pending_amount ? `₹${c.pending_amount?.toLocaleString()}` : "-"}
                </td>
                <td style={styles.td}>
                  <span style={styles.roomBadge}>{c.payment_mode}</span>
                </td>
                {/* Sticky Actions Cell */}
                <td style={{ ...styles.td, ...styles.stickyCol, right: 0, backgroundColor: "inherit", borderLeft: '2px solid #edf2f7' }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {c.pending_amount > 0 && onSettle && (
                      <button onClick={() => onSettle(c)} style={{ ...styles.actionBtn, backgroundColor: "#059669" }}>Settle</button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(c)} style={{ ...styles.actionBtn, backgroundColor: "#3182ce" }}>Edit</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(c.id)} style={{ ...styles.actionBtn, backgroundColor: "#e53e3e" }}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  // Keeps the whole component within screen width
  outerWrapper: {
    width: "100%",
    maxWidth: "100%",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  // Fixed container that enables the internal scroll
  scrollContainer: {
    overflowX: "auto",
    width: "100%",
    WebkitOverflowScrolling: "touch", // Smooth scroll for mobile
  },
  table: {
    width: "max-content", // Key: Forces table to respect column widths
    minWidth: "100%",
    borderCollapse: "separate", // Necessary for sticky borders
    borderSpacing: 0,
    fontFamily: "inherit",
  },
  stickyCol: {
    position: "sticky",
    zIndex: 5,
    boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)", // Shadow to show separation when scrolling
  },
  th: {
    position: "sticky",
    top: 0,
    backgroundColor: "#f8fafc",
    padding: "16px 12px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    borderBottom: "2px solid #e2e8f0",
  },
  tr: {
    transition: "background-color 0.2s ease",
  },
  td: {
    padding: "14px 12px",
    whiteSpace: "nowrap",
    fontSize: "13px",
    color: "#4a5568",
    borderBottom: "1px solid #edf2f7",
  },
  idBadge: {
    backgroundColor: "#edf2f7",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "600",
    color: "#4a5568",
  },
  roomBadge: {
    backgroundColor: "#ebf8ff",
    color: "#2b6cb0",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "11px",
    border: "1px solid #bee3f8",
  },
  docBox: { display: "flex", flexDirection: "column", lineHeight: "1.2" },
  storageText: { color: "#a0aec0", fontSize: "10px", marginTop: "2px" },
  timeText: { fontSize: "11px", color: "#a0aec0" },
  pathway: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" },
  subInfo: { display: "flex", alignItems: "center", gap: "6px", color: "#718096" },
  dot: { color: "#cbd5e0" },
  activePulse: { color: "#3182ce", fontSize: "11px", fontWeight: "bold", fontStyle: "italic" },
  actionBtn: {
    padding: "6px 10px",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
    textTransform: "uppercase"
  }
};