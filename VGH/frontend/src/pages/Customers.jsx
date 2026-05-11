import { useEffect, useState } from "react";
import { fetchCustomerList } from "../api/customers";
import CustomerTable from "../components/customers/CustomerTable";
import { deleteCustomer, collectMoney } from "../api/customers";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import SettlePaymentModal from "../components/customers/SettlePaymentModal";

export default function Customers() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [settlingCustomer, setSettlingCustomer] = useState(null);

  const load = async () => {
    const res = await fetchCustomerList({
      page,
      page_size: 10,
      q: search || undefined,
    });
    setRows(res.items);
    setPages(res.pages);
  };

  useEffect(() => {
    load();
  }, [page]);

  const doSearch = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    load();
  };

  const handleSettle = (customer) => {
    setSettlingCustomer(customer);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
    try {
      await deleteCustomer(id);
      load();
    } catch (e) {
      alert("Failed to delete customer");
    }
  };

  return (
    /* 1. Main container uses max-width to prevent the whole page from growing */
    <div style={{ padding: "24px", maxWidth: "100%", boxSizing: "border-box", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#1a202c" }}>Customer Register</h2>
        <p style={{ color: "#718096", marginTop: "4px" }}>Manage guest information and history</p>
      </div>

      {/* 🔍 Search Bar */}
      <form onSubmit={doSearch} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "300px", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e0" }}
        />
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#3182ce", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
          Search
        </button>
      </form>

      {/* THE TABLE */}
      <CustomerTable
        rows={rows}
        onSettle={handleSettle}
        onEdit={(c) => setEditingCustomer(c)}
        onDelete={handleDelete}
      />

      <div style={{ marginTop: "20px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", color: "#4a5568" }}>Page {page} of {pages}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} style={styles.navBtn}>Prev</button>
          <button disabled={page === pages} onClick={() => setPage(page + 1)} style={styles.navBtn}>Next</button>
        </div>
      </div>

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSuccess={() => {
            setEditingCustomer(null);
            load();
          }}
        />
      )}

      {settlingCustomer && (
        <SettlePaymentModal
          customer={settlingCustomer}
          onClose={() => setSettlingCustomer(null)}
          onSuccess={() => {
            setSettlingCustomer(null);
            load();
          }}
        />
      )}
    </div>
  );
}

const styles = {
  navBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    border: "1px solid #cbd5e0",
    borderRadius: "4px",
    cursor: "pointer"
  }
};