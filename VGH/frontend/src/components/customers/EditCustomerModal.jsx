import { useState, useEffect } from "react";
import { updateCustomer } from "../../api/customers";

export default function EditCustomerModal({ customer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        full_address: customer.full_address || "",
        company_name: customer.company_name || "",
        vehicle_no: customer.vehicle_no || "",
      });
    }
  }, [customer]);

  if (!customer) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCustomer(customer.id, formData);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to update customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Edit Customer: {customer.full_name}</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input name="full_name" value={formData.full_name} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Vehicle No.</label>
              <input name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Company Name</label>
              <input name="company_name" value={formData.company_name} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Address</label>
            <input name="full_address" value={formData.full_address} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={loading}>Cancel</button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
    display: "flex", justifyContent: "center", alignItems: "center"
  },
  modal: {
    backgroundColor: "#fff", padding: "24px", borderRadius: "8px", width: "500px", maxWidth: "90%",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { margin: 0, fontSize: "18px", color: "#1a202c" },
  closeBtn: { background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#a0aec0" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#4a5568" },
  input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "14px" },
  footer: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" },
  cancelBtn: { padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e0", background: "#fff", cursor: "pointer" },
  saveBtn: { padding: "8px 16px", borderRadius: "6px", border: "none", background: "#3182ce", color: "#fff", cursor: "pointer", fontWeight: "600" }
};
