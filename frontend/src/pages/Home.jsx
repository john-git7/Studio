import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { apiRequest } from "../api";

// === Package images mapping ===
const packageImageMap = {
  "12x15 Print": "/images/12x15_Print.png",
  "Passport Size Soft Copy": "/images/Passport_Size_Soft_Copy.png",
  "Photo Book 24x8 per sheet": "/images/Photo_Book_24x8_per_sheet.png",
  "Photo Book 10x30 per sheet": "/images/Photo_Book_10x30_per_sheet.png",
  "Photo Book 12x36 per sheet": "/images/Photo_Book_12x36_per_sheet.png",
  "HD Video (Half)": "/images/HD_Video_Half.png",
  "Copy to Copy (8 copies)": "/images/Copy_to_Copy_8_copies.png",
  "6x4 Studio Sitting (2 nos)": "/images/6x4_Studio_Sitting_2_nos.png",
  "10x8 Studio Sitting (1 nos)": "/images/10x8_Studio_Sitting_1_nos.png",
  "12x10 Studio Sitting (1 nos)": "/images/12x10_Studio_Sitting_1_nos.png",
  "Media Print (Pendrive/CD/DVD)": "/images/Media_Print_Pendrive_CD_DVD.png",
  "Mail to Passport Print": "/images/Mail_to_Passport_Print.png",
  "Full HD Video (Blu-ray)": "/images/Full_HD_Video_Bluray.png",
  "Passport Photo (8 copies)": "/images/Passport_Photo_8_copies.png",
  "12x15 Studio Sitting (1 nos)": "/images/12x15_Studio_Sitting_1_nos.png",
  "6x8 Studio Sitting (1 nos)": "/images/6x8_Studio_Sitting_1_nos.png",
  "12x8 Studio Sitting (1 nos)": "/images/12x8_Studio_Sitting_1_nos.png",
  "10x15 Studio Sitting (1 nos)": "/images/10x15_Studio_Sitting_1_nos.png",
  "12x18 Studio Sitting (1 nos)": "/images/12x18_Studio_Sitting_1_nos.png",
  "Mail Print": "/images/Mail_Print.png",
  "HD Video (Full)": "/images/HD_Video_Half.png",
};

export default function Home({ user }) {
  const [packages, setPackages] = useState([]);
  const bgRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    apiRequest("/packages").then(setPackages);
  }, []);

  // Lightweight parallax background
  useEffect(() => {
    if (prefersReducedMotion) return;
    const bg = bgRef.current;
    if (!bg) return;

    const animate = () => {
      const offset = window.scrollY * 0.25;
      bg.style.transform = `translateY(${offset}px) scale(1.05)`;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animate);
  }, [prefersReducedMotion]);

  const theme =
    user?.role === "admin"
      ? { gradient: "from-indigo-500 via-purple-500 to-pink-500", button: "bg-indigo-600 hover:bg-indigo-700" }
      : { gradient: "from-teal-400 via-cyan-500 to-blue-500", button: "bg-teal-600 hover:bg-teal-700" };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-linear-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Animated Blurred Circles */}
      <div className="absolute top-10 -left-10 w-80 h-80 bg-emerald-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
      <div className="absolute bottom-10 -right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen" />

      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center w-full overflow-hidden">
        {/* Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center will-change-transform transition-transform duration-300 ease-out"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/50 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Capturing{" "}
            <span className={`bg-linear-to-r ${theme.gradient} text-transparent bg-clip-text`}>
              Life’s Magic
            </span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow-md max-w-3xl mx-auto">
            Turning emotions into timeless stories — experience premium photography that celebrates life and love.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              to="/contact"
              className={`px-6 py-3 rounded-full text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${theme.button}`}
            >
              Contact Me
            </Link>
            <a
              href="#packages"
              className="px-6 py-3 rounded-full border border-white/70 text-white hover:bg-white/10 transform transition-all duration-300 hover:scale-105"
            >
              Explore Work
            </a>
          </div>
        </motion.div>
      </section>

      {/* PACKAGE SECTION */}
      <section id="packages" className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
        <h2
          className={`text-4xl font-bold mb-10 bg-linear-to-r ${theme.gradient} bg-clip-text text-transparent`}
        >
          📷 Featured Photography Packages
        </h2>

        {packages.length === 0 ? (
          <p className="text-gray-500 text-lg">Loading packages...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {packages.map((pkg) => {
              const imageUrl =
                packageImageMap[pkg.name] ||
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80";
              return (
                <motion.div
                  key={pkg._id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                >
                  <img src={imageUrl} alt={pkg.name} className="h-52 w-full object-cover" />
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-semibold text-emerald-300">{pkg.name}</h3>
                    <p className="text-gray-300 mt-2 mb-4">
                      ₹{pkg.price} — {pkg.category}
                    </p>
                    <Link
                      to={`/package/${pkg._id}`}
                      className={`inline-block px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${theme.button}`}
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
