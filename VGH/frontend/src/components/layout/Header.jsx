import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
// ✅ Correctly import the image from assets
import logoImg from "../../assets/images/favicon.jpeg";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <header style={styles.header}>
      <div style={styles.logoSection}>
        {/* ✅ Using the imported variable here */}
        <div style={styles.logoContainer}>
          <img
            src={logoImg}
            alt="Vijay Guest House Logo"
            style={styles.logoImage}
          />
        </div>
        <div style={styles.brandWrapper}>
          <h1 style={styles.brandName}>Vijay Guest House</h1>
        </div>
      </div>

      <div style={styles.actions}>
        {/* Optional: Add Date/Time here if needed */}
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>HMS</div>
        </div>

        <button
          onClick={() => dispatch(logout())}
          style={styles.logoutBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width="16" height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: "75px",
    padding: "0 40px",
    background: "#0f172a", // Slightly deeper dark for better contrast
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Inter', sans-serif",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logoContainer: {
    width: "45px",
    height: "45px",
    backgroundColor: "#fff", // White background for the logo circle
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    border: "2px solid #334155",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // Ensures your square favicon fills the box nicely
  },
  brandWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  brandName: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    color: "#f8fafc",
  },
  badge: {
    fontSize: "11px",
    textTransform: "uppercase",
    color: "#3b82f6", // Vibrant blue for the badge
    fontWeight: "700",
    letterSpacing: "1.2px",
    marginTop: "2px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingRight: "24px",
    borderRight: "1px solid #334155",
  },
  userAvatar: {
    width: "34px",
    height: "34px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  userName: {
    fontSize: "14px",
    color: "#cbd5e1",
    fontWeight: "500",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 18px",
    backgroundColor: "#fff",
    color: "#be123c", // Crimson red
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
};

export default Header;