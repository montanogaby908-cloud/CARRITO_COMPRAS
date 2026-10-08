import React from 'react';
import { Store, Sparkles, FileText, ShoppingCart } from 'lucide-react';

export default function Navbar({ totalUnits, onOpenCart, onOpenTests, onOpenReadme }) {
  return (
    <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-lg border-b border-emerald-800 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2.5 rounded-2xl shadow-md text-emerald-950 font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">TIENDA PALMIRA</h1>
              <span className="bg-emerald-800 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-700">SENA CBI</span>
            </div>
            <p className="text-xs text-emerald-200 hidden sm:block">Productos típicos del Valle • Carrito Validado</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenTests}
            className="px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-100 bg-emerald-800/80 hover:bg-emerald-700/90 rounded-xl transition flex items-center gap-1.5 border border-emerald-700"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Casos de Prueba</span>
          </button>

          <button
            onClick={onOpenReadme}
            className="px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-100 bg-emerald-800/80 hover:bg-emerald-700/90 rounded-xl transition flex items-center gap-1.5 border border-emerald-700"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span className="hidden md:inline">README SENA</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-3 text-white bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-2xl font-bold shadow-lg transition active:scale-95 flex items-center justify-center"
          >
            <ShoppingCart className="w-6 h-6 text-emerald-950" />
            {totalUnits > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white font-extrabold text-xs min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center shadow-md border-2 border-emerald-900 animate-bounce">
                {totalUnits}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
