import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ContactSection({ user }) {
  const ownerNumber = "+919876543210"; // Owner's number
  const whatsappMessage = encodeURIComponent(
    "Hello! I have a question about your photography packages."
  );

  const theme =
    user?.role === "admin"
      ? { gradient: "from-indigo-500 via-purple-500 to-pink-500", button: "bg-indigo-600 hover:bg-indigo-700" }
      : { gradient: "from-teal-400 via-cyan-500 to-blue-500", button: "bg-teal-600 hover:bg-teal-700" };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden"
    >
      {/* Floating circles */}
      <div className="absolute top-10 -left-10 w-60 h-60 bg-emerald-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
      <div className="absolute bottom-10 -right-10 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl w-full text-center"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6">
          <h2 className={`text-4xl font-bold mb-6 bg-linear-to-r ${theme.gradient} bg-clip-text text-transparent`}>
            📬 Contact
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            Reach out directly to the owner:
          </p>
          <p className="text-xl font-semibold text-white mb-4">
            📞 {ownerNumber}
          </p>
          <a
            href={`https://wa.me/${ownerNumber.replace(/\D/g, "")}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-8 py-4 ${theme.button} text-white font-semibold rounded-lg shadow-lg transition-transform hover:scale-105`}
          >
            Message on WhatsApp
          </a>
          {/* Home Button */}
          <Link
            to="/"
            className={`inline-block px-8 py-4 ${theme.button} text-white font-semibold rounded-lg shadow-lg transition-transform hover:scale-105`}
          >
            Back to Home
          </Link>
          <p className="text-gray-400 mt-2">
            You can call or message anytime — no form submission required.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
