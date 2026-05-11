import React from "react";
import { createPortal } from "react-dom";
import profileImg from "../../assets/images/passportSizeImag.jpeg";

export default function DeveloperContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const modalContent = (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Profile Header */}
        <div style={styles.header}>
          <div style={styles.profileSection}>
            <div style={styles.photoContainer}>
              <img
                src={profileImg}
                alt="Divyansh Rajput"
                style={styles.profilePhoto}
              />
            </div>
            <div style={styles.headerText}>
              <h2 style={styles.title}>Divyansh Rajput</h2>
              <p style={styles.subtitle}>AI Engineer | Software Engineer | DataScientist</p>
              <div style={styles.tagline}>
                Engineering the "Intelligent Infrastructure" that powers modern business.
              </div>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        <div style={styles.content}>
          {/* Summary Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>The Vision</h3>
            <p style={styles.text}>
              I don't just build software; I build the engines that drive business growth.
              My mission is to transform your complex challenges into seamless digital reality.
              Whether it's automating your daily chaos with "Smart Brains" or architecting a
              rock-solid foundation for thousands of users, I ensure your business is always
              one step ahead in the digital age.
            </p>
          </div>

          {/* Services & Domains Grid */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Solutions for Your Business</h3>
            <div style={styles.skillsGrid}>
              <div style={styles.skillCard}>
                <span style={styles.skillIcon}>🏢</span>
                <div>
                  <h4 style={styles.skillName}>Business Management Tools</h4>
                  <p style={styles.skillDesc}>Custom-built systems to manage your hotel, staff, inventory, and customers in one place. Perfect for keeping your business organized as it grows.</p>
                </div>
              </div>
              <div style={styles.skillCard}>
                <span style={styles.skillIcon}>🧠</span>
                <div>
                  <h4 style={styles.skillName}>Smart Business Brains</h4>
                  <p style={styles.skillDesc}>I build "thinking" systems that can chat with your customers like a human, predict your future sales, and automate your most complex daily tasks.</p>
                </div>
              </div>
              <div style={styles.skillCard}>
                <span style={styles.skillIcon}>🌐</span>
                <div>
                  <h4 style={styles.skillName}>Professional Online Presence</h4>
                  <p style={styles.skillDesc}>Your home on the internet. From simple portfolios to complex online stores, I build fast, secure websites that look amazing on every device.</p>
                </div>
              </div>
              <div style={styles.skillCard}>
                <span style={styles.skillIcon}>🎨</span>
                <div>
                  <h4 style={styles.skillName}>Premium Design & Growth</h4>
                  <p style={styles.skillDesc}>Beautiful logos, professional website designs, and smart social media plans that help you attract more customers and build a famous brand.</p>
                </div>
              </div>
              <div style={styles.skillCard}>
                <span style={styles.skillIcon}>🏗️</span>
                <div>
                  <h4 style={styles.skillName}>Rock-Solid Foundation</h4>
                  <p style={styles.skillDesc}>I build the "invisible engine" that keeps your software running lightning-fast and ensures it never crashes, no matter how many thousands of users arrive.</p>
                </div>
              </div>
              <div style={styles.skillCard}>
                <span style={styles.skillIcon}>📱</span>
                <div>
                  <h4 style={styles.skillName}>Business on the Go</h4>
                  <p style={styles.skillDesc}>Custom mobile apps that let you manage your entire business from your pocket. Whether on iPhone or Android, your business is always just a tap away.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Collaboration */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>How We Work</h3>
            <div style={styles.pricingList}>
              <div style={styles.pricingItem}>
                <strong>End-to-End Delivery:</strong> I handle everything from the initial design to launching the final product.
              </div>
              <div style={styles.pricingItem}>
                <strong>Simple Pricing:</strong> Transparent project-based costs or monthly support plans to keep your tech running smoothly.
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div style={styles.contactCard}>
            <h3 style={styles.cardTitle}>Ready to start your project?</h3>
            <div style={styles.contactLinks}>
              <a href="mailto:divyanshrajput126@gmail.com" style={styles.contactBtn}>
                📧 Email
              </a>
              <a href="tel:+919023848410" style={styles.contactBtn}>
                📞 Call Me
              </a>
              <a href="https://divyansh-portfolio126.netlify.app/" target="_blank" rel="noreferrer" style={styles.portfolioBtn}>
                🌍 Portfolio
              </a>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>Crafting Digital Excellence by Divyansh</p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.85)", zIndex: 9999,
    display: "flex", justifyContent: "center", alignItems: "center",
    backdropFilter: "blur(12px)"
  },
  modal: {
    backgroundColor: "#fff", width: "600px", maxWidth: "95%",
    borderRadius: "24px", overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
    display: "flex", flexDirection: "column"
  },
  header: {
    padding: "40px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#fff",
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    position: "relative"
  },
  profileSection: { display: "flex", gap: "24px", alignItems: "center" },
  photoContainer: {
    width: "100px", height: "100px", borderRadius: "20px",
    overflow: "hidden", border: "3px solid #3b82f6",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    backgroundColor: "#1e293b", flexShrink: 0
  },
  profilePhoto: { width: "100%", height: "100%", objectFit: "cover" },
  headerText: { flex: 1 },
  title: { margin: 0, fontSize: "28px", fontWeight: "900", letterSpacing: "-1px" },
  subtitle: { margin: "4px 0 0 0", fontSize: "14px", color: "#3b82f6", fontWeight: "700" },
  tagline: { margin: "12px 0 0 0", fontSize: "13px", color: "#94a3b8", fontStyle: "italic" },
  closeBtn: {
    background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
    width: "32px", height: "32px", borderRadius: "50%",
    fontSize: "20px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"
  },
  content: { padding: "40px", maxHeight: "60vh", overflowY: "auto" },
  section: { marginBottom: "32px" },
  sectionTitle: {
    fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px",
    color: "#3b82f6", fontWeight: "900", marginBottom: "16px",
    display: "flex", alignItems: "center", gap: "10px"
  },
  text: { fontSize: "14px", color: "#475569", lineHeight: "1.7" },
  skillsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  skillCard: {
    display: "flex", gap: "12px", alignItems: "center",
    padding: "12px", borderRadius: "12px", backgroundColor: "#f8fafc",
    border: "1px solid #f1f5f9"
  },
  skillIcon: { fontSize: "22px" },
  skillName: { margin: 0, fontSize: "14px", fontWeight: "800", color: "#1e293b" },
  skillDesc: { margin: "2px 0 0 0", fontSize: "11px", color: "#64748b" },
  pricingList: { display: "flex", flexDirection: "column", gap: "12px" },
  pricingItem: {
    fontSize: "14px", color: "#475569", paddingLeft: "24px", position: "relative"
  },
  contactCard: {
    backgroundColor: "#0f172a", padding: "30px", borderRadius: "20px",
    textAlign: "center", color: "#fff", marginTop: "10px"
  },
  cardTitle: { fontSize: "18px", fontWeight: "800", color: "#fff", marginBottom: "20px" },
  contactLinks: { display: "flex", gap: "16px", justifyContent: "center" },
  contactBtn: {
    padding: "12px 24px", backgroundColor: "#3b82f6", color: "#fff",
    textDecoration: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "800",
    transition: "transform 0.2s"
  },
  portfolioBtn: {
    padding: "12px 24px", backgroundColor: "transparent", color: "#fff",
    textDecoration: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "800",
    border: "2px solid #334155"
  },
  footer: {
    padding: "20px", textAlign: "center", borderTop: "1px solid #f1f5f9"
  }
};
