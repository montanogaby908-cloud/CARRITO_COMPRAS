import React from 'react';
import { FileText, X, Copy, Check } from 'lucide-react';

export default function ReadmeModal({ isOpen, onClose, readmeMarkdown, copied, onCopy }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Documentación README.md para SENA</h3>
              <p className="text-xs text-slate-500">Copia este archivo para entregarlo en tu repositorio público</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative">
          <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed border border-slate-800">
            {readmeMarkdown}
          </pre>
          <button
            onClick={onCopy}
            className="absolute top-3 right-3 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡Copiado!' : 'Copiar Markdown'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center text-xs text-slate-500">
          <span>Nombre del repo: <strong>Apellido_Nombre_Carrito_React</strong></span>
          <button onClick={onClose} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
