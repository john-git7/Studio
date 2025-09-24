import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function PackageDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    apiRequest(`/packages/${id}`).then(setPkg);
  }, [id]);

  async function handleBooking() {
    if (!user) {
      alert("Please login first");
      return;
    }
    if (!date) return;

    setLoading(true);
    const res = await apiRequest(
      "/bookings",
      "POST",
      { packageId: id, date },
      user.token
    );
    setLoading(false);

    if (res.error) alert(res.error);
    else {
      alert("Booking confirmed!");
      setShowDialog(false);
    }
  }

  if (!pkg)
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Loading package...
      </p>
    );

  // Theme colors by role
  const isAdmin = user?.role === "admin";
  const themeColors = isAdmin
    ? {
        primary: "#4e73df",
        primaryHover: "#3751c6",
        border: "#c7d4f5",
      }
    : {
        primary: "#20c997",
        primaryHover: "#1aa179",
        border: "#c1eae1",
      };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{pkg.name}</h2>
        <p style={styles.price}>
          <strong>Price:</strong> ₹{pkg.price}
        </p>
        <p style={styles.description}>
          This is one of Priya Studio’s professional photography packages.
          Perfect for capturing your memories with quality service.
        </p>

        <div style={styles.buttonRow}>
          {user?.role === "user" && (
            <button
              style={{
                ...styles.primaryButton,
                backgroundColor: themeColors.primary,
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = themeColors.primaryHover)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = themeColors.primary)
              }
              onClick={() => setShowDialog(true)}
            >
              Book This Package
            </button>
          )}
          <button
            style={styles.secondaryButton}
            onClick={() => navigate(-1)}
          >
            Back to Home
          </button>
        </div>
      </div>

      {showDialog && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <h3 style={{ marginBottom: "16px" }}>Book Package</h3>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                ...styles.input,
                border: `1px solid ${themeColors.border}`,
              }}
            />
            <div style={styles.dialogActions}>
              <button
                onClick={handleBooking}
                disabled={loading}
                style={{
                  ...styles.primaryButton,
                  backgroundColor: themeColors.primary,
                  flex: 1,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = themeColors.primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = themeColors.primary)
                }
              >
                {loading ? "Booking..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowDialog(false)}
                style={{ ...styles.secondaryButton, flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "24px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  price: {
    fontSize: "1.2rem",
    marginBottom: "16px",
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "30px",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  primaryButton: {
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    flex: "1 1 200px",
    transition: "background 0.2s",
  },
  secondaryButton: {
    backgroundColor: "#eee",
    color: "#333",
    padding: "12px 20px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    flex: "1 1 200px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  dialog: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "1rem",
  },
  dialogActions: {
    display: "flex",
    gap: "10px",
  },
};
