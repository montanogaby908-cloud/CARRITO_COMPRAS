import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onRemoveToast }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transform transition-all duration-300 ${
            toast.type === 'warning'
              ? 'bg-amber-900 text-amber-50 border-amber-700'
              : toast.type === 'confirm'
              ? 'bg-slate-900 text-white border-slate-700'
              : toast.type === 'success'
              ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
              : 'bg-slate-800 text-white border-slate-700'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'confirm' && <ShieldAlert className="w-5 h-5 text-amber-400" />}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
          </div>

          <div className="flex-grow text-xs leading-relaxed font-medium">
            <p>{toast.message}</p>

            {toast.onConfirm && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    toast.onConfirm();
                    onRemoveToast(toast.id);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-sm transition"
                >
                  {toast.confirmText || 'Confirmar'}
                </button>
                <button onClick={() => onRemoveToast(toast.id)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs transition">
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <button onClick={() => onRemoveToast(toast.id)} className="text-slate-400 hover:text-white p-1 rounded-md transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
