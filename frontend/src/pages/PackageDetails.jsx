import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { API_URL } from "../api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PackageDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPackage() {
      try {
        console.log("Fetching package with ID:", id);
        const data = await apiRequest(`/packages/${id}`);
        setPkg(data);
      } catch (err) {
        console.error("Failed to fetch package:", err.message);
        setError(err.message);
      }
    }

    if (id) fetchPackage();
  }, [id]);

  async function handleBooking() {
    if (!user) return toast.error("Please login first");
    if (!date) return toast.warning("Please select a date");
    if (pkg.price < 50) return toast.error("Package price must be at least ₹50");

    setLoading(true);
    try {
      const amountInPaise = Math.round(pkg.price * 100);

      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg._id,
          packageName: pkg.name,
          amount: amountInPaise,
          date,
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to initialize payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment connection error");
    } finally {
      setLoading(false);
    }
  }

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        ⚠️ Error loading package: {error}
      </p>
    );

  if (!pkg)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg animate-pulse">
        Loading package...
      </p>
    );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl p-6 z-10"
      >
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl text-gray-100">
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight text-emerald-300 drop-shadow-md">
              {pkg.name}
            </CardTitle>
            <CardDescription className="text-gray-300">
              ₹{pkg.price} — Premium photography package by{" "}
              <span className="font-semibold text-white">Priya Studio</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-200 leading-relaxed">
              Capture your memories in style with our professional-grade
              photography services. Every shot tells your story beautifully.
            </p>

            <div className="flex flex-wrap gap-4">
              {user?.role === "user" && (
                <Button
                  size="lg"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white text-lg font-semibold py-3 transition-transform hover:scale-[1.02]"
                  onClick={() => setOpen(true)}
                  disabled={loading}
                >
                  Book This Package
                </Button>
              )}

              <Button
                size="lg"
                className="flex-1 bg-cyan-600 hover:bg-teal-500 text-white text-lg font-semibold py-3 transition-transform hover:scale-[1.02]"
                onClick={() => navigate(-1)}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
          aria-describedby="booking-description"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-emerald-300">
              Book Package
            </DialogTitle>
            <p id="booking-description" className="text-gray-300 mt-1">
              Select a date and proceed to payment for your booking.
            </p>
          </DialogHeader>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white/5 border border-white/20 text-white placeholder:text-gray-400 mt-4"
          />

          <DialogFooter className="flex gap-3 mt-4">
            <Button
              onClick={handleBooking}
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white text-lg font-semibold py-3 transition-all hover:scale-[1.02]"
            >
              {loading ? "Redirecting..." : "Proceed to Pay"}
            </Button>

            <Button
              onClick={() => setOpen(false)}
              className="flex-1 bg-cyan-600 hover:bg-teal-500 text-white text-lg font-semibold py-3 transition-transform hover:scale-[1.02]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
