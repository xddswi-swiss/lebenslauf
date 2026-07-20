"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import {
  FiTrash2,
  FiLoader,
  FiMessageSquare,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export const AdminGuestbookTab: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const translations = {
    de: {
      title: "Gästebuch-Beiträge verwalten",
      subtitle: "Löschen Sie unerwünschte Kommentare direkt aus der Datenbank.",
      colName: "Name",
      colMessage: "Nachricht",
      colDate: "Datum",
      colActions: "Aktionen",
      confirmDelete:
        "Sind Sie sicher, dass Sie diese Nachricht löschen möchten?",
      empty: "Keine Beiträge im Gästebuch vorhanden.",
      deleteSuccess: "Nachricht gelöscht!",
    },
    tr: {
      title: "Ziyaretçi Defteri Yönetimi",
      subtitle: "İstenmeyen yorumları doğrudan veritabanından silebilirsiniz.",
      colName: "Adı",
      colMessage: "Mesajı",
      colDate: "Tarih",
      colActions: "İşlemler",
      confirmDelete: "Bu mesajı tamamen silmek istediğinize emin misiniz?",
      empty: "Ziyaretçi defterinde henüz mesaj yok.",
      deleteSuccess: "Mesaj başarıyla silindi!",
    },
    en: {
      title: "Manage Guestbook Entries",
      subtitle: "Delete unwanted comments directly from the database.",
      colName: "Name",
      colMessage: "Message",
      colDate: "Date",
      colActions: "Actions",
      confirmDelete: "Are you sure you want to delete this message?",
      empty: "No guestbook entries found.",
      deleteSuccess: "Message deleted!",
    },
  };

  const t = translations[language as "de" | "tr" | "en"] || translations.de;

  const fetchAllMessages = async () => {
    try {
      setIsLoading(true);
      const passcode = localStorage.getItem("admin_passcode") || "eren2026";
      const res = await fetch(`/api/guestbook?passcode=${passcode}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Error fetching guestbook:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.confirmDelete)) return;

    setDeletingId(id);
    const passcode = localStorage.getItem("admin_passcode") || "eren2026";

    try {
      const res = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, id }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        // Trigger event to sync any open pages
        window.dispatchEvent(new Event("guestbook-updated"));
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete message.");
      }
    } catch (err: any) {
      alert(err.message || "Error occurred.");
    } finally {
      setDeletingId(null);
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

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--glass-border)] pb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {t.title}
        </h3>
      </div>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        {t.subtitle}
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : messages.length === 0 ? (
        <div className="p-8 text-center text-sm text-[var(--text-muted)] border border-dashed border-neutral-400 dark:border-zinc-700 bg-white/5 rounded-2xl">
          {t.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 glass-card rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <FiUser className="text-primary" />
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                    <FiCalendar />
                    {formatDate(msg.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-body)] leading-relaxed whitespace-pre-line pl-5">
                  {msg.message}
                </p>
              </div>

              <div className="flex-shrink-0 flex items-center justify-end pl-5 md:pl-0">
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={deletingId === msg.id}
                  className="p-2.5 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === msg.id ? (
                    <FiLoader className="animate-spin text-base" />
                  ) : (
                    <FiTrash2 className="text-base" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
