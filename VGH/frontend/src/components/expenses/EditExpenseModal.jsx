import { useEffect, useState } from "react";
import { updateExpense } from "../../api/expenses";
import Modal from "../common/Modal";

export default function EditExpenseModal({ open, onClose, expense, onSaved }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define options for reuse
  const EXPENSE_OPTIONS = ["Salary", "Light Bill", "Laundry", "Miscellaneous"];

  useEffect(() => {
    if (!expense) return;

    const d = new Date(expense.expense_date);

    setForm({
      expense_type: expense.expense_type || "",
      expense_details: expense.expense_details || "",
      expense_amount: expense.expense_amount || "",
      expense_date: expense.expense_date || "",
      expense_time: expense.expense_time || "00:00",
    });
  }, [expense]);

  if (!expense || !form) return null;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setLoading(true);
    try {
      await updateExpense(expense.id, {
        expense_type: form.expense_type,
        expense_details: form.expense_type === "Miscellaneous" ? form.expense_details : form.expense_type,
        expense_amount: Number(form.expense_amount),
        expense_date: form.expense_date,
        expense_time: form.expense_time,
      });
      onSaved();
      onClose();
    } catch (e) {
      console.error("Error updating expense:", e);
      alert("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit Monthly Expense">
      <div style={styles.container}>

        {/* Type & Amount Row */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Expense Type</label>
            <select
              name="expense_type"
              style={styles.input}
              value={form.expense_type}
              onChange={change}
              required
            >
              <option value="" disabled>Select Type</option>
              {EXPENSE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Amount (₹)</label>
            <input
              type="number"
              name="expense_amount"
              style={styles.input}
              value={form.expense_amount}
              onChange={change}
              required
            />
          </div>
        </div>

        {form.expense_type === "Miscellaneous" && (
          <div style={styles.field}>
            <label style={styles.label}>Miscellaneous Details</label>
            <textarea
              name="expense_details"
              style={{ ...styles.input, height: "80px", resize: "none" }}
              value={form.expense_details}
              onChange={change}
              placeholder="Please describe this miscellaneous expense..."
              required
            />
          </div>
        )}

        {/* Date & Time Row -> Month & Year */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              name="expense_date"
              style={styles.input}
              value={form.expense_date}
              onChange={change}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Time</label>
            <input
              type="time"
              name="expense_time"
              style={styles.input}
              value={form.expense_time}
              onChange={change}
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button style={styles.saveBtn} onClick={save} disabled={loading}>
            {loading ? "Updating..." : "Update Expense"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    padding: "10px 5px",
    minWidth: "450px", // Slightly widened to accommodate select
  },
  row: {
    display: "flex",
    gap: "15px",
    width: "100%",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#4a5568",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
    backgroundColor: "#fff",
    cursor: "pointer"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
    borderTop: "1px solid #edf2f7",
    paddingTop: "20px",
  },
  saveBtn: {
    padding: "10px 20px",
    backgroundColor: "#3182ce",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#718096",
    border: "1px solid #cbd5e0",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
};