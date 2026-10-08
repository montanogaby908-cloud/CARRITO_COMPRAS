import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatCOP } from '../utils/formatters';

export default function ProductCard({
  product,
  currentInCart,
  inputVal,
  onInputChange,
  onKeyDown,
  onPaste,
  onWheel,
  onAddToCart
}) {
  const availableStock = product.stock - currentInCart;
  const isOutOfStock = availableStock <= 0;

  return (
    <div
      className={`bg-white rounded-3xl shadow-md border transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden relative ${
        isOutOfStock ? 'border-slate-300 bg-slate-50/80 opacity-90' : 'border-amber-200/80 hover:border-emerald-500'
      }`}
    >
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${
            isOutOfStock
              ? 'bg-red-100 text-red-700 border-red-300'
              : availableStock <= 3
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}
        >
          {isOutOfStock ? 'Sin Unidades Disponibles' : `Stock: ${availableStock} de ${product.stock}`}
        </span>
      </div>

      <div className="p-6">
        <div className="w-20 h-20 bg-amber-100/60 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-inner">
          {product.imagen}
        </div>
        <h4 className="text-xl font-bold text-slate-800 mb-1 leading-snug">{product.nombre}</h4>
        <p className="text-xs text-slate-500 mb-3">ID Producto: #{product.id}</p>
        <p className="text-2xl font-black text-emerald-700">{formatCOP(product.precio)}</p>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-semibold text-slate-600">Cantidad:</label>
          <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-emerald-600">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={inputVal}
              disabled={isOutOfStock}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onWheel={onWheel}
              onChange={(e) => onInputChange(product, e.target.value)}
              className="w-20 px-3 py-2 text-center text-slate-800 font-bold focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-3 px-4 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-98'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
}
