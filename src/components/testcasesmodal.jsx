import React from 'react';
import { Sparkles, X } from 'lucide-react';

export default function TestCasesModal({ isOpen, onClose, onRunTest }) {
  if (!isOpen) return null;

  const tests = [
    { id: 1, title: "1. Teclas e, E, +, -, ., ,", desc: "Verificar bloqueo de teclado" },
    { id: 2, title: "2. Pegado de '-5' o '3e2'", desc: "Verificar bloqueo de pegado" },
    { id: 3, title: "3. Escribir 0 en catálogo", desc: "No lo acepta y muestra toast de mínimo 1" },
    { id: 4, title: "4. Escribir 0 en carrito", desc: "Toast de mínimo con opción de eliminar" },
    { id: 5, title: "5. Escribir 999 (Stock 8)", desc: "Se corrige a 8 y toast de máximo stock" },
    { id: 6, title: "6. Panela (Stock 3): +2 y +2", desc: "Queda en 3 con toast de máximo" },
    { id: 7, title: "7. En carrito, + en stock máx", desc: "Toast de máximo disponible" },
    { id: 8, title: "8. En carrito, - con cant 1", desc: "Toast de mínimo y opción eliminar" },
    { id: 9, title: "9. Agregar repetido", desc: "Suma cantidad en una sola línea" },
    { id: 10, title: "10. Café x2, Panela x3, Arepa x1", desc: "Carga combo y calcula $98.400 COP" },
    { id: 11, title: "11. Agotar stock de Chocolate", desc: "Botón Agregar se inhabilita" },
    { id: 12, title: "12. Contador en Navbar", desc: "Suma todas las unidades en badge" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">Casos de Prueba Automáticos</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {tests.map((test) => (
            <button
              key={test.id}
              onClick={() => onRunTest(test.id)}
              className="text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition flex flex-col"
            >
              <span className="font-bold text-xs text-slate-800">{test.title}</span>
              <span className="text-[11px] text-slate-500 mt-1">{test.desc}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}