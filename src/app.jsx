import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

import { PRODUCTOS_INICIALES } from './data/productos';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import TestCasesModal from './components/TestCasesModal';
import ReadmeModal from './components/ReadmeModal';

export default function App() {
  const [cart, setCart] = useState([]);
  const [catalogInputs, setCatalogInputs] = useState({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addToast = ({ message, type = 'warning', onConfirm = null, confirmText = 'Confirmar' }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, onConfirm, confirmText };
    setToasts((prev) => [...prev, newToast]);

    if (!onConfirm) {
      setTimeout(() => removeToast(id), 4000);
    }
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleKeyDown = (e) => {
    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault();
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pasteData) || parseInt(pasteData, 10) <= 0) {
      e.preventDefault();
      addToast({ message: "No se permite letras, decimales ni negativos.", type: "warning" });
    }
  };

  const handleWheel = (e) => e.target.blur();

  const totalUnits = useMemo(() => cart.reduce((sum, item) => sum + item.cantidad, 0), [cart]);
  const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0), [cart]);

  const getCartQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.cantidad : 0;
  };

  const handleCatalogInputChange = (product, val) => {
    if (val === '') {
      setCatalogInputs((prev) => ({ ...prev, [product.id]: '' }));
      return;
    }
    const numVal = parseInt(val, 10);
    const inCartQty = getCartQuantity(product.id);
    const maxAvailable = product.stock - inCartQty;

    if (isNaN(numVal) || numVal <= 0) {
      setCatalogInputs((prev) => ({ ...prev, [product.id]: 1 }));
      addToast({ message: "La cantidad mínima a agregar es 1.", type: "warning" });
      return;
    }

    if (numVal > maxAvailable) {
      setCatalogInputs((prev) => ({ ...prev, [product.id]: maxAvailable > 0 ? maxAvailable : 1 }));
      addToast({ message: "Este es el máximo de producto disponible en stock", type: "warning" });
      return;
    }

    setCatalogInputs((prev) => ({ ...prev, [product.id]: numVal }));
  };

  const handleAddToCart = (product) => {
    const inputQty = parseInt(catalogInputs[product.id], 10) || 1;
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    const currentInCart = existingIndex !== -1 ? cart[existingIndex].cantidad : 0;
    const maxAvailable = product.stock - currentInCart;

    if (maxAvailable <= 0) {
      addToast({ message: "Este es el máximo de producto disponible en stock", type: "warning" });
      return;
    }

    let qtyToAdd = inputQty;
    if (inputQty > maxAvailable) {
      qtyToAdd = maxAvailable;
      addToast({ message: "Este es el máximo de producto disponible en stock", type: "warning" });
    } else {
      addToast({ message: `¡${qtyToAdd} x ${product.nombre} agregado!`, type: "success" });
    }

    if (existingIndex !== -1) {
      setCart((prev) => prev.map((item, idx) => idx === existingIndex ? { ...item, cantidad: item.cantidad + qtyToAdd } : item));
    } else {
      setCart((prev) => [...prev, { ...product, cantidad: qtyToAdd }]);
    }

    setCatalogInputs((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const handleCartIncrement = (item) => {
    if (item.cantidad >= item.stock) {
      addToast({ message: "Este es el máximo de producto disponible en stock", type: "warning" });
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)));
  };

  const handleCartDecrement = (item) => {
    if (item.cantidad <= 1) {
      addToast({
        message: `Esta es la cantidad mínima. ¿Desea eliminar "${item.nombre}"?`,
        type: "confirm",
        confirmText: "Sí, eliminar",
        onConfirm: () => handleRemoveCartItem(item.id)
      });
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad - 1 } : i)));
  };

  const handleCartInputChange = (item, val) => {
    if (val === '') {
      setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: '' } : i)));
      return;
    }
    const numVal = parseInt(val, 10);
    if (isNaN(numVal) || numVal <= 0) {
      setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: 1 } : i)));
      addToast({
        message: `Esta es la cantidad mínima. ¿Desea eliminar "${item.nombre}"?`,
        type: "confirm",
        confirmText: "Sí, eliminar",
        onConfirm: () => handleRemoveCartItem(item.id)
      });
      return;
    }
    if (numVal > item.stock) {
      setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: item.stock } : i)));
      addToast({ message: "Este es el máximo de producto disponible en stock", type: "warning" });
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: numVal } : i)));
  };

  const handleCartInputBlur = (item) => {
    if (item.cantidad === '' || item.cantidad <= 0) {
      setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: 1 } : i)));
    }
  };

  const handleRemoveCartItem = (productId) => {
    const itemToRemove = cart.find((i) => i.id === productId);
    setCart((prev) => prev.filter((i) => i.id !== productId));
    if (itemToRemove) addToast({ message: `Se eliminó "${itemToRemove.nombre}".`, type: "info" });
  };

  const filteredProducts = PRODUCTOS_INICIALES.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const readmeMarkdown = `# TIENDA PALMIRA - Carrito React SENA\nInstructor: Daniel Alfonso Martínez Payán`;

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 font-sans flex flex-col">
      <Navbar
        totalUnits={totalUnits}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTests={() => setIsTestModalOpen(true)}
        onOpenReadme={() => setIsReadmeOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-amber-200/60">
          <h3 className="text-lg font-bold text-slate-800">Catálogo de Productos Típicos</h3>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentInCart={getCartQuantity(product.id)}
              inputVal={catalogInputs[product.id] !== undefined ? catalogInputs[product.id] : 1}
              onInputChange={handleCatalogInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onWheel={handleWheel}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        totalUnits={totalUnits}
        totalAmount={totalAmount}
        onRemoveItem={handleRemoveCartItem}
        onDecrement={handleCartDecrement}
        onIncrement={handleCartIncrement}
        onInputChange={handleCartInputChange}
        onInputBlur={handleCartInputBlur}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onWheel={handleWheel}
        onCheckout={() => {
          addToast({ message: "¡Pedido procesado con éxito!", type: "success" });
          setCart([]);
          setIsCartOpen(false);
        }}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <TestCasesModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} onRunTest={() => {}} />
      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
        readmeMarkdown={readmeMarkdown}
        copied={copied}
        onCopy={() => {
          navigator.clipboard.writeText(readmeMarkdown);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      />
    </div>
  );
}
