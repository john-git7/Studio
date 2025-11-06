import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md"
      >
        <h1 className="text-4xl font-bold text-red-400 mb-4">
          Payment Cancelled 
        </h1>
        <p className="text-gray-300 mb-8">
          Your payment was cancelled or failed. You can try again anytime.
        </p>
        <Button
          className="bg-emerald-500 hover:bg-emerald-400 text-lg font-semibold px-6 py-3"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
