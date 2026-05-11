const statusConfig = {
  AVAILABLE: {
    bg: "linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)",
    color: "#22543d",
    border: "#9ae6b4",
    label: "Available",
  },
  OCCUPIED: {
    bg: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)",
    color: "#822727",
    border: "#feb2b2",
    label: "Occupied",
  },
  MAINTENANCE: {
    bg: "linear-gradient(135deg, #fffaf0 0%, #feebc8 100%)",
    color: "#7b341e",
    border: "#fbd38d",
    label: "Cleaning",
  },
  RESERVED: {
    bg: "linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)",
    color: "#2d3748",
    border: "#cbd5e0",
    label: "Reserved",
  },
};

const RoomCard = ({ room, onClick }) => {
  const config = statusConfig[room.status] || statusConfig.AVAILABLE;

  return (
    <div
      onClick={() => onClick(room)}
      style={{
        ...styles.card,
        background: config.bg,
        borderColor: config.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 20px -5px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)";
      }}
    >
      <div style={styles.topRow}>
        <span style={styles.roomLabel}>Room</span>
        <div style={{ ...styles.statusIndicator, backgroundColor: config.color }} />
      </div>

      <div style={{ ...styles.roomNumber, color: config.color }}>
        {room.room_number}
      </div>

      <div style={{ ...styles.statusPill, color: config.color, backgroundColor: 'rgba(255,255,255,0.4)' }}>
        {config.label}
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: "20px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "120px",
    border: "1px solid",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  roomLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    opacity: 0.6,
  },
  roomNumber: {
    fontSize: "28px",
    fontWeight: "800",
    margin: "8px 0",
    lineHeight: "1",
  },
  statusPill: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    padding: "4px 8px",
    borderRadius: "6px",
    width: "fit-content",
    letterSpacing: "0.025em",
  },
  statusIndicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  }
};

export default RoomCard;