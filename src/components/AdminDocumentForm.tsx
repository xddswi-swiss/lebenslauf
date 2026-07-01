"use client";

import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, 
  FiPlus, 
  FiCheck, 
  FiAlertCircle, 
  FiLoader,
  FiX,
  FiTrash2
} from 'react-icons/fi';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface FileData {
  name: string;
  base64: string;
}

export const AdminDocumentForm: React.FC = () => {
  const { language } = useLanguage();

  // Form fields state
  const [deTerm, setDeTerm] = useState('');
  const [trTerm, setTrTerm] = useState('');
  const [enTerm, setEnTerm] = useState('');
  const [date, setDate] = useState('');
  const [pdfFile, setPdfFile] = useState<FileData | null>(null);

  // Submission states
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // List of existing documents for deletion in admin
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setExistingDocuments(data.de || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (term: string) => {
    const confirmMsg = language === 'tr'
      ? `"${term}" belgesini silmek istediğinize emin misiniz?`
      : `Sind Sie sicher, dass Sie das Dokument "${term}" löschen möchten?`;
    if (!window.confirm(confirmMsg)) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const passcode = localStorage.getItem('admin_passcode') || 'eren2026';
      const res = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, term })
      });

      if (res.ok) {
        setSuccessMsg(language === 'tr' ? 'Başarıyla silindi!' : 'Erfolgreich gelöscht!');
        fetchDocuments();
        // Trigger event to refresh homepage
        window.dispatchEvent(new Event('documents-updated'));
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
    fetchDocuments();
  }, []);

  // Read-only serverless fallback states
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [fallbackJson, setFallbackJson] = useState('');
  const [copied, setCopied] = useState(false);

  const labels = {
    de: {
      title: "Neues Bewerbungsdokument hinzufügen",
      lblDeTitle: "Titel (Deutsch) *",
      lblTrTitle: "Titel (Türkisch) - Optional",
      lblEnTitle: "Titel (Englisch) - Optional",
      lblDate: "Jahr / Datum (z.B. 2026) *",
      lblPdf: "PDF-Dokument hochladen *",
      btnSubmit: "Dokument hinzufügen",
      success: "Dokument erfolgreich hinzugefügt! 🎉",
      fallbackTitle: "Server Schreibgeschützt",
      fallbackDesc: "Dieses Projekt läuft auf einem schreibgeschützten Server (z.B. Vercel). Die Daten konnten nicht direkt gespeichert werden. Bitte kopieren Sie den folgenden JSON-Code und ersetzen Sie damit den Inhalt der Datei \"src/data/documents.json\" in Ihrem Projekt.",
      btnCopy: "Code kopieren",
      btnCopied: "Kopiert!",
    },
    tr: {
      title: "Yeni Başvuru Belgesi Ekle",
      lblDeTitle: "Başlık (Almanca) *",
      lblTrTitle: "Başlık (Türkçe) - İsteğe Bağlı",
      lblEnTitle: "Başlık (İngilizce) - İsteğe Bağlı",
      lblDate: "Yıl / Tarih (Örn: 2026) *",
      lblPdf: "PDF Belgesi Yükle *",
      btnSubmit: "Belgeyi Ekle",
      success: "Belge başarıyla eklendi! 🎉",
      fallbackTitle: "Salt Okunur Sunucu Uyarısı",
      fallbackDesc: "Proje şu an salt okunur bir sunucuda (Vercel gibi) barındırılmaktadır. Bu sebeple veriler doğrudan kaydedilemedi. Lütfen aşağıdaki JSON kodunu kopyalayın ve projenizin içindeki \"src/data/documents.json\" dosyasının içeriği ile tamamen değiştirin.",
      btnCopy: "Kodu Kopyala",
      btnCopied: "Kopyalandı!",
    },
    en: {
      title: "Add New Application Document",
      lblDeTitle: "Title (German) *",
      lblTrTitle: "Title (Turkish) - Optional",
      lblEnTitle: "Title (English) - Optional",
      lblDate: "Year / Date (e.g., 2026) *",
      lblPdf: "Upload PDF Document *",
      btnSubmit: "Add Document",
      success: "Document successfully added! 🎉",
      fallbackTitle: "Server Read-Only",
      fallbackDesc: "This project is running on a read-only host (e.g. Vercel). The files could not be updated directly. Please copy the JSON below and replace the content of your \"src/data/documents.json\" file with it.",
      btnCopy: "Copy Code",
      btnCopied: "Copied!",
    }
  };

  const t = labels[language as 'de' | 'tr' | 'en'] || labels.de;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg(language === 'tr' ? 'Lütfen sadece PDF dosyası yükleyin!' : 'Bitte laden Sie nur PDF-Dateien hoch!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPdfFile({
        name: file.name,
        base64: reader.result as string
      });
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleAutoTranslate = async (sourceLang: 'de' | 'tr' | 'en') => {
    let textToTranslate = '';
    if (sourceLang === 'de') textToTranslate = deTerm;
    else if (sourceLang === 'tr') textToTranslate = trTerm;
    else if (sourceLang === 'en') textToTranslate = enTerm;

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
          if (lang === 'de') setDeTerm(translated);
          else if (lang === 'tr') setTrTerm(translated);
          else if (lang === 'en') setEnTerm(translated);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fallbackTitle = deTerm.trim() || trTerm.trim() || enTerm.trim();

    if (!fallbackTitle || !date || !pdfFile) {
      setErrorMsg(language === 'tr' ? 'Lütfen en az bir Başlık, Tarih ve PDF dosyası girin!' : 'Bitte geben Sie mindestens einen Titel, ein Datum und eine PDF-Datei an!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

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

    // Determine source language
    let srcLang = 'de';
    if (deTerm.trim()) {
      srcLang = 'de';
    } else if (trTerm.trim()) {
      srcLang = 'tr';
    } else if (enTerm.trim()) {
      srcLang = 'en';
    }

    const srcTitle = deTerm.trim() || trTerm.trim() || enTerm.trim();

    try {
      const [finalDeTerm, finalTrTerm, finalEnTerm] = await Promise.all([
        deTerm.trim() ? Promise.resolve(deTerm.trim()) : translateText(srcTitle, srcLang, 'de'),
        trTerm.trim() ? Promise.resolve(trTerm.trim()) : translateText(srcTitle, srcLang, 'tr'),
        enTerm.trim() ? Promise.resolve(enTerm.trim()) : translateText(srcTitle, srcLang, 'en')
      ]);

      const passcode = localStorage.getItem('admin_passcode') || 'eren2026';

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passcode,
          deTerm: finalDeTerm,
          trTerm: finalTrTerm,
          enTerm: finalEnTerm,
          date,
          pdfFile
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setSuccessMsg(language === 'tr' ? 'Belge başarıyla eklendi! 🎉' : 'Dokument erfolgreich hinzugefügt! 🎉');
          window.dispatchEvent(new Event('documents-updated'));
          // Reset form
          setDeTerm('');
          setTrTerm('');
          setEnTerm('');
          setDate('');
          setPdfFile(null);
          // Reset file input element
          const fileInput = document.getElementById('document-pdf-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          fetchDocuments();
        } else {
          // If read-only mode locally or fails local writes, generate fallback JSON
          if (data.errors && data.errors.some((err: string) => err.includes('local save failed'))) {
            // Fetch updated data to generate local JSON code
            const currentRes = await fetch('/api/documents');
            const currentDocs = await currentRes.json();

            // Append new item mock
            const trTitle = trTerm.trim() || deTerm.trim();
            const enTitle = enTerm.trim() || deTerm.trim();
            const mockPath = `/assets/pdfs/${deTerm.toLowerCase().replace(/\s+/g, '-')}.pdf`;

            currentDocs.de.push({ term: deTerm, date, file: mockPath });
            currentDocs.tr.push({ term: trTitle, date, file: mockPath });
            currentDocs.en.push({ term: enTitle, date, file: mockPath });

            setFallbackJson(JSON.stringify(currentDocs, null, 2));
            setShowFallbackModal(true);
          } else {
            setErrorMsg(data.error || 'Server error occurred.');
          }
        }
      } else {
        setErrorMsg(data.error || 'Failed to submit document.');
      }
    } catch (err: any) {
      console.error('Document submission error:', err);
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyFallbackJson = () => {
    navigator.clipboard.writeText(fallbackJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--glass-border)] pb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {t.title}
        </h3>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <FiCheck className="text-lg flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-2">
          <FiAlertCircle className="text-lg flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblDeTitle}</label>
              {deTerm.trim() && (
                <button
                  type="button"
                  onClick={() => handleAutoTranslate('de')}
                  className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                </button>
              )}
            </div>
            <input
              type="text"
              value={deTerm}
              onChange={(e) => setDeTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblTrTitle}</label>
              {trTerm.trim() && (
                <button
                  type="button"
                  onClick={() => handleAutoTranslate('tr')}
                  className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                </button>
              )}
            </div>
            <input
              type="text"
              value={trTerm}
              onChange={(e) => setTrTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblEnTitle}</label>
              {enTerm.trim() && (
                <button
                  type="button"
                  onClick={() => handleAutoTranslate('en')}
                  className="text-[10px] font-black text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  {language === 'tr' ? 'DİĞER DİLLERE ÇEVİR' : language === 'de' ? 'Übersetzen' : 'Translate'}
                </button>
              )}
            </div>
            <input
              type="text"
              value={enTerm}
              onChange={(e) => setEnTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblDate}</label>
            <input
              type="text"
              required
              placeholder="z.B. 2026"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
            />
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl border border-dashed border-neutral-400 dark:border-zinc-700 bg-white/5 hover:bg-zinc-800/5 transition-all">
            <label className="text-xs font-bold text-[var(--text-body)] flex items-center gap-2 cursor-pointer">
              <FiFileText className="text-base text-primary" />
              <span>{t.lblPdf}</span>
            </label>
            <input
              id="document-pdf-upload"
              type="file"
              accept=".pdf"
              required
              onChange={handleFileChange}
              className="block w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer pt-2"
            />
            {pdfFile && (
              <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1 mt-1">
                ✓ {pdfFile.name} (Ready)
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-primary hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-primary/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <FiLoader className="animate-spin text-lg" />
          ) : (
            <FiPlus className="text-lg" />
          )}
          {t.btnSubmit}
        </button>

        {/* Existing Documents List for Deletion */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] space-y-4">
          <h4 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <span className="w-1.5 h-5 bg-primary rounded-full" />
            {language === 'tr' ? 'Mevcut Belgeleri Yönet' : language === 'de' ? 'Bewerbungsunterlagen verwalten' : 'Manage Existing Documents'}
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            {language === 'tr' 
              ? 'Listeden silmek istediğiniz karne veya sertifika kaydını çöp kutusu simgesine tıklayarak kaldırabilirsiniz.' 
              : 'Klicken Sie auf das Papierkorb-Symbol, um ein Dokument zu löschen.'}
          </p>
          
          <div className="space-y-3 pt-2">
            {existingDocuments.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--background)]/5 flex items-center justify-between gap-4 hover:bg-[var(--glass-border)]/10 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-bold text-[var(--text-main)]">{item.term}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{item.date}</span>
                    <a 
                      href={item.file} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      PDF
                    </a>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleDeleteDocument(item.term)}
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

      {/* Fallback Modal */}
      {showFallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl shadow-2xl relative flex flex-col space-y-4 max-h-[85vh] overflow-hidden bg-[var(--background)] border border-[var(--glass-border)]">
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
                onClick={copyFallbackJson}
                className="flex-1 py-3.5 rounded-xl bg-primary hover:opacity-90 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FiCheck className={`text-base transition-transform ${copied ? 'scale-100' : 'scale-0 w-0'}`} />
                {copied ? t.btnCopied : t.btnCopy}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
