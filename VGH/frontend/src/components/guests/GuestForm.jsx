import { useState } from "react";
import { addGuest } from "../../api/guests";

export default function GuestForm({ customerId, onDone }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_id: customerId,
    guest_name: "",
    guest_phone: "",
    guest_dob: "",
    guest_document_type: "",
    guest_document_number: "",
  });

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addGuest(form);
      // Reset form fields
      setForm({
        customer_id: customerId,
        guest_name: "",
        guest_phone: "",
        guest_dob: "",
        guest_document_type: "",
        guest_document_number: "",
      });
      onDone();
    } catch (error) {
      console.error("Error adding guest:", error);
      alert("Failed to add guest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={styles.formCard}>
      <h3 style={styles.title}>Additional Guest Details</h3>
      <p style={styles.subtitle}>Enter the details for the next additional guest.</p>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          name="guest_name"
          value={form.guest_name}
          placeholder="e.g. Jane Doe"
          style={styles.input}
          onChange={change}
          required
        />
      </div>

      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Phone Number</label>
          <input
            name="guest_phone"
            value={form.guest_phone}
            placeholder="Contact No."
            style={styles.input}
            onChange={change}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            name="guest_dob"
            value={form.guest_dob}
            style={styles.input}
            onChange={change}
            required
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>ID Document Type</label>
          <select
            name="guest_document_type"
            value={form.guest_document_type}
            style={styles.input}
            onChange={change}
            required
          >
            <option value="">Select Type</option>
            <option value="Aadhar">Aadhar</option>
            <option value="Passport">Passport</option>
            <option value="Driving License">Driving License</option>
            <option value="Voter ID">Voter ID</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Document Number</label>
          <input
            name="guest_document_number"
            value={form.guest_document_number}
            placeholder="ID Number"
            style={styles.input}
            onChange={change}
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
}

const styles = {
  formCard: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "10px",
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    margin: "-10px 0 10px 0",
    fontSize: "13px",
    color: "#64748b",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};