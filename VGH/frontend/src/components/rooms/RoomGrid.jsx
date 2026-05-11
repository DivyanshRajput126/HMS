import RoomCard from "./RoomCard";

const RoomGrid = ({ rooms, onRoomClick }) => {
  return (
    <div style={styles.wrapper}>
      {/* --- Legend Area --- */}
      <div style={styles.legendBar}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.dot, backgroundColor: "#48bb78" }} />
          <span>Available</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.dot, backgroundColor: "#f56565" }} />
          <span>Occupied</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.dot, backgroundColor: "#ed8936" }} />
          <span>Dirty / Cleaning</span>
        </div>
      </div>

      {/* --- Grid Layout --- */}
      <div style={styles.grid}>
        {/* Add ?. and || [] to handle non-array data safely */}
        {(Array.isArray(rooms) ? rooms : []).map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={onRoomClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {(!rooms || rooms.length === 0) && (
        <div style={styles.empty}>
          <p>No rooms found in this category.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  legendBar: {
    display: "flex",
    gap: "20px",
    padding: "0 4px",
    marginBottom: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  grid: {
    display: "grid",
    // Increased min-width for a more substantial card feel
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "20px",
  },
  empty: {
    textAlign: "center",
    padding: "60px",
    color: "#a0aec0",
    border: "2px dashed #e2e8f0",
    borderRadius: "12px",
  }
};

export default RoomGrid;