"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiBriefcase, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

export const RecruiterWidget: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('Kaufmann EFZ');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Math Captcha states
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [mathHash, setMathHash] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate a random math captcha
  const generateCaptcha = () => {
    const operations = ['+', '-', '*'] as const;
    const op = operations[Math.floor(Math.random() * operations.length)];
    let n1 = 0, n2 = 0, ans = 0;

    if (op === '+') {
      n1 = Math.floor(Math.random() * 10) + 1;
      n2 = Math.floor(Math.random() * 10) + 1;
      ans = n1 + n2;
    } else if (op === '-') {
      n1 = Math.floor(Math.random() * 10) + 5;
      n2 = Math.floor(Math.random() * n1) + 1; // ensure positive result
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 5) + 1;
      n2 = Math.floor(Math.random() * 5) + 1;
      ans = n1 * n2;
    }

    setCaptchaQuestion(`${n1} ${op === '*' ? '×' : op} ${n2} = ?`);
    setMathHash(String(ans * 43 + 17));
    setMathAnswer('');
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      setSuccess(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim() || !mathAnswer.trim()) {
      setErrorMsg(t.contact.error);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'recruiter',
          name,
          company,
          position,
          phone,
          email,
          message: message.trim() || '-',
          mathAnswer,
          mathHash
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        if (resData.error === 'Incorrect security answer') {
          setErrorMsg(t.contact.captchaError);
          generateCaptcha();
        } else {
          setErrorMsg(resData.error || t.contact.error);
        }
      } else {
        setSuccess(true);
        // Clear form
        setName('');
        setCompany('');
        setPhone('');
        setEmail('');
        setMessage('');
      }
    } catch (err) {
      console.error('Error submitting recruiter form:', err);
      setErrorMsg(t.contact.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <m.button
            key="floating-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [-5, 5, -5],
              x: [-2, 2, -2]
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              x: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 },
              default: { duration: 0.3 }
            }}
            onClick={() => setIsOpen(true)}
            className="fixed left-6 bottom-6 md:left-8 md:bottom-8 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 cursor-pointer text-sm tracking-wide"
            aria-label="Schnell-Einladung für Recruiter"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <FiBriefcase className="text-base" />
            <span>{t.recruiter.floatingBtn}</span>
          </m.button>
        )}
      </AnimatePresence>

      {/* Popup Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card max-w-md w-full p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden border border-[var(--glass-border)] z-10 bg-[var(--glass-card-bg)] max-h-[90vh] overflow-y-auto"
            >
              {/* Top Accent glow */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full border border-[var(--glass-border)] hover:bg-zinc-800/10 dark:hover:bg-zinc-200/5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <FiX className="text-lg" />
              </button>

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--text-main)] flex items-center gap-2">
                      <FiBriefcase className="text-primary text-xl md:text-2xl" />
                      {t.recruiter.modalTitle}
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--text-body)]">
                      {t.recruiter.modalSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.recruiter.fieldName} *</label>
                      <input
                        type="text"
                        required
                        placeholder="z.B. Thomas Müller"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl glass-card border border-[var(--glass-border)] focus:border-primary/50 text-[var(--text-main)] placeholder-zinc-400 focus:outline-none transition-all duration-300 text-sm"
                      />
                    </div>

                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.recruiter.fieldCompany} *</label>
                      <input
                        type="text"
                        required
                        placeholder="z.B. Swisscom AG"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl glass-card border border-[var(--glass-border)] focus:border-primary/50 text-[var(--text-main)] placeholder-zinc-400 focus:outline-none transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Position Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.recruiter.fieldPosition}</label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl glass-card border border-[var(--glass-border)] focus:border-primary/50 text-[var(--text-main)] focus:outline-none transition-all duration-300 text-sm cursor-pointer"
                      >
                        <option value="Kaufmann EFZ">{t.recruiter.posKaufmann}</option>
                        <option value="Elektroinstallateur EFZ">{t.recruiter.posElektro}</option>
                        <option value="Schnupperlehre / Anderes">{t.recruiter.posOther}</option>
                      </select>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.recruiter.fieldPhone}</label>
                      <input
                        type="tel"
                        placeholder="z.B. +41 79 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl glass-card border border-[var(--glass-border)] focus:border-primary/50 text-[var(--text-main)] placeholder-zinc-400 focus:outline-none transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.recruiter.fieldEmail} *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@firma.ch"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl glass-card border border-[var(--glass-border)] focus:border-primary/50 text-[var(--text-main)] placeholder-zinc-400 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* Optional message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.recruiter.fieldMessage}</label>
                    <textarea
                      placeholder="z.B. Termin-Vorschläge oder zusätzliche Details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl glass-card border border-[var(--glass-border)] focus:border-primary/50 text-[var(--text-main)] placeholder-zinc-400 focus:outline-none transition-all duration-300 text-sm resize-none"
                    />
                  </div>

                  {/* Math Captcha Spam protection */}
                  <div className="p-4 rounded-2xl border border-[var(--glass-border)] bg-zinc-800/5 dark:bg-zinc-200/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.contact.captchaTitle}</span>
                      <span className="text-sm font-extrabold text-[var(--primary)] px-2 py-0.5 rounded bg-[var(--badge-bg)]">{captchaQuestion}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t.contact.captchaInstruction}
                    </p>
                    <input
                      type="number"
                      required
                      placeholder={t.contact.captchaPlaceholder}
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-[var(--glass-border)] focus:border-primary/50 text-[var(--text-main)] placeholder-zinc-400 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* Error display */}
                  {errorMsg && (
                    <m.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold"
                    >
                      <FiAlertTriangle className="text-base flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </m.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer text-sm tracking-wide"
                  >
                    <FiSend className={loading ? "animate-spin text-base" : "text-base"} />
                    <span>{loading ? t.contact.sending : t.recruiter.btnSubmit}</span>
                  </button>
                </form>
              ) : (
                /* Success view */
                <m.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-6"
                >
                  <m.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl"
                  >
                    <FiCheckCircle />
                  </m.div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[var(--text-main)]">Dankeschön!</h3>
                    <p className="text-sm text-[var(--text-body)] max-w-sm mx-auto leading-relaxed">
                      {t.recruiter.successMessage}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 border border-[var(--glass-border)] text-sm font-semibold rounded-xl text-[var(--text-main)] hover:bg-zinc-800/10 dark:hover:bg-zinc-200/5 transition-all cursor-pointer"
                  >
                    Schliessen
                  </button>
                </m.div>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
