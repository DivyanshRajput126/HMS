import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(username, password);
      dispatch(
        loginSuccess({
          token: data.access_token,
          role: data.role,
        })
      );
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.headerArea}>
          <h2 style={styles.title}>Vijay Guest House</h2>
          <p style={styles.subtitle}>Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footerText}>© 2026 Vijay Guest House Admin</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Deep navy gradient
    fontFamily: "'Inter', sans-serif",
  },
  loginCard: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  headerArea: {
    marginBottom: "32px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginLeft: "4px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "#f8fafc",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    backgroundColor: "#2563eb", // Vibrant Blue
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
    transition: "transform 0.1s ease",
  },
  footerText: {
    marginTop: "32px",
    fontSize: "12px",
    color: "#94a3b8",
  }
};

export default Login;