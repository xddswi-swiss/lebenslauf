"use client";

import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, 
  FiPlus, 
  FiCheck, 
  FiAlertCircle, 
  FiLoader,
  FiX
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
      success: "Dokument erfolgreich hinzugefügt! Die Website wird in Kürze (Vercel Build im Hintergrund) aktualisiert.",
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
      success: "Belge başarıyla eklendi! Web sitesi kısa süre içinde (Vercel arka plan derlemesi ile) güncellenecektir.",
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
      success: "Document successfully added! The changes will be visible soon (Vercel builds in the background).",
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

    const finalDeTerm = deTerm.trim() || fallbackTitle;
    const finalTrTerm = trTerm.trim() || fallbackTitle;
    const finalEnTerm = enTerm.trim() || fallbackTitle;

    const passcode = localStorage.getItem('admin_passcode') || 'eren2026';

    try {
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
          setSuccessMsg(t.success);
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
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblDeTitle}</label>
            <input
              type="text"
              required
              value={deTerm}
              onChange={(e) => setDeTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblTrTitle}</label>
            <input
              type="text"
              value={trTerm}
              onChange={(e) => setTrTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:border-primary focus:outline-none text-[var(--text-main)] text-sm transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.lblEnTitle}</label>
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
