"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiUser, FiCalendar, FiCheck, FiLoader } from 'react-icons/fi';

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export const Guestbook: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const translations = {
    de: {
      title: "Gästebuch",
      subtitle: "Hinterlassen Sie mir eine Nachricht, ein Feedback oder ein nettes Wort!",
      lblName: "Ihr Name *",
      lblMessage: "Ihre Nachricht *",
      btnSubmit: "Nachricht absenden",
      placeholderName: "Name eingeben...",
      placeholderMessage: "Nachricht eingeben...",
      emptyFeed: "Noch keine Nachrichten vorhanden. Schreiben Sie die erste!",
      successMsg: "Nachricht erfolgreich hinzugefügt! Vielen Dank.",
      errFields: "Bitte alle Felder ausfüllen."
    },
    tr: {
      title: "Ziyaretçi Defteri",
      subtitle: "Bana bir mesaj, geri bildirim veya güzel bir söz bırakın!",
      lblName: "Adınız *",
      lblMessage: "Mesajınız *",
      btnSubmit: "Mesajı Gönder",
      placeholderName: "Adınızı girin...",
      placeholderMessage: "Mesajınızı yazın...",
      emptyFeed: "Henüz mesaj yazılmamış. İlk mesajı siz yazın!",
      successMsg: "Mesajınız başarıyla eklendi! Teşekkürler.",
      errFields: "Lütfen tüm alanları doldurun."
    },
    en: {
      title: "Guestbook",
      subtitle: "Leave me a message, feedback, or just say hello!",
      lblName: "Your Name *",
      lblMessage: "Your Message *",
      btnSubmit: "Send Message",
      placeholderName: "Enter your name...",
      placeholderMessage: "Enter your message...",
      emptyFeed: "No messages yet. Be the first to write one!",
      successMsg: "Message successfully posted! Thank you.",
      errFields: "Please fill in all fields."
    }
  };

  const t = translations[language as 'de' | 'tr' | 'en'] || translations.de;

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching guestbook:', err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Listen to updates from other pages
    const handleRefresh = () => fetchMessages();
    window.addEventListener('guestbook-updated', handleRefresh);
    return () => window.removeEventListener('guestbook-updated', handleRefresh);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg(t.errFields);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setMessage('');
        fetchMessages();
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Failed to submit message.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-CH' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Area */}
      <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] relative overflow-hidden shadow-lg space-y-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-60" />
        <div>
          <h3 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
            <FiMessageSquare className="text-primary text-xl" />
            {t.title}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {success && (
          <m.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
          >
            <FiCheck className="text-base flex-shrink-0" />
            <span>{t.successMsg}</span>
          </m.div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblName}</label>
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblMessage}</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.placeholderMessage}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all min-h-[100px] leading-relaxed resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-primary hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <FiLoader className="animate-spin text-base" />
            ) : (
              <FiSend className="text-base" />
            )}
            {t.btnSubmit}
          </button>
        </form>
      </div>

      {/* Feed Area */}
      <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-sm text-[var(--text-muted)] glass-card rounded-3xl border border-[var(--glass-border)]"
            >
              {t.emptyFeed}
            </m.div>
          ) : (
            messages.map((msg) => (
              <m.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="p-5 glass-card rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] shadow-sm space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-black text-sm">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-[var(--text-main)]">{msg.name}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                    <FiCalendar />
                    {formatDate(msg.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-body)] leading-relaxed whitespace-pre-line pl-10">
                  {msg.message}
                </p>
              </m.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
