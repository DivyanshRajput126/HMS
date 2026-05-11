import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={styles.pageWrapper}>
      {/* Header stays at the top naturally */}
      <Header />

      <div style={styles.bodyFlex}>
        {/* Sidebar sits to the left */}
        <Sidebar />

        {/* Main content expands to fill remaining space */}
        <main style={styles.mainArea}>
          <div style={styles.contentCard}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    // Standard system fonts for a professional "SaaS" look
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#f8fafc", // Very light slate gray to create contrast with white cards
    minHeight: "100vh", // Ensures the background covers the screen even if content is short
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden", // Prevent global horizontal scroll
  },
  bodyFlex: {
    display: "flex",
    flex: 1, // Allows the body to grow to fill the screen
    width: "100%",
  },
  mainArea: {
    flex: 1,
    padding: "32px", // Generous breathing room
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden", // Contain content inside the main area
    width: "100%",
  },
  contentCard: {
    // This wrapper ensures that your forms/grids don't look lost on huge screens
    width: "100%",
    maxWidth: "1400px",
    margin: "0",
  },
};

export default Layout;