"use client";

import React, { useState, useEffect } from "react";
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
    // Expose a global method to manually trigger the cookie banner
    if (typeof window !== "undefined") {
      (window as any).showCookieSettings = () => {
        setShowSettings(true);
        setIsVisible(true);
      };
    }

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

  // We must not return null early because we need the component mounted to expose the window function
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-[450px] lg:w-[500px] z-[99999] transition-all duration-500 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      {/* Main Card adapting to current theme */}
      <div className="glass-card rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative">
            
            {/* The multi-theme line removed, now relies on glass-card and theme variables */}
            <div className="relative z-10">

            {showSettings ? (
              /* Settings View */
              <div className="p-5">
                <h2 className="text-xl font-bold mb-3 text-[var(--text-main)]">{t.title}</h2>
                <p className="text-[var(--text-body)] text-sm mb-6">{t.description}</p>

                <div className="space-y-3 mb-6">
                  {/* Functional (Required) */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/20 text-[var(--text-main)]">
                    <div className="mt-1 w-6 h-6 rounded-md bg-gray-500 flex items-center justify-center flex-shrink-0 cursor-not-allowed">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{t.functional}</h3>
                        <FiInfo className="w-4 h-4 opacity-70" />
                      </div>
                      <p className="text-xs opacity-80 mt-1">
                        {t.functionalDesc}
                      </p>
                    </div>
                  </div>

                  {/* Tracking (Optional) */}
                  <label className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors text-[var(--text-main)]">
                    <div
                      className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        trackingEnabled
                          ? "bg-primary border-primary"
                          : "border-[var(--text-main)]"
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
                        <FiInfo className="w-4 h-4 opacity-70" />
                      </div>
                      <p className="text-xs opacity-80 mt-1">
                        {t.trackingDesc}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2.5 rounded-xl border-2 border-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--background)] text-[var(--text-main)] transition-colors text-sm font-bold"
                  >
                    Zurück
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2.5 rounded-xl bg-primary text-white transition-opacity text-sm font-bold flex-1"
                  >
                    {t.confirm}
                  </button>
                </div>
              </div>
            ) : (
              /* Banner View */
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-lg">
                    <FaCookieBite className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-main)]">
                    {t.title}
                  </h3>
                </div>
                
                <p className="text-sm text-[var(--text-body)] leading-relaxed">
                  {t.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="whitespace-nowrap px-4 py-2.5 rounded-xl border-2 border-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--background)] text-[var(--text-main)] transition-colors text-sm font-bold flex-1"
                  >
                    {t.configure}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-primary text-white hover:opacity-90 transition-opacity text-sm font-bold flex-1 shadow-lg"
                  >
                    {t.acceptAll}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
