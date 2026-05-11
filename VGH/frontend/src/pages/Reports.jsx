import { useEffect, useState, useRef } from "react";
import { fetchMonthlyReport } from "../api/reports";
import ProfitPie from "../components/reports/ProfitPie";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchMonthlyReport(year, month);
    setReport(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const downloadPDF = async () => {
    const input = reportRef.current;
    if (!input) return;

    const originalBackground = input.style.backgroundColor;
    input.style.backgroundColor = 'white';

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Financial_Report_${year}_${month}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF.");
    } finally {
      input.style.backgroundColor = originalBackground;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={{ margin: 0, color: "#1a202c" }}>Financial Analytics</h2>
          <p style={{ color: "#718096", margin: "4px 0 0 0" }}>Review your monthly performance</p>
        </div>

        {/* 📅 Modern Selector Controls */}
        <div style={styles.controls}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Year</label>
            <input
              type="number"
              value={year}
              style={styles.input}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Month</label>
            <select
              value={month}
              style={styles.input}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={load}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = "#2b6cb0"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#3182ce"}
          >
            {loading ? "Loading..." : "Update Report"}
          </button>

          {report && (
            <button
              onClick={downloadPDF}
              style={{ ...styles.button, backgroundColor: "#059669" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#047857"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#059669"}
            >
              Download PDF
            </button>
          )}
        </div>
      </header>

      {report ? (
        <div ref={reportRef} style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>

          <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #edf2f7", paddingBottom: "10px" }}>
            <h1 style={{ margin: 0, color: "#1a202c" }}>Monthly Financial Report</h1>
            <p style={{ margin: "5px 0 0 0", color: "#4a5568", fontSize: "16px" }}>{new Date(year, month - 1).toLocaleString('en', { month: 'long' })} {year}</p>
          </div>

          <div style={styles.dashboardGrid}>
            {/* Left Side: The Chart */}
            <div style={styles.card}>
              <ProfitPie
                income={report.total_income}
                expense={report.total_expense}
              />
            </div>

            {/* Right Side: Detailed Summary */}
            <div style={styles.card}>
              <h3 style={{ borderBottom: "1px solid #edf2f7", paddingBottom: "12px", marginTop: 0 }}>
                Summary Details
              </h3>

              <div style={styles.statRow}>
                <span style={styles.statLabel}>Total Income</span>
                <span style={{ ...styles.statValue, color: "#2e7d32" }}>
                  ₹ {report.total_income.toLocaleString()}
                </span>
              </div>

              <div style={styles.statRow}>
                <span style={styles.statLabel}>Total Expenses</span>
                <span style={{ ...styles.statValue, color: "#d32f2f" }}>
                  ₹ {report.total_expense.toLocaleString()}
                </span>
              </div>

              <div style={{ ...styles.resultBox, backgroundColor: report.status === "profit" ? "#f0fff4" : "#fff5f5" }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#4a5568" }}>
                  {report.status === "profit" ? "Net Profit" : "Net Loss"}
                </p>
                <h1 style={{
                  margin: 0,
                  color: report.status === "profit" ? "#2f855a" : "#c53030",
                  fontSize: "32px"
                }}>
                  ₹ {Math.abs(report.net).toLocaleString()}
                </h1>
              </div>
            </div>
          </div>

          {/* Detailed Tables */}
          <div style={{ marginTop: "40px" }}>
            <h3 style={{ color: "#1a202c", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Income Sources</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Payment Mode</th>
                  <th style={styles.th}>Amount Collected (₹)</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {report.income_sources && report.income_sources.length > 0 ? (
                  report.income_sources.map(s => (
                    <tr key={`inc-${s.id}`}>
                      <td style={styles.td}>{s.full_name} (ID: {s.id})</td>
                      <td style={styles.td}>{s.payment_mode || "N/A"}</td>
                      <td style={styles.td}>{s.amount_collected}</td>
                      <td style={styles.td}>{s.checkin_datetime ? new Date(s.checkin_datetime).toLocaleDateString() : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ ...styles.td, textAlign: "center" }}>No income recorded.</td></tr>
                )}
              </tbody>
            </table>

            <h3 style={{ color: "#1a202c", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginTop: "40px" }}>Expenses Breakdown</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Expense Type</th>
                  <th style={styles.th}>Details</th>
                  <th style={styles.th}>Amount (₹)</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {report.expense_sources && report.expense_sources.length > 0 ? (
                  report.expense_sources.map(e => (
                    <tr key={`exp-${e.id}`}>
                      <td style={styles.td}>{e.expense_type}</td>
                      <td style={styles.td}>{e.expense_details || "N/A"}</td>
                      <td style={styles.td}>{e.expense_amount}</td>
                      <td style={styles.td}>{e.expense_date ? new Date(e.expense_date).toLocaleDateString() : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ ...styles.td, textAlign: "center" }}>No expenses recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div style={styles.loadingArea}>Gathering data...</div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f7fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "20px"
  },
  controls: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  label: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#4a5568",
    textTransform: "uppercase"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#fff"
  },
  button: {
    padding: "10px 24px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px"
  },
  card: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0"
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #f7fafc"
  },
  statLabel: {
    color: "#718096",
    fontSize: "16px"
  },
  statValue: {
    fontWeight: "bold",
    fontSize: "18px"
  },
  resultBox: {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center"
  },
  loadingArea: {
    textAlign: "center",
    padding: "50px",
    color: "#718096"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    backgroundColor: "#fff",
  },
  th: {
    borderBottom: "2px solid #e2e8f0",
    padding: "12px 15px",
    textAlign: "left",
    fontWeight: "600",
    color: "#4a5568",
    fontSize: "14px",
    backgroundColor: "#f8fafc"
  },
  td: {
    borderBottom: "1px solid #e2e8f0",
    padding: "12px 15px",
    color: "#1a202c",
    fontSize: "14px"
  }
};