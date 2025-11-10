import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL } from "../api";


export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // success, error, invalid

  useEffect(() => {
    const session_id = params.get("session_id");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!session_id || !user?.token) {
      toast.error("Invalid payment session or user not logged in.");
      setStatus("invalid");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
       const res = await fetch(`${API_URL}/verify-payment`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ session_id, userId: user.id }),
      });


        const data = await res.json();

        if (data.success) {
          toast.success("Payment successful! Your booking is confirmed.");
          setStatus("success");
          // Redirect to bookings after 2 seconds
          setTimeout(() => navigate("/bookings"), 2000);
        } else {
          toast.error(data.message || "⚠️ Payment completed but booking could not be saved.");
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Something went wrong while verifying payment.");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [params, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center text-gray-800 p-4">
      {loading && <p className="text-lg text-gray-600">Verifying your payment...</p>}

      {!loading && status === "success" && (
        <>
          <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Redirecting you to your bookings...
          </p>
        </>
      )}

      {!loading && status === "error" && (
        <>
          <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Verified but Booking Failed</h1>
          <p className="text-lg text-gray-600">
            There was an issue saving your booking. Please contact support.
          </p>
        </>
      )}

      {!loading && status === "invalid" && (
        <>
          <h1 className="text-4xl font-bold text-red-600 mb-4">Invalid Payment Session</h1>
          <p className="text-lg text-gray-600">
            Unable to verify payment. Please try again or contact support.
          </p>
        </>
      )}
    </div>
  );
}
