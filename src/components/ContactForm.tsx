"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Captcha states
  const [captcha, setCaptcha] = useState<{ text: string; expectedHash: string } | null>(null);
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  const generateCaptcha = () => {
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let n1 = 0, n2 = 0, ans = 0;

    if (op === '+') {
      n1 = Math.floor(Math.random() * 10) + 1; // 1-10
      n2 = Math.floor(Math.random() * 10) + 1; // 1-10
      ans = n1 + n2;
    } else if (op === '-') {
      n1 = Math.floor(Math.random() * 10) + 5; // 5-15
      n2 = Math.floor(Math.random() * n1);     // 0 to n1 (ensures positive result)
      ans = n1 - n2;
    } else { // '*'
      n1 = Math.floor(Math.random() * 8) + 2; // 2-9
      n2 = Math.floor(Math.random() * 8) + 2; // 2-9
      ans = n1 * n2;
    }

    const opSymbol = op === '*' ? '×' : op;
    const text = `${n1} ${opSymbol} ${n2} = ?`;
    const expectedHash = String(ans * 43 + 17);

    setCaptcha({ text, expectedHash });
    setUserCaptchaAnswer('');
    setCaptchaError(false);
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Verify Captcha
    const parsedUserAnswer = parseInt(userCaptchaAnswer.trim(), 10);
    const calculatedHash = String(parsedUserAnswer * 43 + 17);
    if (!captcha || calculatedHash !== captcha.expectedHash) {
      setCaptchaError(true);
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mathAnswer: userCaptchaAnswer,
          mathHash: captcha.expectedHash
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
          generateCaptcha();
        } else {
          setStatus('error');
          generateCaptcha();
        }
      } else {
        setStatus('error');
        generateCaptcha();
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      generateCaptcha();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-0">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-2 bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
          {t.contact.title}
        </h2>
        <p className="text-[var(--text-muted)] text-sm md:text-base max-w-md mx-auto">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 blur-2xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-navy-500/10 blur-2xl rounded-full" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-body)] mb-2">
              {t.contact.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'sending'}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 rounded-2xl text-[var(--text-main)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-body)] mb-2">
              {t.contact.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={status === 'sending'}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 rounded-2xl text-[var(--text-main)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--text-body)] mb-2">
              {t.contact.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              disabled={status === 'sending'}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 rounded-2xl text-[var(--text-main)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 resize-none"
            />
          </div>

          {/* Math Captcha Box */}
          <div className="p-5 glass-card rounded-2xl border border-[var(--glass-border)] bg-zinc-900/10 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
              <span>🔢</span>
              <span>{t.contact.captchaTitle}: {captcha?.text}</span>
            </div>
            <input
              type="text"
              required
              placeholder={t.contact.captchaPlaceholder}
              value={userCaptchaAnswer}
              onChange={(e) => {
                setUserCaptchaAnswer(e.target.value);
                setCaptchaError(false);
              }}
              disabled={status === 'sending'}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 rounded-2xl text-[var(--text-main)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
            />
            {captchaError && (
              <p className="text-xs text-rose-400 font-bold mt-1">
                ❌ {t.contact.captchaError}
              </p>
            )}
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {t.contact.captchaInstruction}
            </p>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.contact.sending}
              </>
            ) : (
              <>
                <FiSend className="text-lg" />
                {t.contact.send}
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {status === 'success' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
            >
              <FiCheckCircle className="text-lg flex-shrink-0" />
              <span>{t.contact.success}</span>
            </m.div>
          )}

          {status === 'error' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium"
            >
              <FiAlertCircle className="text-lg flex-shrink-0" />
              <span>{t.contact.error}</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
