import { useState, useEffect, useCallback } from 'react';
import { ShieldX } from 'lucide-react';

/**
 * Global toast that listens for 'api-forbidden' events (403 responses)
 * and displays a styled notification.
 */
export default function ForbiddenToast() {
  const [toast, setToast] = useState(null);

  const handleForbidden = useCallback((e) => {
    const message = e.detail?.message || 'Bạn không có quyền thao tác này';
    setToast(message);
    // Auto-dismiss after 2 seconds
    setTimeout(() => setToast(null), 2000);
  }, []);

  useEffect(() => {
    window.addEventListener('api-forbidden', handleForbidden);
    return () => window.removeEventListener('api-forbidden', handleForbidden);
  }, [handleForbidden]);

  if (!toast) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-50 border border-red-200 shadow-lg shadow-red-100/50 max-w-sm">
        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
          <ShieldX size={18} className="text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800">Không có quyền</p>
          <p className="text-xs text-red-600 mt-0.5 truncate">{toast}</p>
        </div>
        <button onClick={() => setToast(null)} className="text-red-400 hover:text-red-600 shrink-0 ml-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
