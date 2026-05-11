import { useState, useEffect } from "react";
import { checkoutByRoom } from "../../api/customers";

const CheckoutForm = ({ customer, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [checkoutDate, setCheckoutDate] = useState(
    new Date().toLocaleString("sv-SE").replace(" ", "T").slice(0, 16)
  );

  const dailyRate = customer.amount_charged || 0;
  const alreadyCollected = customer.amount_collected || 0; // Amount guest already paid

  const [totalBill, setTotalBill] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [finalSettleAmount, setFinalSettleAmount] = useState(0);
  const [amountPaidNow, setAmountPaidNow] = useState(0);
  const [stayDetails, setStayDetails] = useState({ days: 1 });

  useEffect(() => {
    const start = new Date(customer.checkin_datetime);
    const end = new Date(checkoutDate);
    const diffInMs = end - start;

    // Rounding up: staying for any part of a day counts as a full day
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) || 1;
    const calculatedTotal = diffInDays * dailyRate;

    setTotalBill(calculatedTotal);

    // Logic: Net Balance = (Daily Rate * Days) - Already Paid
    const calculatedNet = calculatedTotal - alreadyCollected;
    setNetBalance(calculatedNet);

    // Default the final liability and the paid-now amount to the calculated net balance
    setFinalSettleAmount(calculatedNet);
    setAmountPaidNow(calculatedNet);

    setStayDetails({ days: diffInDays });
  }, [checkoutDate, dailyRate, alreadyCollected, customer.checkin_datetime]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pendingRemainder = finalSettleAmount - amountPaidNow;
      await checkoutByRoom(customer.room_id, amountPaidNow, pendingRemainder, checkoutDate);
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <form onSubmit={submit} style={styles.formContainer}>
      <div style={styles.header}>
        <span style={styles.roomBadge}>Room {customer.room_id}</span>
        <h3 style={styles.title}>Guest Checkout</h3>
      </div>

      <div style={styles.billBox}>
        <div style={styles.billRow}>
          <span style={styles.label}>Guest Name</span>
          <span style={styles.value}>{customer.full_name}</span>
        </div>
        <div style={styles.billRow}>
          <span style={styles.label}>Check-in</span>
          <span style={styles.value}>{formatDateTime(customer.checkin_datetime)}</span>
        </div>

        <hr style={styles.divider} />

        <div style={styles.billRow}>
          <span style={styles.label}>Stay Duration</span>
          <span style={styles.value}>{stayDetails.days} Day(s) x ₹{dailyRate}</span>
        </div>

        <div style={styles.billRow}>
          <span style={styles.label}>Total Gross Bill</span>
          <span style={styles.value}>₹{totalBill}</span>
        </div>

        <div style={styles.billRow}>
          <span style={styles.label}>Amount Already Collected</span>
          <span style={{ ...styles.value, color: "#059669" }}>- ₹{alreadyCollected}</span>
        </div>

        <div style={{ ...styles.billRow, marginTop: "10px", padding: "10px", background: "#f1f5f9", borderRadius: "8px" }}>
          <span style={{ ...styles.label, fontWeight: "bold", color: "#1e293b" }}>Net Pending Balance</span>
          <span style={{ ...styles.value, fontSize: "18px", color: "#dc2626" }}>₹{netBalance}</span>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.inputLabel}>Adjust Check-out Date/Time</label>
        <input
          type="datetime-local"
          value={checkoutDate}
          onChange={(e) => setCheckoutDate(e.target.value)}
          required
          style={styles.input}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div style={{ ...styles.inputGroup, flex: 1, minWidth: "150px" }}>
          <label style={styles.inputLabel}>
            Final Settle Amount (₹)
          </label>
          <input
            type="number"
            value={finalSettleAmount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFinalSettleAmount(val);
              setAmountPaidNow(val); // Auto-update amount paying now when final amount changes
            }}
            required
            style={{ ...styles.amountInput, borderColor: "#2563eb", color: "#2563eb" }}
          />
        </div>

        <div style={{ ...styles.inputGroup, flex: 1, minWidth: "150px" }}>
          <label style={styles.inputLabel}>
            Amount Paying Now (₹)
          </label>
          <input
            type="number"
            value={amountPaidNow}
            onChange={(e) => setAmountPaidNow(Number(e.target.value))}
            required
            style={{ ...styles.amountInput, borderColor: "#059669", color: "#059669" }}
          />
        </div>
      </div>

      {finalSettleAmount - amountPaidNow !== 0 && (
        <div style={{ ...styles.billRow, padding: "10px", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "8px" }}>
          <span style={{ ...styles.label, fontWeight: "bold", color: "#b45309" }}>Amount Moving to Pending</span>
          <span style={{ ...styles.value, fontSize: "16px", color: "#d97706" }}>₹{finalSettleAmount - amountPaidNow}</span>
        </div>
      )}

      <button disabled={loading} style={{
        ...styles.confirmBtn,
        background: "#dc2626"
      }}>
        {loading ? "Processing..." : `Confirm Checkout`}
      </button>

      <p style={styles.footerNote}>
        * Double check the "Amount Paying Now" and "Pending" amounts before confirming.
      </p>
    </form>
  );
};

const styles = {
  formContainer: { display: "flex", flexDirection: "column", gap: "20px", padding: "10px 5px", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "5px" },
  title: { margin: 0, fontSize: "20px", color: "#1e293b", fontWeight: "700" },
  roomBadge: { backgroundColor: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", border: "1px solid #e2e8f0" },
  billBox: { background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #f1f5f9" },
  billRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  label: { fontSize: "13px", color: "#64748b" },
  value: { fontSize: "14px", fontWeight: "600", color: "#1e293b" },
  divider: { border: "none", borderTop: "1px dashed #e2e8f0", margin: "12px 0" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  inputLabel: { fontSize: "14px", fontWeight: "600", color: "#475569" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", backgroundColor: "#fff" },
  amountInput: { padding: "14px", fontSize: "18px", fontWeight: "700", borderRadius: "8px", border: "2px solid #e2e8f0", color: "#111827", outline: "none", transition: "border-color 0.2s", backgroundColor: "#fff" },
  confirmBtn: { padding: "14px", background: "#dc2626", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.2)", transition: "transform 0.1s ease" },
  footerNote: { margin: 0, fontSize: "11px", textAlign: "center", color: "#94a3b8" }
};

export default CheckoutForm;