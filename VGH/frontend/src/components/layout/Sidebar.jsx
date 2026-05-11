import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../../utils/roles";
import { useState } from "react";
import DeveloperContactModal from "./DeveloperContactModal";

const Sidebar = () => {
  const role = useSelector((state) => state.auth.role);
  const location = useLocation(); // Used to highlight the current page
  const [isContactOpen, setIsContactOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/", roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { label: "Rooms", path: "/rooms", roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { label: "Guests", path: "/guests", roles: [ROLES.ADMIN] },
    { label: "Customers", path: "/customers", roles: [ROLES.ADMIN] },
    { label: "Pending Payments", path: "/pending-payments", roles: [ROLES.ADMIN] },
    { label: "Expenses", path: "/expenses", roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { label: "Reports", path: "/reports", roles: [ROLES.ADMIN] },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.navContainer}>
        <p style={styles.menuLabel}>Main Menu</p>
        <ul style={styles.list}>
          {navItems.map((item) => {
            // Check if user has permission to see this link
            if (!item.roles.includes(role)) return null;

            const isActive = location.pathname === item.path;

            return (
              <li key={item.path} style={styles.listItem}>
                <Link
                  to={item.path}
                  style={{
                    ...styles.link,
                    backgroundColor: isActive ? "#334155" : "transparent",
                    color: isActive ? "#3b82f6" : "#cbd5e1",
                    borderLeft: isActive ? "4px solid #3b82f6" : "4px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#1e293b";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#cbd5e1";
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={styles.promoBox}>
        <p style={styles.promoText}>Looking for a similar software?</p>
        <button
          onClick={() => setIsContactOpen(true)}
          style={styles.promoBtn}
        >
          Contact Developer
        </button>
      </div>

      <DeveloperContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      <div style={styles.footer}>
        <div style={styles.brandingSection}>
          <p style={styles.copyright}>&copy; {new Date().getFullYear()} Vijay Guest House</p>
          <p style={styles.devCredit}>Software by <span style={styles.devHighlight}>
            <a
              href="https://divyansh-portfolio126.netlify.app/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#60a5fa"}
              onMouseLeave={(e) => e.currentTarget.style.color = "inherit"}
            >
              Divyansh
            </a>
          </span></p>
        </div>
        <div style={styles.roleBadge}>
          <span style={styles.roleLabel}>Logged as:</span>
          <span style={styles.roleValue}>{role}</span>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "200px", // Reduced from 240px for a more compact look
    background: "#0f172a",
    color: "#fff",
    height: "calc(100vh - 75px)", // Full height minus header height
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid #1e293b",
    position: "sticky",
    top: "75px",
    fontFamily: "'Inter', sans-serif",
    flexShrink: 0,
  },
  navContainer: {
    padding: "20px 0",
  },
  menuLabel: {
    padding: "0 20px",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#475569",
    marginBottom: "16px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: "4px",
  },
  link: {
    padding: "10px 20px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
  footer: {
    padding: "12px 16px",
    borderTop: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  brandingSection: {
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  copyright: {
    margin: 0,
    fontSize: "9px",
    color: "#475569",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    opacity: 0.8
  },
  devCredit: {
    margin: "2px 0 0 0",
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "500"
  },
  devHighlight: {
    color: "#3b82f6",
    fontWeight: "700",
    textDecoration: "none",
    transition: "all 0.2s ease"
  },
  roleBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    backgroundColor: "#1e293b",
    borderRadius: "6px",
    border: "1px solid #334155"
  },
  roleLabel: {
    fontSize: "10px",
    color: "#64748b",
    textTransform: "uppercase"
  },
  roleValue: {
    fontSize: "11px",
    color: "#fff",
    fontWeight: "700"
  },
  promoBox: {
    margin: "12px",
    padding: "12px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    border: "1px solid #334155",
    textAlign: "center"
  },
  promoText: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "12px",
    lineHeight: "1.4"
  },
  promoBtn: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.2s"
  }
};

export default Sidebar;