import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../api/expenses";

import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";
import EditExpenseModal from "../components/expenses/EditExpenseModal";

export default function Expenses() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const load = async () => {
    const expenses = await getExpenses({ month, year });
    setData(expenses);
  };

  useEffect(() => {
    load();
  }, [month, year]);

  const totalExpenses = data.reduce((sum, item) => sum + Number(item.expense_amount || 0), 0);

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense? This action cannot be undone.")) return;
    await deleteExpense(id);
    load();
  };

  return (
    <div style={styles.container}>
      {/* 1. Page Header */}
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Monthly Expense Management</h2>
          <p style={styles.subtitle}>Track and manage your business outgoings by month</p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              style={styles.filterInput}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{ ...styles.filterInput, width: "80px" }}
            />
          </div>
          <button
            style={isFormVisible ? styles.cancelBtn : styles.addBtn}
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible ? "Close Form" : "+ Add Expense"}
          </button>
        </div>
      </header>

      {/* 2. Stats Quick View */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Outgoings</span>
          <h2 style={styles.statValue}>₹ {totalExpenses.toLocaleString()}</h2>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Transactions</span>
          <h2 style={styles.statValue}>{data.length}</h2>
        </div>
      </div>

      {/* 3. Conditional Form Section */}
      {isFormVisible && (
        <div style={styles.formWrapper}>
          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>Add Transaction</h3>
            <ExpenseForm onSaved={() => { load(); setIsFormVisible(false); }} />
          </div>
        </div>
      )}

      {/* 4. Table Section */}
      <div style={styles.card}>
        <div style={styles.tableHeader}>
          <h3 style={{ margin: 0 }}>Recent Expenses</h3>
        </div>
        <ExpenseTable
          data={data}
          onEdit={setEdit}
          onDelete={remove}
          isAdmin={isAdmin}
        />
      </div>

      {/* 5. Modal */}
      <EditExpenseModal
        open={!!edit}
        expense={edit}
        onClose={() => setEdit(null)}
        onSaved={load}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    color: "#1a202c",
  },
  subtitle: {
    margin: "4px 0 0 0",
    color: "#718096",
    fontSize: "14px",
  },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#3182ce",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(49, 130, 206, 0.3)",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#e53e3e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  statsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  statLabel: {
    fontSize: "12px",
    color: "#718096",
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  statValue: {
    margin: "8px 0 0 0",
    color: "#2d3748",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    padding: "20px",
    marginBottom: "24px",
  },
  formWrapper: {
    marginBottom: "32px",
    animation: "fadeIn 0.3s ease-in-out",
  },
  tableHeader: {
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid #edf2f7",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  filterLabel: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#718096",
    textTransform: "uppercase"
  },
  filterInput: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    backgroundColor: "#fff",
    outline: "none"
  }
};