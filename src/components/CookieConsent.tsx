"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { translations } from "@/data/translations";
import { FaCookieBite } from "react-icons/fa";
import { FiCheck, FiInfo } from "react-icons/fi";

export default function CookieConsent() {
  const { language } = useLanguage();
  const t = translations[language].contact.cookie; // Using the cookie translations we added to contact block

  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);

  useEffect(() => {
    // Check if user already made a choice
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie_consent", "all");
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem(
      "cookie_consent",
      trackingEnabled ? "all" : "essential",
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pb-8 sm:pb-4 md:p-6 pointer-events-none"
      >
        <div className="max-w-6xl mx-auto pointer-events-auto">
          {/* Main Card with colorful gradient background combining all themes */}
          <div className="relative bg-white/10 backdrop-blur-2xl text-white rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20">
            {/* Colorful Background glow effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px]"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#eef200] rounded-full mix-blend-screen filter blur-[100px]"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white rounded-full mix-blend-screen filter blur-[80px]"></div>
            </div>

            {/* Content wrapper to stay above the blur */}
            <div className="relative z-10">

            {showSettings ? (
              /* Settings View */
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
                <p className="text-gray-400 text-sm mb-8">{t.description}</p>

                <div className="space-y-4 mb-8">
                  {/* Functional (Required) */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="mt-1 w-6 h-6 rounded-md bg-gray-600 flex items-center justify-center flex-shrink-0 cursor-not-allowed">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{t.functional}</h3>
                        <FiInfo className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {t.functionalDesc}
                      </p>
                    </div>
                  </div>

                  {/* Tracking (Optional) */}
                  <label className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <div
                      className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        trackingEnabled
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-500"
                      }`}
                    >
                      {trackingEnabled && (
                        <FiCheck className="w-4 h-4 text-white" />
                      )}
                    </div>
                    {/* Hidden actual checkbox */}
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={trackingEnabled}
                      onChange={(e) => setTrackingEnabled(e.target.checked)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{t.tracking}</h3>
                        <FiInfo className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {t.trackingDesc}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-colors text-sm font-bold shadow-lg"
                  >
                    Zurück
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-[#eef200] to-white text-black hover:opacity-90 transition-opacity text-sm font-bold flex-1 shadow-[0_0_20px_rgba(238,242,0,0.4)]"
                  >
                    {t.confirm}
                  </button>
                </div>
              </div>
            ) : (
              /* Banner View */
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-[#eef200] shadow-lg">
                  <FaCookieBite className="w-7 h-7 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#eef200] to-white">
                    {t.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-100 leading-relaxed drop-shadow-md">
                    {t.description}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="whitespace-nowrap px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-colors text-sm font-bold shadow-lg"
                  >
                    {t.configure}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="whitespace-nowrap px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-[#eef200] to-white text-black hover:opacity-90 transition-opacity text-sm font-bold shadow-[0_0_20px_rgba(238,242,0,0.4)]"
                  >
                    {t.acceptAll}
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
