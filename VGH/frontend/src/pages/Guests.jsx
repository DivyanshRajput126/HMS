import { useEffect, useState } from "react";
import { fetchGuestList } from "../api/guests";
import GuestTable from "../components/guests/GuestTable";

export default function Guests() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchGuestList({
        page,
        page_size: 10,
        q: search || undefined,
      });
      setRows(res.items);
      setPages(res.pages);
    } catch (error) {
      console.error("Failed to load guests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const doSearch = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div style={container}>
      {/* Header Section */}
      <div style={headerSection}>
        <div>
          <h2 style={title}>Guest Register</h2>
          <p style={subtitle}>View and manage all additional guests registered in the system.</p>
        </div>
      </div>

      {/* Control Bar: Search */}
      <div style={controlBar}>
        <form onSubmit={doSearch} style={searchForm}>
          <div style={inputWrapper}>
            <span style={searchIcon}>🔍</span>
            <input
              placeholder="Search by name, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInput}
            />
          </div>
          <button type="submit" style={searchBtn}>
            Search
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div style={tableCard}>
        {loading ? (
          <div style={loadingOverlay}>Loading records...</div>
        ) : (
          <GuestTable rows={rows} />
        )}
      </div>

      {/* Pagination Section */}
      <div style={paginationArea}>
        <div style={pageInfo}>
          Showing page <strong style={{ color: '#1e293b' }}>{page}</strong> of <strong>{pages}</strong>
        </div>
        <div style={btnGroup}>
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
            style={{ ...navBtn, opacity: page === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <button
            disabled={page === pages || loading}
            onClick={() => setPage(page + 1)}
            style={{ ...navBtn, opacity: page === pages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---

const container = {
  padding: "32px",
  backgroundColor: "#f8fafc", // Light Slate background
  minHeight: "100vh",
  fontFamily: "'Inter', sans-serif",
};

const headerSection = {
  marginBottom: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};

const title = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
  color: "#0f172a",
};

const subtitle = {
  margin: "4px 0 0 0",
  fontSize: "14px",
  color: "#64748b",
};

const controlBar = {
  marginBottom: "20px",
  display: "flex",
  gap: "12px",
};

const searchForm = {
  display: "flex",
  gap: "10px",
  width: "100%",
  maxWidth: "500px",
};

const inputWrapper = {
  position: "relative",
  flex: 1,
};

const searchIcon = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "14px",
  color: "#94a3b8",
};

const searchInput = {
  width: "100%",
  padding: "10px 12px 10px 36px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const searchBtn = {
  padding: "10px 20px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
};

const tableCard = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  position: "relative",
};

const loadingOverlay = {
  padding: "40px",
  textAlign: "center",
  color: "#64748b",
  fontSize: "14px",
};

const paginationArea = {
  marginTop: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const pageInfo = {
  fontSize: "14px",
  color: "#64748b",
};

const btnGroup = {
  display: "flex",
  gap: "8px",
};

const navBtn = {
  padding: "8px 16px",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  color: "#475569",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
};