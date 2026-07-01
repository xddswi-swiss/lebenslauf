"use client";

import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  FiLock, 
  FiUnlock, 
  FiPlus, 
  FiCheck, 
  FiAlertCircle, 
  FiFileText, 
  FiImage, 
  FiLoader,
  FiX,
  FiTrash2
} from 'react-icons/fi';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface FileData {
  name: string;
  base64: string;
}

export const AdminExperienceForm: React.FC<{ forceOpen?: boolean }> = ({ forceOpen = false }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  // Form fields state
  const [type, setType] = useState<'work' | 'education'>('work');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [period, setPeriod] = useState('');

  // Language specific fields
  const [activeTab, setActiveTab] = useState<'de' | 'tr' | 'en'>('de');
  const [roles, setRoles] = useState({ de: '', tr: '', en: '' });
  const [tasksText, setTasksText] = useState({ de: '', tr: '', en: '' });

  // Files
  const [pdfFile, setPdfFile] = useState<FileData | null>(null);
  const [logoFile, setLogoFile] = useState<FileData | null>(null);

  // Submission states
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // List of existing experiences for deletion in admin
  const [existingExperiences, setExistingExperiences] = useState<any[]>([]);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences');
      if (res.ok) {
        const data = await res.json();
        setExistingExperiences(data.de || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteExperience = async (company: string, period: string) => {
    const confirmMsg = language === 'tr' 
      ? `"${company}" kaydını silmek istediğinize emin misiniz?` 
      : `Sind Sie sicher, dass Sie den Eintrag "${company}" löschen möchten?`;
    if (!window.confirm(confirmMsg)) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const passcode = localStorage.getItem('admin_passcode') || 'eren2026';
      const res = await fetch('/api/experiences', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, company, period })
      });

      if (res.ok) {
        const result = await res.json();
        setSuccessMsg(language === 'tr' ? 'Başarıyla silindi!' : 'Erfolgreich gelöscht!');
        fetchExperiences();
        // Trigger event to refresh homepage
        window.dispatchEvent(new CustomEvent('experiences-updated', {
          detail: { action: 'delete', data: result.data }
        }));
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Failed to delete.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchExperiences();
    }
  }, [isUnlocked]);

  // Read-only serverless fallback states
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [fallbackJson, setFallbackJson] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      if (typeof window !== 'undefined') {
        const isUnlockedLocally = localStorage.getItem('admin_unlocked') === 'true';
        setIsUnlocked(isUnlockedLocally);
        if (!isUnlockedLocally) {
          setIsOpen(forceOpen);
          setPasscode('');
          setPasscodeError('');
        } else {
          setPasscode(localStorage.getItem('admin_passcode') || '');
          setIsOpen(true);
        }
      }
    };
    
    checkAdmin();
    window.addEventListener('admin-state-changed', checkAdmin);
    return () => {
      window.removeEventListener('admin-state-changed', checkAdmin);
    };
  }, [forceOpen]);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'eren2026') {
      setIsUnlocked(true);
      setPasscodeError('');
      localStorage.setItem('admin_unlocked', 'true');
      localStorage.setItem('admin_passcode', passcode);
      window.dispatchEvent(new Event('admin-state-changed'));
    } else {
      setPasscodeError(
        language === 'tr' 
          ? 'Yanlış Şifre!' 
          : language === 'de' 
            ? 'Falsches Passwort!' 
            : 'Incorrect Passcode!'
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'logo' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (fileType === 'logo') {
        setLogoFile({ name: file.name, base64 });
      } else {
        setPdfFile({ name: file.name, base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRoleChange = (val: string) => {
    setRoles(prev => ({ ...prev, [activeTab]: val }));
  };

  const handleTasksChange = (val: string) => {
    setTasksText(prev => ({ ...prev, [activeTab]: val }));
  };

  const handleAutoTranslateRole = async (sourceLang: 'de' | 'tr' | 'en') => {
    const textToTranslate = roles[sourceLang];
    if (!textToTranslate.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const translateText = async (text: string, from: string, to: string): Promise<string> => {
        try {
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
          if (res.ok) {
            const data = await res.json();
            return data[0].map((x: any) => x[0]).join('');
          }
        } catch (err) {
          console.error(err);
        }
        return '';
      };

      const targets: ('de' | 'tr' | 'en')[] = ['de', 'tr', 'en'];
      const promises = targets.map(async (lang) => {
        if (lang === sourceLang) return;
        const translated = await translateText(textToTranslate, sourceLang, lang);
        if (translated) {
          setRoles(prev => ({ ...prev, [lang]: translated }));
        }
      });
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      setErrorMsg('Translation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoTranslateTasks = async (sourceLang: 'de' | 'tr' | 'en') => {
    const textToTranslate = tasksText[sourceLang];
    if (!textToTranslate.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const translateText = async (text: string, from: string, to: string): Promise<string> => {
        try {
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
          if (res.ok) {
            const data = await res.json();
            return data[0].map((x: any) => x[0]).join('');
          }
        } catch (err) {
          console.error(err);
        }
        return '';
      };

      const targets: ('de' | 'tr' | 'en')[] = ['de', 'tr', 'en'];
      const promises = targets.map(async (lang) => {
        if (lang === sourceLang) return;
        const translated = await translateText(textToTranslate, sourceLang, lang);
        if (translated) {
          setTasksText(prev => ({ ...prev, [lang]: translated }));
        }
      });
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      setErrorMsg('Translation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setType('work');
    setCompany('');
    setCity('');
    setPeriod('');
    setRoles({ de: '', tr: '', en: '' });
    setTasksText({ de: '', tr: '', en: '' });
    setPdfFile(null);
    setLogoFile(null);
    setSuccessMsg('');
    setErrorMsg('');
    // Clear input file values
    const logoInput = document.getElementById('logo-upload') as HTMLInputElement;
    const pdfInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (logoInput) logoInput.value = '';
    if (pdfInput) pdfInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validate that at least one language has both role and tasks filled out
    const hasDe = roles.de.trim() !== '' && tasksText.de.trim() !== '';
    const hasTr = roles.tr.trim() !== '' && tasksText.tr.trim() !== '';
    const hasEn = roles.en.trim() !== '' && tasksText.en.trim() !== '';

    if (!hasDe && !hasTr && !hasEn) {
      setErrorMsg(
        language === 'tr'
          ? 'Lütfen en az bir dil için Görev ve Yapılan İşler alanlarını doldurun.'
          : language === 'de'
            ? 'Bitte füllen Sie Rolle und Tätigkeiten für mindestens eine Sprache aus.'
            : 'Please fill in the Role and Tasks for at least one language.'
      );
      return;
    }

    setIsLoading(true);

    // Parse tasks
    const parseTasks = (text: string) => {
      return text
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);
    };

    const translateText = async (text: string, from: string, to: string): Promise<string> => {
      if (!text.trim()) return '';
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
        if (res.ok) {
          const data = await res.json();
          return data[0].map((x: any) => x[0]).join('');
        }
      } catch (err) {
        console.error(`Translation error from ${from} to ${to}:`, err);
      }
      return text;
    };

    // Decouple source language determination for role and tasks fields independently
    const fallbackRole = roles.de.trim() || roles.tr.trim() || roles.en.trim();
    const fallbackTasks = tasksText.de.trim() || tasksText.tr.trim() || tasksText.en.trim();

    const getRoleSrcLang = () => {
      if (roles.de.trim()) return 'de';
      if (roles.tr.trim()) return 'tr';
      return 'en';
    };
    const getTasksSrcLang = () => {
      if (tasksText.de.trim()) return 'de';
      if (tasksText.tr.trim()) return 'tr';
      return 'en';
    };

    const roleSrcLang = getRoleSrcLang();
    const tasksSrcLang = getTasksSrcLang();

    try {
      const [finalDeRole, finalTrRole, finalEnRole, finalDeTasksText, finalTrTasksText, finalEnTasksText] = await Promise.all([
        roles.de.trim() ? Promise.resolve(roles.de.trim()) : translateText(fallbackRole, roleSrcLang, 'de'),
        roles.tr.trim() ? Promise.resolve(roles.tr.trim()) : translateText(fallbackRole, roleSrcLang, 'tr'),
        roles.en.trim() ? Promise.resolve(roles.en.trim()) : translateText(fallbackRole, roleSrcLang, 'en'),
        tasksText.de.trim() ? Promise.resolve(tasksText.de.trim()) : translateText(fallbackTasks, tasksSrcLang, 'de'),
        tasksText.tr.trim() ? Promise.resolve(tasksText.tr.trim()) : translateText(fallbackTasks, tasksSrcLang, 'tr'),
        tasksText.en.trim() ? Promise.resolve(tasksText.en.trim()) : translateText(fallbackTasks, tasksSrcLang, 'en')
      ]);

      const payload = {
        passcode,
        type,
        company,
        city,
        period,
        de: {
          role: finalDeRole,
          tasks: parseTasks(finalDeTasksText)
        },
        tr: {
          role: finalTrRole,
          tasks: parseTasks(finalTrTasksText)
        },
        en: {
          role: finalEnRole,
          tasks: parseTasks(finalEnTasksText)
        },
        pdfFile,
        logoFile
      };

      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Server error');
      }

      if (result.readOnly) {
        // Safe read-only mode backup copy paste
        setFallbackJson(JSON.stringify(result.jsonBackup, null, 2));
        setShowFallbackModal(true);
        setSuccessMsg(
          language === 'tr'
            ? 'Yeni firma oluşturuldu ancak sunucu salt okunurdur. JSON kodunu kopyalayıp ekleyin.'
            : language === 'de'
              ? 'Firma erstellt, aber Server ist schreibgeschützt. JSON kopieren und einfügen.'
              : 'Company created, but server is read-only. Copy and paste the JSON.'
        );
      } else {
        const successAlertMsg = {
          tr: 'Yeni firma/deneyim başarıyla eklendi! 🎉',
          de: 'Neuer Eintrag erfolgreich hinzugefügt! 🎉',
          en: 'New entry successfully added! 🎉'
        };
        
        resetForm();
        setSuccessMsg(successAlertMsg[language as 'de' | 'tr' | 'en'] || successAlertMsg.tr);
        setTimeout(() => setSuccessMsg(''), 5000);

        fetchExperiences();
        
        // Trigger custom event to notify Timeline component to reload and do optimistic update
        window.dispatchEvent(new CustomEvent('experiences-updated', {
          detail: {
            action: 'add',
            data: result.data || result.jsonBackup
          }
        }));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(fallbackJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labels = {
    tr: {
      btnOpen: 'Yeni Firma Ekle (Yalnızca Eren)',
      btnClose: 'Formu Kapat',
      passTitle: 'Admin Girişi',
      passDesc: 'Yeni staj eklemek için şifreyi girin.',
      passPlaceholder: 'Şifrenizi yazın...',
      passBtn: 'Giriş Yap',
      title: 'Yeni Firma Deneyimi Ekle',
      lblCompany: 'Firma Adı',
      lblCity: 'Şehir',
      lblPeriod: 'Dönem / Tarih Aralığı',
      lblRole: 'Görev / Pozisyon',
      lblTasks: 'Yapılan İşler (Her satıra bir adet)',
      placeholderTasks: 'Örn:\nElektrik tesisat işlerine yardımcı olundu.\nKanal açma ve kablo çekimi yapıldı.',
      lblLogo: 'Firma Logosu (İsteğe bağlı PNG/JPG)',
      lblPdf: 'Rapor PDF (İsteğe bağlı)',
      btnSubmit: 'Firma Ekle',
      fallbackTitle: 'Salt Okunur Sunucu Uyarısı',
      fallbackDesc: 'Proje şu an salt okunur bir sunucuda (Vercel gibi) barındırılmaktadır. Bu sebeple veriler doğrudan kaydedilemedi. Lütfen aşağıdaki JSON kodunu kopyalayın ve projenizin içindeki "src/data/experiences.json" dosyasının içeriği ile tamamen değiştirin.',
      btnCopy: 'Kodu Kopyala',
      btnCopied: 'Kopyalandı!',
    },
    de: {
      btnOpen: 'Neue Firma hinzufügen (Nur Eren)',
      btnClose: 'Formular schließen',
      passTitle: 'Admin-Bereich',
      passDesc: 'Geben Sie das Passwort ein, um eine neue Schnupperlehre hinzuzufügen.',
      passPlaceholder: 'Passwort eingeben...',
      passBtn: 'Einloggen',
      title: 'Neue Schnupperlehre hinzufügen',
      lblCompany: 'Firmenname',
      lblCity: 'Stadt',
      lblPeriod: 'Zeitraum / Datum',
      lblRole: 'Rolle / Berufsbild',
      lblTasks: 'Tätigkeiten (Eine pro Zeile)',
      placeholderTasks: 'Z.B.:\nEinblick in den Beruf des Elektroinstallateurs.\nVerlegen von Leitungen und Kabelkanälen.',
      lblLogo: 'Firmenlogo (Optional PNG/JPG)',
      lblPdf: 'Bericht PDF (Optional)',
      btnSubmit: 'Firma hinzufügen',
      fallbackTitle: 'Server Schreibgeschützt',
      fallbackDesc: 'Dieses Projekt läuft auf einem schreibgeschützten Server (z.B. Vercel). Die Daten konnten nicht direkt gespeichert werden. Bitte kopieren Sie den folgenden JSON-Code und ersetzen Sie damit den Inhalt der Datei "src/data/experiences.json" in Ihrem Projekt.',
      btnCopy: 'Code kopieren',
      btnCopied: 'Kopiert!',
    },
    en: {
      btnOpen: 'Add New Company (Eren Only)',
      btnClose: 'Close Form',
      passTitle: 'Admin Login',
      passDesc: 'Enter the passcode to add a new internship experience.',
      passPlaceholder: 'Enter passcode...',
      passBtn: 'Login',
      title: 'Add New Company Experience',
      lblCompany: 'Company Name',
      lblCity: 'City',
      lblPeriod: 'Period / Dates',
      lblRole: 'Role / Title',
      lblTasks: 'Tasks performed (One per line)',
      placeholderTasks: 'E.g.:\nAssisted with electrical installations.\nLearned about cable routing and safety rules.',
      lblLogo: 'Company Logo (Optional PNG/JPG)',
      lblPdf: 'Report PDF (Optional)',
      btnSubmit: 'Add Company',
      fallbackTitle: 'Server Read-Only',
      fallbackDesc: 'This project is running on a read-only host (e.g. Vercel). The files could not be updated directly. Please copy the JSON below and replace the content of your "src/data/experiences.json" file with it.',
      btnCopy: 'Copy Code',
      btnCopied: 'Copied!',
    }
  };

  const t = labels[language as 'de' | 'tr' | 'en'] || labels.de;

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      {/* Toggle Button */}
      {!forceOpen && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              const nextOpen = !isOpen;
              setIsOpen(nextOpen);
              if (!nextOpen) {
                setPasscode('');
                setIsUnlocked(false);
                setPasscodeError('');
                localStorage.removeItem('admin_unlocked');
                localStorage.removeItem('admin_passcode');
                window.dispatchEvent(new Event('admin-state-changed'));
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border border-[var(--glass-border)] bg-zinc-900/10 hover:bg-zinc-800/20 text-[var(--text-body)] hover:text-[var(--text-main)] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {isUnlocked ? <FiUnlock className="text-sm" /> : <FiLock className="text-sm" />}
            {isOpen ? t.btnClose : t.btnOpen}
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="mt-0 relative overflow-hidden"
          >
            {/* Background blur decorative element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 blur-2xl rounded-full" />

            {!isUnlocked ? (
              // 1. Password Lock View
              <form onSubmit={handlePasscodeSubmit} className="max-w-md mx-auto py-8 text-center space-y-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FiLock className="text-xl" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[var(--text-main)]">{t.passTitle}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{t.passDesc}</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder={t.passPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-center font-bold tracking-widest transition-all"
                  />
                  {passcodeError && (
                    <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1">
                      <FiAlertCircle /> {passcodeError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-white text-sm font-semibold shadow-md shadow-primary/10 transition-all cursor-pointer"
                  >
                    {t.passBtn}
                  </button>
                </div>
              </form>
            ) : (
              // 2. Full Experience Creation Form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-[var(--glass-border)] pb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    {t.title}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1">
                    <FiUnlock className="text-green-500" /> Admin Mode
                  </span>
                </div>

                {/* Messages */}
                {successMsg && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-2">
                    <FiCheck className="text-lg flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-2">
                    <FiAlertCircle className="text-lg flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section type dropdown selector */}
                <div className="space-y-1.5 max-w-xs pt-1">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    {language === 'tr' ? 'Bölüm Seçin' : language === 'de' ? 'Bereich auswählen' : 'Select Section'}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'work' | 'education')}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
                  >
                    <option value="work">
                      {language === 'tr' ? 'Staj / Deneyim' : language === 'de' ? 'Schnupperlehre (Erfahrung)' : 'Trial Apprenticeship (Experience)'}
                    </option>
                    <option value="education">
                      {language === 'tr' ? 'Eğitim (Okul)' : language === 'de' ? 'Ausbildung (Schule)' : 'Education (School)'}
                    </option>
                  </select>
                </div>

                {/* Compute dynamic labels based on selected type */}
                {(() => {
                  const companyLabel = type === 'work' 
                    ? t.lblCompany 
                    : (language === 'tr' ? 'Okul / Kurum Adı' : language === 'de' ? 'Schulname / Institution' : 'School / Institution');

                  const companyPlaceholder = type === 'work'
                    ? 'e.g. EWZ, Schibli AG'
                    : (language === 'tr' ? 'Örn: Sekundarschule Zürich Rebhügel' : language === 'de' ? 'Z.B. Sekundarschule Zürich Rebhügel' : 'e.g. Sekundarschule Zurich Rebhugel');

                  const cityPlaceholder = type === 'work'
                    ? 'e.g. Zürich'
                    : 'e.g. Zürich';

                  const periodPlaceholder = type === 'work'
                    ? 'e.g. 06/2026 or 05/2025'
                    : 'e.g. 2023 - 2026';

                  return (
                    /* Row 1: Company/School, City, Period */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{companyLabel} *</label>
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder={companyPlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblCity} *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder={cityPlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblPeriod} *</label>
                        <input
                          type="text"
                          required
                          value={period}
                          onChange={(e) => setPeriod(e.target.value)}
                          placeholder={periodPlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Translation input fields (No tabs, show all languages for instant preview) */}
                <div className="space-y-6 pt-2">
                  {/* Deutsch (DE) Block */}
                  <div className="space-y-4 p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--background)]/10">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">Deutsch (DE)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {type === 'work' ? 'Rolle / Berufsbild (DE)' : 'Klasse / Ausbildunggang (DE)'} *
                          </label>
                          {roles.de.trim() && (
                            <button
                              type="button"
                              onClick={() => handleAutoTranslateRole('de')}
                              className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={roles.de}
                          onChange={(e) => setRoles(prev => ({ ...prev, de: e.target.value }))}
                          placeholder={type === 'work' ? 'z.B. Schnupperlehre Elektroinstallateur' : 'z.B. Sekundarschule (Sek A)'}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {type === 'work' ? 'Tätigkeiten (DE)' : 'Beschreibung (DE)'} *
                          </label>
                          {tasksText.de.trim() && (
                            <button
                              type="button"
                              onClick={() => handleAutoTranslateTasks('de')}
                              className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                            </button>
                          )}
                        </div>
                        <textarea
                          value={tasksText.de}
                          onChange={(e) => setTasksText(prev => ({ ...prev, de: e.target.value }))}
                          placeholder={type === 'work' ? t.placeholderTasks : 'Beschreibung...'}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Türkçe (TR) Block */}
                  <div className="space-y-4 p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--background)]/10">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">Türkçe (TR)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {type === 'work' ? 'Rolle / Berufsbild (TR)' : 'Bölüm / Derece (TR)'}
                          </label>
                          {roles.tr.trim() && (
                            <button
                              type="button"
                              onClick={() => handleAutoTranslateRole('tr')}
                              className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={roles.tr}
                          onChange={(e) => setRoles(prev => ({ ...prev, tr: e.target.value }))}
                          placeholder={type === 'work' ? 'Örn: Elektrik Tesisatçısı Stajı' : 'Örn: Sekundarschule (Sek A)'}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {type === 'work' ? 'Tätigkeiten (TR)' : 'Açıklama (TR)'}
                          </label>
                          {tasksText.tr.trim() && (
                            <button
                              type="button"
                              onClick={() => handleAutoTranslateTasks('tr')}
                              className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                            </button>
                          )}
                        </div>
                        <textarea
                          value={tasksText.tr}
                          onChange={(e) => setTasksText(prev => ({ ...prev, tr: e.target.value }))}
                          placeholder="Açıklama..."
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* English (EN) Block */}
                  <div className="space-y-4 p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--background)]/10">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">English (EN)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {type === 'work' ? 'Rolle / Berufsbild (EN)' : 'Degree / Program (EN)'}
                          </label>
                          {roles.en.trim() && (
                            <button
                              type="button"
                              onClick={() => handleAutoTranslateRole('en')}
                              className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={roles.en}
                          onChange={(e) => setRoles(prev => ({ ...prev, en: e.target.value }))}
                          placeholder="e.g. Trial Apprenticeship Electrical Installer"
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {type === 'work' ? 'Tätigkeiten (EN)' : 'Description (EN)'}
                          </label>
                          {tasksText.en.trim() && (
                            <button
                              type="button"
                              onClick={() => handleAutoTranslateTasks('en')}
                              className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                            </button>
                          )}
                        </div>
                        <textarea
                          value={tasksText.en}
                          onChange={(e) => setTasksText(prev => ({ ...prev, en: e.target.value }))}
                          placeholder="Description..."
                          className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--glass-border)] focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2 p-4 rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--background)]/5 hover:bg-zinc-800/5 transition-all">
                    <label className="text-xs font-bold text-[var(--text-body)] flex items-center gap-2 cursor-pointer">
                      <FiImage className="text-base text-primary" />
                      <span>{t.lblLogo}</span>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'logo')}
                      className="block w-full text-xs text-[var(--text-muted)]
                        file:mr-4 file:py-1.5 file:px-3
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-primary/10 file:text-primary
                        hover:file:bg-primary/20
                        cursor-pointer file:cursor-pointer"
                    />
                    {logoFile && (
                      <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                        <FiCheck /> Selected: {logoFile.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 p-4 rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--background)]/5 hover:bg-zinc-800/5 transition-all">
                    <label className="text-xs font-bold text-[var(--text-body)] flex items-center gap-2 cursor-pointer">
                      <FiFileText className="text-base text-primary" />
                      <span>{t.lblPdf}</span>
                    </label>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e, 'pdf')}
                      className="block w-full text-xs text-[var(--text-muted)]
                        file:mr-4 file:py-1.5 file:px-3
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-primary/10 file:text-primary
                        hover:file:bg-primary/20
                        cursor-pointer file:cursor-pointer"
                    />
                    {pdfFile && (
                      <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                        <FiCheck /> Selected: {pdfFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-primary hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-primary/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin text-lg" />
                  ) : (
                    <FiPlus className="text-lg" />
                  )}
                </button>

                {/* Existing Experiences List for Deletion */}
                <div className="mt-12 pt-8 border-t border-[var(--glass-border)] space-y-4">
                  <h4 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-primary rounded-full" />
                    {language === 'tr' ? 'Mevcut Kayıtları Yönet' : language === 'de' ? 'Einträge verwalten' : 'Manage Existing Entries'}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    {language === 'tr' 
                      ? 'Listeden silmek istediğiniz staj veya okul kaydını çöp kutusu simgesine tıklayarak kaldırabilirsiniz.' 
                      : 'Klicken Sie auf das Papierkorb-Symbol, um einen Eintrag zu löschen.'}
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    {existingExperiences.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--background)]/5 flex items-center justify-between gap-4 hover:bg-[var(--glass-border)]/10 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[var(--text-main)]">{item.company}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                              {item.type === 'education' ? (language === 'tr' ? 'EĞİTİM' : 'BILDUNG') : (language === 'tr' ? 'STAJ' : 'ARBEIT')}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-body)] mt-0.5 font-medium">{item.role}</p>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">{item.period}</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(item.company, item.period)}
                          className="p-2 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer active:scale-95"
                          title="Löschen / Sil / Delete"
                        >
                          <FiTrash2 className="text-base" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </m.div>
        )}
      </AnimatePresence>

      {/* 3. Fallback Copy-Paste Modal */}
      <AnimatePresence>
        {showFallbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl shadow-2xl relative flex flex-col space-y-4 max-h-[85vh] overflow-hidden"
            >
              <button 
                onClick={() => setShowFallbackModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full border border-[var(--glass-border)] hover:bg-zinc-800/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all cursor-pointer"
              >
                <FiX className="text-base" />
              </button>

              <div className="flex items-center gap-3 text-amber-500">
                <FiAlertCircle className="text-2xl flex-shrink-0" />
                <h3 className="text-xl font-bold">{t.fallbackTitle}</h3>
              </div>

              <p className="text-sm text-[var(--text-body)] leading-relaxed">
                {t.fallbackDesc}
              </p>

              <div className="flex-1 min-h-[200px] flex flex-col relative bg-[var(--background)] rounded-xl border border-[var(--glass-border)] overflow-hidden">
                <textarea
                  readOnly
                  value={fallbackJson}
                  className="flex-1 p-4 w-full h-full font-mono text-xs text-green-500 bg-transparent resize-none border-none outline-none leading-relaxed overflow-y-auto"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyJson}
                  className="flex-1 py-3.5 rounded-xl bg-primary hover:opacity-90 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FiCheck className={`text-base transition-transform ${copied ? 'scale-100' : 'scale-0 w-0'}`} />
                  {copied ? t.btnCopied : t.btnCopy}
                </button>
                
                <button
                  onClick={() => setShowFallbackModal(false)}
                  className="px-6 py-3.5 rounded-xl border border-[var(--glass-border)] hover:bg-zinc-800/10 text-[var(--text-body)] font-bold text-sm transition-all cursor-pointer"
                >
                  Tamam / Schließen
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Fullscreen Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-black/75 backdrop-blur-md text-white"
          >
            <div className="flex flex-col items-center space-y-6 max-w-md text-center p-8 glass-card border border-white/10 rounded-3xl shadow-2xl">
              <FiLoader className="animate-spin text-5xl text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  {language === 'tr' 
                    ? 'Lütfen Bekleyin...' 
                    : language === 'de' 
                      ? 'Bitte warten...' 
                      : 'Please wait...'}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {language === 'tr' 
                    ? 'İşleminiz gerçekleştiriliyor ve veriler güncelleniyor. Lütfen bu sayfayı kapatmayın.' 
                    : language === 'de' 
                      ? 'Ihre Anfrage wird verarbeitet und die Daten werden aktualisiert. Bitte schließen Sie diese Seite nicht.' 
                      : 'Processing your request and updating the data. Please do not close this page.'}
                </p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
