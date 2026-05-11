import { useState } from "react";
import { createExpense } from "../../api/expenses";

export default function ExpenseForm({ onSaved }) {
  const now = new Date();

  // Define categories to match the Edit Modal
  const CATEGORIES = ["Salary", "Light Bill", "Laundry", "Miscellaneous"];

  const [form, setForm] = useState({
    expense_type: "",
    expense_details: "",
    expense_amount: "",
    expense_month: now.getMonth() + 1,
    expense_year: now.getFullYear(),
  });

  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a date object for the 1st of the selected month
      const formattedDate = `${form.expense_year}-${String(form.expense_month).padStart(2, '0')}-01`;

      await createExpense({
        expense_type: form.expense_type,
        expense_details: form.expense_type === "Miscellaneous" || form.expense_type === "Salary" ? form.expense_details : form.expense_type,
        expense_amount: Number(form.expense_amount),
        expense_date: formattedDate,
        expense_time: "00:00",
      });

      // Reset form
      setForm({
        expense_type: "",
        expense_details: "",
        expense_amount: "",
        expense_month: now.getMonth() + 1,
        expense_year: now.getFullYear(),
      });

      onSaved();
    } catch (e) {
      console.error("Error creating expense:", e);
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <form onSubmit={submit} style={styles.form}>
        <h3 style={styles.title}>New Monthly Transaction</h3>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.input}
              name="expense_type"
              value={form.expense_type}
              onChange={change}
              required
            >
              <option value="" disabled>Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ ...styles.field, maxWidth: "150px" }}>
            <label style={styles.label}>Amount (₹)</label>
            <input
              style={styles.input}
              type="number"
              name="expense_amount"
              placeholder="0.00"
              value={form.expense_amount}
              onChange={change}
              required
            />
          </div>
        </div>

        {form.expense_type === "Miscellaneous" && (
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: "60px", resize: "none" }}
              name="expense_details"
              placeholder="What was this for?"
              value={form.expense_details}
              onChange={change}
              required
            />
          </div>
        )}

        {form.expense_type === "Salary" && (
          <div style={styles.field}>
            <label style={styles.label}>Employee Name</label>
            <input
              style={styles.input}
              type="text"
              name="expense_details"
              placeholder="Employee Name"
              value={form.expense_details}
              onChange={change}
              required
            />
          </div>
        )}

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Month</label>
            <select
              style={styles.input}
              name="expense_month"
              value={form.expense_month}
              onChange={change}
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Year</label>
            <input
              style={styles.input}
              type="number"
              name="expense_year"
              value={form.expense_year}
              onChange={change}
              required
            />
          </div>
        </div>

        <button style={styles.button} disabled={loading}>
          {loading ? "Processing..." : "Confirm & Save"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: "#1a202c",
    fontWeight: "600",
  },
  row: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#f7fafc",
    fontFamily: "inherit",
  },
  button: {
    marginTop: "8px",
    padding: "12px",
    backgroundColor: "#2b6cb0",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }
};