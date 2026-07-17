"use client";

import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

interface DownloadButtonProps {
  fileUrl: string;
  fileName: string;
  downloadLabel: string;
  completeLabel: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  fileUrl,
  fileName,
  downloadLabel,
  completeLabel
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleDownload = () => {
    if (status !== 'idle') return;

    setStatus('loading');

    // Trigger file download immediately
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Run fill animation (1600ms)
    setTimeout(() => {
      setStatus('done');

      // Stay in done state (2500ms) then reset
      setTimeout(() => {
        setStatus('idle');
      }, 2500);
    }, 1600);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`cb-btn ${status === 'loading' ? 'is-loading' : ''} ${status === 'done' ? 'is-done' : ''}`}
    >
      <span className="cb-fill" aria-hidden="true"></span>
      <span className="cb-label">
        <FiDownload className="cb-arrow" aria-hidden="true" />
        <span>{downloadLabel}</span>
      </span>
      <span className="cb-done">✓&nbsp;{completeLabel}</span>
    </button>
  );
};
