"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiSend,
  FiUser,
  FiCalendar,
  FiCheck,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiArrowLeft,
  FiHeart,
  FiCheckCircle,
} from "react-icons/fi";

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export const Guestbook: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"view" | "write">("view");

  // Form states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Captcha states
  const [captcha, setCaptcha] = useState<{
    text: string;
    expectedHash: string;
  } | null>(null);
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const generateCaptcha = () => {
    const operators = ["+", "-", "*"];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let n1 = 0,
      n2 = 0,
      ans = 0;

    if (op === "+") {
      n1 = Math.floor(Math.random() * 10) + 1;
      n2 = Math.floor(Math.random() * 10) + 1;
      ans = n1 + n2;
    } else if (op === "-") {
      n1 = Math.floor(Math.random() * 10) + 5;
      n2 = Math.floor(Math.random() * n1);
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 8) + 2;
      n2 = Math.floor(Math.random() * 8) + 2;
      ans = n1 * n2;
    }

    const opSymbol = op === "*" ? "×" : op;
    const text = `${n1} ${opSymbol} ${n2} = ?`;
    const expectedHash = String(ans * 43 + 17);

    setCaptcha({ text, expectedHash });
    setUserCaptchaAnswer("");
    setCaptchaError(false);
  };

  const translations = {
    de: {
      title: "Gästebuch",
      subtitle: "Hinterlassen Sie mir eine Nachricht, ein Feedback oder ein nettes Wort!",
      ctaText: "Möchten Sie mir auch eine Nachricht hinterlassen?",
      ctaTextBack: "Möchten Sie zurück zu den gespeicherten Nachrichten?",
      btnWrite: "Nachricht schreiben",
      btnBack: "Zurück zu den Nachrichten",
      lblName: "Ihr Name *",
      lblMessage: "Ihre Nachricht *",
      btnSubmit: "Nachricht absenden",
      placeholderName: "Ihr Name eingeben...",
      placeholderMessage: "Schreiben Sie etwas Schönes hier hinein...",
      emptyFeed: "Noch keine Nachrichten vorhanden. Schreiben Sie die erste!",
      successMsg: "Nachricht erfolgreich hinzugefügt! Vielen Dank.",
      errFields: "Bitte alle Felder ausfüllen.",
      captchaTitle: "Spamschutz-Sicherheitsfrage",
      captchaPlaceholder: "Ergebnis eingeben...",
      captchaInstruction: "Geben Sie das mathematische Ergebnis ein, um Spam zu verhindern.",
      captchaError: "Das Rechenergebnis ist falsch. Bitte versuchen Sie es erneut.",
      errCaptcha: "Spamschutz-Antwort fehlt oder ist falsch.",
      msgCounter: "Nachricht",
      badgeApproved: "Genehmigt",
    },
    tr: {
      title: "Ziyaretçi Defteri",
      subtitle: "Bana bir mesaj, geri bildirim veya güzel bir söz bırakın!",
      ctaText: "Siz de bana bir mesaj veya geri bildirim bırakmak ister misiniz?",
      ctaTextBack: "Kayıtlı mesajlara geri dönmek ister misiniz?",
      btnWrite: "Mesaj Yaz",
      btnBack: "Mesajlara Dön",
      lblName: "Adınız *",
      lblMessage: "Mesajınız *",
      btnSubmit: "Mesajı Gönder",
      placeholderName: "Adınızı girin...",
      placeholderMessage: "Buraya güzel düşüncelerinizi yazın...",
      emptyFeed: "Henüz mesaj yazılmamış. İlk mesajı siz yazın!",
      successMsg: "Mesajınız başarıyla eklendi! Teşekkürler.",
      errFields: "Lütfen tüm alanları doldurun.",
      captchaTitle: "Spam Koruması Güvenlik Sorusu",
      captchaPlaceholder: "Sonucu girin...",
      captchaInstruction: "Spam mesajları engellemek için lütfen yukarıdaki işlemi yapın.",
      captchaError: "İşlem sonucu yanlış, lütfen tekrar deneyin.",
      errCaptcha: "Spam koruması cevabı eksik veya hatalı.",
      msgCounter: "Mesaj",
      badgeApproved: "Onaylandı",
    },
    en: {
      title: "Guestbook",
      subtitle: "Leave me a message, feedback, or just say hello!",
      ctaText: "Would you like to leave me a message or feedback too?",
      ctaTextBack: "Would you like to go back to reading messages?",
      btnWrite: "Write a Message",
      btnBack: "Back to Messages",
      lblName: "Your Name *",
      lblMessage: "Your Message *",
      btnSubmit: "Send Message",
      placeholderName: "Enter your name...",
      placeholderMessage: "Write your nice message here...",
      emptyFeed: "No messages yet. Be the first to write one!",
      successMsg: "Message successfully posted! Thank you.",
      errFields: "Please fill in all fields.",
      captchaTitle: "Anti-Spam Security Question",
      captchaPlaceholder: "Enter result...",
      captchaInstruction: "Solve the math problem above to prevent automated spam.",
      captchaError: "The math result is incorrect. Please try again.",
      errCaptcha: "Spam protection answer is missing or incorrect.",
      msgCounter: "Message",
      badgeApproved: "Approved",
    },
  };

  const t = translations[language as "de" | "tr" | "en"] || translations.de;

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/guestbook");
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      }
    } catch (err) {
      console.error("Error fetching guestbook:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg(t.errFields);
      return;
    }

    // Verify Captcha
    const parsedUserAnswer = parseInt(userCaptchaAnswer.trim(), 10);
    const calculatedHash = String(parsedUserAnswer * 43 + 17);
    if (!captcha || calculatedHash !== captcha.expectedHash) {
      setCaptchaError(true);
      setErrorMsg(t.errCaptcha);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setMessage("");
        generateCaptcha();
        await fetchMessages();
        setCurrentIndex(0); // Focus on the brand new message!
        setMode("view"); // Return to showcase view
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Failed to submit.");
        generateCaptcha();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(
        language === "tr" ? "tr-TR" : language === "de" ? "de-CH" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch (e) {
      return "";
    }
  };

  const handleNext = () => {
    if (messages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const handlePrev = () => {
    if (messages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const currentMsg = messages[currentIndex];

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Toast Notification */}
      {success && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg max-w-lg mx-auto"
        >
          <FiCheck className="text-lg flex-shrink-0" />
          <span>{t.successMsg}</span>
        </m.div>
      )}

      {/* FIXED OUTER GLASS PANEL CONTAINER */}
      <div className="glass-card p-6 md:p-10 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] shadow-2xl relative overflow-hidden flex flex-col justify-between h-[620px]">
        
        {/* CONSTANT TOP HEADER BAR */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-5 h-[65px] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <FiMessageSquare className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-[var(--text-main)] font-logo tracking-wide">
                {t.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {mode === "view" && messages.length > 0
                  ? `${t.msgCounter} ${currentIndex + 1} / ${messages.length}`
                  : t.subtitle}
              </p>
            </div>
          </div>

          {/* Controls: Arrows in View Mode, Back Button in Write Mode */}
          {mode === "view" ? (
            messages.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl glass-card hover:border-primary text-[var(--text-main)] hover:text-primary transition-all cursor-pointer hover:scale-105 active:scale-95 border border-[var(--glass-border)]"
                  aria-label="Previous Message"
                >
                  <FiChevronLeft className="text-lg" />
                </button>
                <span className="font-mono text-xs font-bold text-[var(--text-muted)] px-2">
                  {currentIndex + 1} / {messages.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl glass-card hover:border-primary text-[var(--text-main)] hover:text-primary transition-all cursor-pointer hover:scale-105 active:scale-95 border border-[var(--glass-border)]"
                  aria-label="Next Message"
                >
                  <FiChevronRight className="text-lg" />
                </button>
              </div>
            )
          ) : (
            <button
              onClick={() => setMode("view")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card hover:border-primary text-xs font-bold text-[var(--text-main)] hover:text-primary transition-all cursor-pointer border border-[var(--glass-border)]"
            >
              <FiArrowLeft className="text-sm" />
              <span>{t.btnBack}</span>
            </button>
          )}
        </div>

        {/* INNER SWAPPABLE PANEL BOX (EXACT SAME 410px HEIGHT IN BOTH MODES) */}
        <div className="my-4 flex-1 h-[410px] min-h-[410px] max-h-[410px] overflow-hidden relative">
          <AnimatePresence mode="wait">
            {mode === "view" ? (
              /* --- VIEW MODE: DISPLAY CURRENT MESSAGE --- */
              <m.div
                key="inner-view-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col justify-between space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="text-center space-y-4 py-16 h-full flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shadow-inner">
                      <FiHeart />
                    </div>
                    <p className="text-base md:text-lg font-semibold text-[var(--text-muted)]">
                      {t.emptyFeed}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <m.div
                      key={currentMsg.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="h-full flex flex-col justify-between space-y-4"
                    >
                      {/* Author Header */}
                      <div className="flex items-center justify-between h-[52px] flex-shrink-0">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary to-secondary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                            {currentMsg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-lg md:text-xl font-bold text-[var(--text-main)]">
                              {currentMsg.name}
                            </h4>
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5 font-medium">
                              <FiCalendar className="text-xs" />
                              {formatDate(currentMsg.created_at)}
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                          <FiCheckCircle className="text-xs" />
                          <span>{t.badgeApproved}</span>
                        </span>
                      </div>

                      {/* Body Message Box - EXACT MATCHING INNER HEIGHT */}
                      <div className="p-6 md:p-8 rounded-2xl bg-[var(--badge-bg)] border border-[var(--glass-border)] flex-1 h-[340px] overflow-y-auto custom-scrollbar flex flex-col justify-start">
                        <p className="text-base md:text-lg text-[var(--text-main)] leading-relaxed whitespace-pre-line font-sans">
                          {currentMsg.message}
                        </p>
                      </div>
                    </m.div>
                  </AnimatePresence>
                )}
              </m.div>
            ) : (
              /* --- WRITE MODE: FORM FILLS THE EXACT SAME 410px INNER HEIGHT --- */
              <m.div
                key="inner-write-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col justify-between"
              >
                <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
                  {errorMsg && (
                    <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 mb-2">
                      <span>⚠️ {errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    {/* Name Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        {t.lblName}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                          <FiUser className="text-sm" />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.placeholderName}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Message Textarea - EXPANDS TO FILL THE PANEL */}
                    <div className="space-y-1 flex-1 flex flex-col">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        {t.lblMessage}
                      </label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.placeholderMessage}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all flex-1 min-h-[120px] leading-relaxed resize-none shadow-sm"
                      />
                    </div>

                    {/* Math Captcha Box */}
                    <div className="p-3 glass-card rounded-2xl border border-[var(--glass-border)] bg-zinc-900/10 space-y-2">
                      <div className="flex items-center justify-between text-xs md:text-sm font-bold text-[var(--text-main)]">
                        <div className="flex items-center gap-2">
                          <span>🔢</span>
                          <span>{t.captchaTitle}</span>
                        </div>
                        <div
                          suppressHydrationWarning
                          className="text-base font-black text-primary tracking-wide font-mono"
                        >
                          {captcha?.text}
                        </div>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={t.captchaPlaceholder}
                        value={userCaptchaAnswer}
                        onChange={(e) => {
                          setUserCaptchaAnswer(e.target.value);
                          setCaptchaError(false);
                        }}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 rounded-xl text-[var(--text-main)] placeholder-zinc-500 focus:outline-none focus:border-primary transition-all text-sm disabled:opacity-50"
                      />
                      {captchaError && (
                        <p className="text-xs text-rose-400 font-bold">
                          ❌ {t.captchaError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs md:text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <FiLoader className="animate-spin text-base" />
                      ) : (
                        <FiSend className="text-base" />
                      )}
                      {t.btnSubmit}
                    </button>
                  </div>
                </form>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONSTANT BOTTOM CTA BAR (EXACT 60px HEIGHT) */}
        <div className="pt-4 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-4 h-[60px] flex-shrink-0">
          <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium text-center sm:text-left">
            {mode === "view" ? t.ctaText : t.ctaTextBack}
          </p>

          {mode === "view" ? (
            <button
              onClick={() => {
                generateCaptcha();
                setMode("write");
              }}
              className="px-6 py-3.5 rounded-2xl bg-primary hover:opacity-90 text-white font-bold text-xs md:text-sm shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 cursor-pointer flex items-center gap-2.5 hover:scale-[1.03] active:scale-95 w-full sm:w-auto justify-center"
            >
              <FiEdit3 className="text-base" />
              <span>{t.btnWrite}</span>
            </button>
          ) : (
            <button
              onClick={() => setMode("view")}
              className="px-6 py-3.5 rounded-2xl glass-card hover:border-primary/50 text-[var(--text-main)] hover:text-primary font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer flex items-center gap-2 border border-[var(--glass-border)] w-full sm:w-auto justify-center"
            >
              <FiArrowLeft className="text-base" />
              <span>{t.btnBack}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
