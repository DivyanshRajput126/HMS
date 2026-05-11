import { useState } from "react";
import { collectMoney } from "../../api/customers";

export default function SettlePaymentModal({ customer, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await collectMoney(customer.id, Number(amount));
      onSuccess();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to settle payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Settle Payment</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoLabel}>Customer</p>
          <p style={styles.infoValue}>{customer.full_name} (ID: {customer.id})</p>
          
          <div style={styles.statsRow}>
            <div>
              <p style={styles.infoLabel}>Total Charged</p>
              <p style={styles.infoValue}>₹{customer.amount_charged?.toLocaleString()}</p>
            </div>
            <div>
              <p style={styles.infoLabel}>Pending Amount</p>
              <p style={{ ...styles.infoValue, color: "#e53e3e" }}>₹{customer.pending_amount?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount Collected Now (₹)</label>
            <input
              autoFocus
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              style={styles.input}
              required
            />
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={loading}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? "Processing..." : "Confirm Settlement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000,
    display: "flex", justifyContent: "center", alignItems: "center",
    backdropFilter: "blur(4px)"
  },
  modal: {
    backgroundColor: "#fff", padding: "24px", borderRadius: "12px", width: "400px", maxWidth: "90%",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { margin: 0, fontSize: "20px", color: "#1a202c", fontWeight: "700" },
  closeBtn: { background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#a0aec0" },
  infoBox: {
    backgroundColor: "#f7fafc",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #edf2f7"
  },
  infoLabel: { fontSize: "11px", fontWeight: "700", color: "#718096", textTransform: "uppercase", margin: "0 0 4px 0" },
  infoValue: { fontSize: "15px", fontWeight: "600", color: "#2d3748", margin: "0 0 12px 0" },
  statsRow: { display: "flex", justifyContent: "space-between", marginTop: "8px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#4a5568" },
  input: { 
    padding: "12px", 
    borderRadius: "8px", 
    border: "2px solid #e2e8f0", 
    fontSize: "16px", 
    fontWeight: "600",
    outline: "none",
    transition: "border-color 0.2s"
  },
  footer: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" },
  cancelBtn: { padding: "10px 20px", borderRadius: "8px", border: "1px solid #cbd5e0", background: "#fff", cursor: "pointer", fontWeight: "600", color: "#4a5568" },
  saveBtn: { 
    padding: "10px 20px", 
    borderRadius: "8px", 
    border: "none", 
    background: "#059669", 
    color: "#fff", 
    cursor: "pointer", 
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.4)"
  }
};
