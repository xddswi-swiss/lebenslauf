"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { translations } from "@/data/translations";
import { Cookie, Check, ChevronRight, Info } from "lucide-react";

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
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 pointer-events-none"
      >
        <div className="max-w-6xl mx-auto pointer-events-auto">
          {/* Main Card with multi-theme gradient border on top */}
          <div className="relative bg-[#0f0f0f] text-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/10">
            {/* The Multi-Theme Colored Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-[#eef200] to-white/80" />

            {showSettings ? (
              /* Settings View */
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
                <p className="text-gray-400 text-sm mb-8">{t.description}</p>

                <div className="space-y-4 mb-8">
                  {/* Functional (Required) */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="mt-1 w-6 h-6 rounded-md bg-gray-600 flex items-center justify-center flex-shrink-0 cursor-not-allowed">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{t.functional}</h3>
                        <Info className="w-4 h-4 text-gray-400" />
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
                        <Check className="w-4 h-4 text-white" />
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
                        <Info className="w-4 h-4 text-gray-400" />
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
                    className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    Zurück
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold flex-1"
                  >
                    {t.confirm}
                  </button>
                </div>
              </div>
            ) : (
              /* Banner View */
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-white/10">
                  <Cookie className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="whitespace-nowrap px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    {t.configure}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="whitespace-nowrap px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-[#eef200] text-black hover:opacity-90 transition-opacity text-sm font-bold"
                  >
                    {t.acceptAll}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
