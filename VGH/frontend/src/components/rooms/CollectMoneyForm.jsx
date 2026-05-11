import { useState } from "react";
import { collectMoney } from "../../api/customers";

const CollectMoneyForm = ({ customer, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");

  const handleCollection = async (e) => {
    e.preventDefault();

    // 1. Validation: Ensure it's a number and greater than zero
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      return alert("Please enter a valid amount greater than zero.");
    }

    setLoading(true);
    try {
      // 2. Call the API (Matches the backend PATCH request)
      await collectMoney(customer.id, amount);

      alert(`Successfully collected ₹${amount}`);
      setAmountToAdd(""); // Clear input on success

      // 3. Trigger parent refresh to update RoomGrid and Stats
      onSuccess();
    } catch (err) {
      console.error("Collection Error:", err);
      alert(err.response?.data?.detail || "Collection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCollection} style={styles.container}>
      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          Guest: <strong>{customer.full_name}</strong>
        </p>
        <p style={styles.infoText}>
          {/* Fallback to 0 if amount_collected is null */}
          Current Total Collected: <strong>₹{customer.amount_collected || 0}</strong>
        </p>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Amount to Collect Now (₹)</label>
        <input
          type="number"
          value={amountToAdd}
          onChange={(e) => setAmountToAdd(e.target.value)}
          placeholder="e.g. 500"
          required
          style={styles.input}
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...styles.submitBtn,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Processing..." : `Record Payment of ₹${amountToAdd || 0}`}
      </button>
    </form>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "20px", padding: "10px" },
  infoBox: { backgroundColor: "#f0fdf4", padding: "15px", borderRadius: "8px", border: "1px solid #bbf7d0" },
  infoText: { margin: "5px 0", color: "#166534", fontSize: "14px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#374151" },
  input: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "2px solid #3b82f6",
    fontWeight: "bold",
    outline: "none"
  },
  submitBtn: {
    padding: "14px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "16px",
    transition: "background 0.2s"
  }
};

export default CollectMoneyForm;