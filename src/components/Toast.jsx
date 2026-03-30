import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon: <CheckCircle size={18} className="text-green-500 shrink-0" /> },
    error:   { bg: 'bg-red-50 border-red-200',     text: 'text-red-800',   icon: <XCircle size={18} className="text-red-500 shrink-0" /> },
    warning: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', icon: <AlertCircle size={18} className="text-yellow-500 shrink-0" /> },
  };
  const s = styles[type] || styles.success;

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl ${s.bg} animate-in slide-in-from-top-4 duration-300`}
      style={{ minWidth: 280, maxWidth: 420 }}>
      {s.icon}
      <p className={`text-sm font-medium flex-1 ${s.text}`}>{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-1"><X size={16} /></button>
    </div>
  );
}
