import React from 'react';
import { ShoppingBag, X, ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { formatCOP } from '../utils/formatters';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  totalUnits,
  totalAmount,
  onRemoveItem,
  onDecrement,
  onIncrement,
  onInputChange,
  onInputBlur,
  onKeyDown,
  onPaste,
  onWheel,
  onCheckout
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <div className="p-6 bg-emerald-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-emerald-950 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Tu Carrito</h3>
                <p className="text-xs text-emerald-200">
                  {totalUnits} {totalUnits === 1 ? 'unidad seleccionada' : 'unidades seleccionadas'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-xl transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 flex-grow overflow-y-auto space-y-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">El carrito está vacío</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">Agrega productos típicos desde el catálogo para comenzar tu pedido.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-100/70 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm">
                    {item.imagen}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-slate-800 text-sm leading-tight">{item.nombre}</h5>
                      <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-600 transition p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">Precio unitario: {formatCOP(item.precio)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
                        <button onClick={() => onDecrement(item)} className="px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-200 transition">
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.cantidad}
                          onKeyDown={onKeyDown}
                          onPaste={onPaste}
                          onWheel={onWheel}
                          onChange={(e) => onInputChange(item, e.target.value)}
                          onBlur={() => onInputBlur(item)}
                          className="w-12 text-center text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                        />

                        <button onClick={() => onIncrement(item)} className="px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-200 transition">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Subtotal</span>
                        <span className="text-sm font-black text-emerald-700">{formatCOP(item.precio * item.cantidad)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total Unidades:</span>
                <span className="font-bold text-slate-800">{totalUnits}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío a domicilio:</span>
                <span className="text-emerald-600 font-semibold">GRATIS</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">TOTAL A PAGAR:</span>
                <span className="text-2xl font-black text-emerald-800">{formatCOP(totalAmount)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={onCheckout}
              className={`w-full py-3.5 rounded-2xl font-bold shadow-lg transition text-center ${
                cart.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-amber-500 hover:bg-amber-400 text-emerald-950'
              }`}
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
