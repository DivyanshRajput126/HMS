import { useState } from "react";
import { checkinCustomer } from "../../api/customers";

const CheckinForm = ({ room, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    full_address: "",
    email: "",
    phone: "",
    coming_from: "",
    going_to: "",
    company_name: "",
    dob: "",
    sex: "MALE",
    vehicle_no: "",
    no_of_person: 1,
    document_type: "",
    document_number: "",
    // --- UPDATED FIELDS ---
    amount_charged: "",
    amount_collected: "",
    checkin_datetime: new Date().toISOString().slice(0, 16),
    payment_mode: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("room_id", room.id);
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (file) data.append("document_file", file);

      const res = await checkinCustomer(data);
      onSuccess(res.id);
    } catch (err) {
      alert(err.response?.data?.detail || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.stepper}>
        {[1, 2, 3].map((num) => (
          <div key={num} style={styles.stepWrapper}>
            <div style={{
              ...styles.stepCircle,
              backgroundColor: step >= num ? "#2563eb" : "#e2e8f0",
              color: step >= num ? "#fff" : "#64748b"
            }}>
              {num}
            </div>
            {num < 3 && <div style={{ ...styles.stepLine, backgroundColor: step > num ? "#2563eb" : "#e2e8f0" }} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* PAGE 1 & 2 remain the same logic-wise, just showing Step 3 changes for brevity or full code if requested */}
        {step === 1 && (
          <div style={styles.page}>
            <h3 style={styles.pageTitle}>1. Guest Profile</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name *</label>
              <input name="full_name" value={form.full_name} required onChange={handleChange} style={styles.input} placeholder="Enter Name" />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone Number *</label>
              <input name="phone" value={form.phone} required onChange={handleChange} style={styles.input} placeholder="Enter Phone" />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input name="email" value={form.email} type="email" onChange={handleChange} style={styles.input} placeholder="john@example.com" />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Company Name</label>
              <input name="company_name" value={form.company_name} onChange={handleChange} style={styles.input} placeholder="Optional" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={styles.page}>
            <h3 style={styles.pageTitle}>2. Stay & Travel</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Check-in Date & Time *</label>
              <input type="datetime-local" name="checkin_datetime" value={form.checkin_datetime} required onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Coming From *</label>
                <input name="coming_from" value={form.coming_from} required onChange={handleChange} style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Going To *</label>
                <input name="going_to" value={form.going_to} required onChange={handleChange} style={styles.input} />
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Address *</label>
              <textarea name="full_address" value={form.full_address} required onChange={handleChange} style={styles.textarea} />
            </div>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Vehicle No *</label>
                <input name="vehicle_no" value={form.vehicle_no} required onChange={handleChange} style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>No. of Persons *</label>
                <input type="number" name="no_of_person" value={form.no_of_person} required min="1" onChange={handleChange} style={styles.input} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={styles.page}>
            <h3 style={styles.pageTitle}>3. Identity & Billing</h3>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>DOB *</label>
                <input type="date" name="dob" value={form.dob} required onChange={handleChange} style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Sex *</label>
                <select name="sex" value={form.sex} required onChange={handleChange} style={styles.input}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>ID Type *</label>
                <select name="document_type" value={form.document_type} required onChange={handleChange} style={styles.input}>
                  <option value="">Select</option>
                  <option value="AADHAR">Aadhar</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="LICENSE">License</option>
                  <option value="VOTER_ID">Voter Id</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>ID Number *</label>
                <input name="document_number" value={form.document_number} required onChange={handleChange} style={styles.input} />
              </div>
            </div>

            {/* --- REVISED BILLING SECTION --- */}
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Daily Room Rate (₹) *</label>
                <input
                  type="number"
                  name="amount_charged"
                  value={form.amount_charged}
                  required
                  onChange={handleChange}
                  style={styles.amountInput}
                  placeholder="Rate/Day"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Amount Collected (₹) *</label>
                <input
                  type="number"
                  name="amount_collected"
                  value={form.amount_collected}
                  required
                  onChange={handleChange}
                  style={{ ...styles.amountInput, border: "2px solid #059669", color: "#059669" }}
                  placeholder="Advance"
                />
              </div>
            </div>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Payment Mode *</label>
                <select name="payment_mode" value={form.payment_mode} required onChange={handleChange} style={styles.input}>
                  <option value="">Select</option>
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>

              <div style={{ flex: 1 }}>
                <label style={styles.label}>ID Document Proof *</label>
                <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files[0])} style={styles.fileInput} />
              </div>

              <div style={{ flex: 1 }}>
                <label style={styles.label}>Registrar No *</label>
                <input type="text" name="registrar_no" value={form.registrar_no} required onChange={handleChange} style={styles.input} />
              </div>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          {step > 1 && (
            <button type="button" onClick={prevStep} style={styles.backBtn}>Back</button>
          )}

          {step < 3 ? (
            <button type="button" onClick={nextStep} style={styles.nextBtn}>Next Step</button>
          ) : (
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Checking in..." : "Complete Check-In"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const styles = {
  // Styles inherited from original code with minor tweaks for row spacing
  container: { width: "100%", maxWidth: "500px", margin: "0 auto", fontFamily: "'Inter', sans-serif" },
  stepper: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" },
  stepWrapper: { display: "flex", alignItems: "center" },
  stepCircle: { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", transition: "all 0.3s ease" },
  stepLine: { width: "50px", height: "2px", margin: "0 8px" },
  page: { display: "flex", flexDirection: "column", gap: "16px", animation: "fadeIn 0.3s ease" },
  pageTitle: { margin: "0 0 10px 0", color: "#1e293b", fontSize: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  row: { display: "flex", gap: "12px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#64748b" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", width: "100%", boxSizing: "border-box" },
  textarea: { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", minHeight: "80px", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  amountInput: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #2563eb",
    fontSize: "16px",
    fontWeight: "700",
    textAlign: "center",
    color: "#2563eb",
    width: "100%",
    boxSizing: "border-box"
  },
  fileInput: { fontSize: "13px", marginTop: "4px" },
  footer: { display: "flex", justifyContent: "space-between", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" },
  nextBtn: { padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginLeft: "auto" },
  backBtn: { padding: "12px 24px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  submitBtn: { padding: "12px 24px", background: "#059669", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }
};

export default CheckinForm;