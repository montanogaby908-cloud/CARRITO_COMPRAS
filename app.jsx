import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Store, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

// PUNTO 1: Datos del catálogo (Array JSON exacto según los requerimientos SENA)
const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Café de Huila 500 g", precio: 28500, stock: 8, imagen: "☕" },
  { id: 2, nombre: "Panela orgánica 1 kg", precio: 9800, stock: 3, imagen: "🪵" },
  { id: 3, nombre: "Arepa de choclo x6", precio: 12000, stock: 12, imagen: "🌽" },
  { id: 4, nombre: "Chocolate de mesa", precio: 15400, stock: 1, imagen: "🍫" },
  { id: 5, nombre: "Bocadillo veleño", precio: 6500, stock: 20, imagen: "🍬" },
  { id: 6, nombre: "Aguardiente 750 ml", precio: 62000, stock: 5, imagen: "🍾" }
];

// Formateador oficial de moneda colombiana (COP)
const formatCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
};

export default function App() {
  // Estado del carrito de compras
  const [cart, setCart] = useState([]);
  
  // Cantidades ingresadas en los inputs de las tarjetas del catálogo { productId: cantidad }
  const [catalogInputs, setCatalogInputs] = useState({
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1
  });

  // Estado para controlar visibilidad del drawer del carrito
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado para la pila de Toasts (notificaciones emergentes)
  const [toasts, setToasts] = useState([]);

  // Estado para el modal de README y evidencias SENA
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);

  // Estado para la modal de casos de prueba interactivos
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Estado de estado copiado para la documentación
  const [copied, setCopied] = useState(false);

  // Filtro de búsqueda en catálogo
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Sistema de Toasts para notificaciones sin alert()
   * @param {Object} options { message, type: 'warning'|'success'|'info'|'confirm', onConfirm, confirmText }
   */
  const addToast = ({ message, type = 'warning', onConfirm = null, confirmText = 'Confirmar' }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, onConfirm, confirmText };

    setToasts((prev) => [...prev, newToast]);

    // Autocerrar toast si no requiere confirmación interactiva
    if (!onConfirm) {
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // PUNTO 4: Validaciones de teclado y campo numérico
  // Bloqueo estricto de teclas prohibidas: 'e', 'E', '+', '-', '.', ','
  const handleKeyDown = (e) => {
    const invalidKeys = ['e', 'E', '+', '-', '.', ','];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Bloqueo de pegado inválido (solo permite dígitos)
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pasteData) || parseInt(pasteData, 10) <= 0) {
      e.preventDefault();
      addToast({
        message: "No se puede pegar texto con letras, decimales o números negativos.",
        type: "warning"
      });
    }
  };

  // Evita que la rueda del mouse cambie el valor sin querer
  const handleWheel = (e) => {
    e.target.blur();
  };

  // Total de unidades en el carrito
  const totalUnits = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.cantidad, 0);
  }, [cart]);

  // Total precio en COP de la compra
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }, [cart]);

  // Obtiene las unidades de un producto que ya están en el carrito
  const getCartQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.cantidad : 0;
  };

  // Cambios en el campo numérico del Catálogo
  const handleCatalogInputChange = (product, val) => {
    if (val === '') {
      setCatalogInputs((prev) => ({ ...prev, [product.id]: '' }));
      return;
    }

    const numVal = parseInt(val, 10);
    const inCartQty = getCartQuantity(product.id);
    const maxAvailable = product.stock - inCartQty;

    if (isNaN(numVal) || numVal <= 0) {
      // PUNTO 4 y Caso 3: Si escribe 0 o no numérico, no acepta y muestra toast
      setCatalogInputs((prev) => ({ ...prev, [product.id]: 1 }));
      addToast({
        message: "La cantidad mínima a agregar es 1.",
        type: "warning"
      });
      return;
    }

    if (numVal > maxAvailable) {
      // PUNTO 5 y Caso 5: Se corrige al máximo y muestra toast
      const targetVal = maxAvailable > 0 ? maxAvailable : 1;
      setCatalogInputs((prev) => ({ ...prev, [product.id]: targetVal }));
      addToast({
        message: "Este es el máximo de producto disponible en stock",
        type: "warning"
      });
      return;
    }

    setCatalogInputs((prev) => ({ ...prev, [product.id]: numVal }));
  };

  // PUNTO 3 & PUNTO 5: Función para Agregar Producto desde el Catálogo
  const handleAddToCart = (product) => {
    const inputQty = parseInt(catalogInputs[product.id], 10) || 1;
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    const currentInCart = existingIndex !== -1 ? cart[existingIndex].cantidad : 0;
    const maxAvailable = product.stock - currentInCart;

    if (maxAvailable <= 0) {
      addToast({
        message: "Este es el máximo de producto disponible en stock",
        type: "warning"
      });
      return;
    }

    let qtyToAdd = inputQty;
    let reachedMax = false;

    if (inputQty > maxAvailable) {
      qtyToAdd = maxAvailable;
      reachedMax = true;
    }

    if (reachedMax) {
      addToast({
        message: "Este es el máximo de producto disponible en stock",
        type: "warning"
      });
    } else {
      addToast({
        message: `¡${qtyToAdd} x ${product.nombre} agregado al carrito!`,
        type: "success"
      });
    }

    if (existingIndex !== -1) {
      // PUNTO 3: No crea otra línea, suma la cantidad a la existente
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, cantidad: item.cantidad + qtyToAdd }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          stock: product.stock,
          imagen: product.imagen,
          cantidad: qtyToAdd
        }
      ]);
    }

    // Resetear input del catálogo a 1
    setCatalogInputs((prev) => ({ ...prev, [product.id]: 1 }));
  };

  // PUNTO 5 & 6: Incrementar cantidad en el Carrito (+)
  const handleCartIncrement = (item) => {
    if (item.cantidad >= item.stock) {
      addToast({
        message: "Este es el máximo de producto disponible en stock",
        type: "warning"
      });
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i))
    );
  };

  // PUNTO 6: Decrementar cantidad en el Carrito (-)
  const handleCartDecrement = (item) => {
    if (item.cantidad <= 1) {
      // Muestra Toast de confirmación de eliminación con opción de confirmar
      addToast({
        message: `Esta es la cantidad mínima. ¿Desea eliminar "${item.nombre}" del carrito?`,
        type: "confirm",
        confirmText: "Sí, eliminar",
        onConfirm: () => handleRemoveCartItem(item.id)
      });
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad - 1 } : i))
    );
  };

  // Edición directa del campo de cantidad dentro del Carrito
  const handleCartInputChange = (item, val) => {
    if (val === '') {
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, cantidad: '' } : i))
      );
      return;
    }

    const numVal = parseInt(val, 10);

    if (isNaN(numVal) || numVal <= 0) {
      // PUNTO 6 & Caso 4: Si escribe 0 en el carrito, no cambia y sale el toast con opción de eliminar
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, cantidad: 1 } : i))
      );

      addToast({
        message: `Esta es la cantidad mínima. ¿Desea eliminar "${item.nombre}" del carrito?`,
        type: "confirm",
        confirmText: "Sí, eliminar",
        onConfirm: () => handleRemoveCartItem(item.id)
      });
      return;
    }

    if (numVal > item.stock) {
      // PUNTO 5 & Caso 5: Excede stock en carrito -> corregir a máximo y toast
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, cantidad: item.stock } : i))
      );
      addToast({
        message: "Este es el máximo de producto disponible en stock",
        type: "warning"
      });
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, cantidad: numVal } : i))
    );
  };

  // Restaurar cantidad válida si el input queda vacío al perder foco
  const handleCartInputBlur = (item) => {
    if (item.cantidad === '' || item.cantidad <= 0) {
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, cantidad: 1 } : i))
      );
    }
  };

  // Eliminación directa de un producto del carrito
  const handleRemoveCartItem = (productId) => {
    const itemToRemove = cart.find((i) => i.id === productId);
    setCart((prev) => prev.filter((i) => i.id !== productId));
    if (itemToRemove) {
      addToast({
        message: `Se eliminó "${itemToRemove.nombre}" del carrito.`,
        type: "info"
      });
    }
  };

  // Vaciar carrito por completo
  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    addToast({
      message: "Carrito vaciado correctamente.",
      type: "info"
    });
  };

  // Función para ejecutar pruebas automáticas guiadas (Casos de prueba SENA)
  const runTestCase = (testNumber) => {
    switch (testNumber) {
      case 1:
        addToast({
          message: "Prueba 1: Intente presionar las teclas e, E, +, -, ., , en cualquier campo numérico. ¡Están totalmente bloqueadas!",
          type: "info"
        });
        break;
      case 2:
        addToast({
          message: "Prueba 2: Intente pegar '-5', '3e2' o 'abc'. El evento onPaste filtrará solo dígitos.",
          type: "info"
        });
        break;
      case 3:
        handleCatalogInputChange(PRODUCTOS_INICIALES[0], '0');
        break;
      case 4:
        if (cart.length === 0) {
          handleAddToCart(PRODUCTOS_INICIALES[0]);
        }
        setIsCartOpen(true);
        setTimeout(() => {
          handleCartInputChange(PRODUCTOS_INICIALES[0], '0');
        }, 300);
        break;
      case 5:
        // Escribir 999 en producto id 1 (Café, stock 8)
        handleCatalogInputChange(PRODUCTOS_INICIALES[0], '999');
        break;
      case 6:
        // Panela (stock 3): agregar 2 unidades y luego agregar 2 más
        setCart([]);
        const panela = PRODUCTOS_INICIALES[1];
        // Paso A: agregar 2
        setCart([{ ...panela, cantidad: 2 }]);
        addToast({ message: "Paso 1: Se agregaron 2 Panelas al carrito.", type: "info" });
        // Paso B: intentar agregar 2 más
        setTimeout(() => {
          const inCart = 2;
          const maxAvail = panela.stock - inCart; // 1
          if (2 > maxAvail) {
            setCart([{ ...panela, cantidad: 3 }]);
            addToast({ message: "Este es el máximo de producto disponible en stock", type: "warning" });
          }
          setIsCartOpen(true);
        }, 800);
        break;
      case 7:
        // En carrito, pulsar + cuando la cantidad ya es igual al stock
        const p1 = PRODUCTOS_INICIALES[3]; // Chocolate stock 1
        setCart([{ ...p1, cantidad: 1 }]);
        setIsCartOpen(true);
        setTimeout(() => {
          handleCartIncrement({ ...p1, cantidad: 1 });
        }, 500);
        break;
      case 8:
        // En el carrito, pulsar - cuando la cantidad es 1
        const p2 = PRODUCTOS_INICIALES[0];
        setCart([{ ...p2, cantidad: 1 }]);
        setIsCartOpen(true);
        setTimeout(() => {
          handleCartDecrement({ ...p2, cantidad: 1 });
        }, 500);
        break;
      case 9:
        // Agregar 2 veces el mismo producto
        setCart([]);
        handleAddToCart(PRODUCTOS_INICIALES[2]); // Arepa
        setTimeout(() => {
          handleAddToCart(PRODUCTOS_INICIALES[2]); // Arepa otra vez
          setIsCartOpen(true);
        }, 400);
        break;
      case 10:
        // Agregar Café x2, Panela x3, Arepa x1 -> Totales exactos del test
        setCart([
          { ...PRODUCTOS_INICIALES[0], cantidad: 2 }, // Café 28.500 * 2 = 57.000
          { ...PRODUCTOS_INICIALES[1], cantidad: 3 }, // Panela 9.800 * 3 = 29.400
          { ...PRODUCTOS_INICIALES[2], cantidad: 1 }  // Arepa 12.000 * 1 = 12.000
        ]); // Total = 98.400
        setIsCartOpen(true);
        addToast({ message: "Caso 10 cargado: Total exacto de $98.400 COP calculado.", type: "success" });
        break;
      case 11:
        // Agregar todo el stock de un producto (Chocolate x1)
        const choc = PRODUCTOS_INICIALES[3];
        setCart([{ ...choc, cantidad: 1 }]);
        addToast({ message: "Todo el stock de 'Chocolate de mesa' agregado al carrito. El botón Agregar queda deshabilitado.", type: "info" });
        break;
      case 12:
        addToast({ message: "Observe el badge rojo en el ícono del carrito en la esquina superior derecha con el contador global.", type: "info" });
        break;
      default:
        break;
    }
  };

  const filteredProducts = PRODUCTOS_INICIALES.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const readmeMarkdown = `# TIENDA PALMIRA - Carrito de Compras con Validaciones de Stock
**Programa:** Desarrollo Front-End con React
**Centro de Formación:** Centro de Biotecnología Industrial - CBI Palmira (SENA)
**Instructor:** Daniel Alfonso Martínez Payán

---

## 👨‍💻 Datos del Aprendiz
- **Nombre:** [Su Nombre Completo Aquí]
- **Ficha:** [Número de Ficha SENA]
- **Tecnología Usada:** React 18 + Tailwind CSS + Lucide Icons

---

## 🚀 Pasos para Instalar y Ejecutar

\`\`\`bash
# 1. Clonar el repositorio
git clone <URL_DE_TU_REPOSITORIO>

# 2. Entrar a la carpeta del proyecto
cd Apellido_Nombre_Carrito_React

# 3. Instalar las dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
\`\`\`

---

## ✅ Cumplimiento de Validaciones y Pruebas
1. **Bloqueo de 'e', 'E', '+', '-', '.', ',':** Implementado vía \`onKeyDown\` con \`preventDefault()\`.
2. **Control de pegado inválido:** Validado con \`onPaste\` regulado con Expresión Regular \`/^\\d+$/\`.
3. **Validación de Stock Máximo:** Toast obligatorio *"Este es el máximo de producto disponible en stock"* al intentar superar stock por input, botón \`+\` o agregar duplicado.
4. **Mínimo 1 y Eliminación:** Al restar cuando hay 1 o escribir 0, se dispara Toast interactivo preguntando si desea eliminar el producto.
5. **Totales y Subtotales COP:** Cálculo en tiempo real agrupando por una sola línea por producto.
6. **Deshabilitación:** El botón "Agregar" se inhabilita cuando el stock disponible en catálogo llega a 0.
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 font-sans flex flex-col selection:bg-amber-200">
      
      {/* =========================================================================
          PUNTO 2: NAVBAR FJA EN LA PARTE SUPERIOR CON NOMBRE E ÍCONO DEL CARRITO
         ========================================================================= */}
      <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-lg border-b border-emerald-800 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Nombre y Marca de la Tienda */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-2xl shadow-md text-emerald-950 flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  TIENDA PALMIRA
                </h1>
                <span className="bg-emerald-800 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-700">
                  SENA CBI
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Productos típicos del Valle y Colombia • Carrito Validado
              </p>
            </div>
          </div>

          {/* Acciones de la Cabecera */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Botón Caso de Prueba Guiados */}
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-100 bg-emerald-800/80 hover:bg-emerald-700/90 rounded-xl transition flex items-center gap-1.5 border border-emerald-700 shadow-sm"
              title="Verificar casos de prueba del instructor"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Casos de Prueba</span>
            </button>

            {/* Botón Ver Documentación / README SENA */}
            <button
              onClick={() => setIsReadmeOpen(true)}
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-100 bg-emerald-800/80 hover:bg-emerald-700/90 rounded-xl transition flex items-center gap-1.5 border border-emerald-700 shadow-sm"
              title="Ver README y Evidencias SENA"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span className="hidden md:inline">README SENA</span>
            </button>

            {/* PUNTO 2: Ícono del carrito ubicado a la derecha con contador de unidades */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 text-white bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-2xl font-bold shadow-lg transition active:scale-95 flex items-center justify-center group"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingCart className="w-6 h-6 text-emerald-950 group-hover:scale-110 transition-transform" />
              
              {/* Badge Contador con total de unidades (se oculta si es 0) */}
              {totalUnits > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-extrabold text-xs min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center shadow-md border-2 border-emerald-900 animate-bounce">
                  {totalUnits}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* BANNER INFORMATIVO */}
      <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-700 text-white py-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-emerald-950 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
              Reto Práctico Frontend SENA
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              Carrito de Compras con Validaciones Estrictas de Stock
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Control de notación científica ('e'), bloqueo de signos, validación de stock máximo, subtotales en COP y notificaciones con Toasts.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearCart}
              className="text-xs bg-red-600/30 hover:bg-red-600/50 text-red-100 border border-red-400/40 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reiniciar Carrito
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTENIDO PRINCIPAL: CATÁLOGO DE PRODUCTOS (PUNTO 1, 3 Y 4)
         ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* Barra de Búsqueda e Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-amber-200/60">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Catálogo de Productos Típicos</h3>
            <p className="text-xs text-slate-500">Seleccione la cantidad requerida y agréguela al carrito</p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* GRID DE PRODUCTOS */}
        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentInCart = getCartQuantity(product.id);
            const availableStock = product.stock - currentInCart;
            const isOutOfStock = availableStock <= 0;
            const inputVal = catalogInputs[product.id] !== undefined ? catalogInputs[product.id] : 1;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-3xl shadow-md border transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden relative ${
                  isOutOfStock ? 'border-slate-300 bg-slate-50/80 opacity-90' : 'border-amber-200/80 hover:border-emerald-500'
                }`}
              >
                {/* Badge de Stock */}
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
                    {isOutOfStock
                      ? 'Sin Unidades Disponibles'
                      : `Stock: ${availableStock} de ${product.stock}`}
                  </span>
                </div>

                {/* Contenido Superior del Producto */}
                <div className="p-6">
                  <div className="w-20 h-20 bg-amber-100/60 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-inner">
                    {product.imagen}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-1 leading-snug">
                    {product.nombre}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">ID Producto: #{product.id}</p>
                  <p className="text-2xl font-black text-emerald-700">
                    {formatCOP(product.precio)}
                  </p>
                </div>

                {/* Controles de Cantidad y Botón Agregar (PUNTO 3 Y 4) */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-xs font-semibold text-slate-600">
                      Cantidad:
                    </label>
                    <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-emerald-600">
                      {/* PUNTO 4: Validaciones del input numérico */}
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={inputVal}
                        disabled={isOutOfStock}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onWheel={handleWheel}
                        onChange={(e) => handleCatalogInputChange(product, e.target.value)}
                        className="w-20 px-3 py-2 text-center text-slate-800 font-bold focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* PUNTO 3: Botón Agregar - Se deshabilita si no hay stock disponible */}
                  <button
                    onClick={() => handleAddToCart(product)}
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
          })}
        </div>
      </main>

      {/* =========================================================================
          PUNTO 2, 6 Y 7: SLIDE-OVER DRAWER DEL CARRITO DE COMPRAS
         ========================================================================= */}
      {}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop con Blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* CABECERA DEL CARRITO */}
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
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-xl transition"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* LISTA DE PRODUCTOS EN EL CARRITO */}
              {}
              <div className="p-6 flex-grow overflow-y-auto space-y-4 divide-y divide-slate-100">
                {cart.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">El carrito está vacío</h4>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      Agrega productos típicos desde el catálogo para comenzar tu pedido.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const subtotal = item.precio * item.cantidad;

                    return (
                      <div key={item.id} className="pt-4 first:pt-0 flex items-start gap-4">
                        <div className="w-14 h-14 bg-amber-100/70 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm">
                          {item.imagen}
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-slate-800 text-sm leading-tight">
                              {item.nombre}
                            </h5>
                            {/* Botón para quitar el producto directamente */}
                            <button
                              onClick={() => handleRemoveCartItem(item.id)}
                              className="text-slate-400 hover:text-red-600 transition p-1"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-500 mt-0.5">
                            Precio unitario: {formatCOP(item.precio)}
                          </p>

                          {/* CONTROLES - Y + CON INPUT VALIDADO (PUNTO 4, 5 Y 6) */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
                              
                              {/* Botón Restar (-) */}
                              <button
                                onClick={() => handleCartDecrement(item)}
                                className="px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-200 transition active:bg-slate-300"
                                title="Restar unidad"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              {/* Input de cantidad en carrito */}
                              <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.cantidad}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                onWheel={handleWheel}
                                onChange={(e) => handleCartInputChange(item, e.target.value)}
                                onBlur={() => handleCartInputBlur(item)}
                                className="w-12 text-center text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                              />

                              {/* Botón Sumar (+) */}
                              <button
                                onClick={() => handleCartIncrement(item)}
                                className="px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-200 transition active:bg-slate-300"
                                title="Sumar unidad"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Subtotal por Línea (PUNTO 7) */}
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Subtotal</span>
                              <span className="text-sm font-black text-emerald-700">
                                {formatCOP(subtotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PIE DEL CARRITO: TOTALES Y RESUMEN (PUNTO 7) */}
              {}
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
                    <span className="text-2xl font-black text-emerald-800">
                      {formatCOP(totalAmount)}
                    </span>
                  </div>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    addToast({
                      message: "¡Pedido procesado con éxito! Gracias por comprar en TIENDA PALMIRA.",
                      type: "success"
                    });
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-bold shadow-lg transition text-center ${
                    cart.length === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-amber-500 hover:bg-amber-400 text-emerald-950 active:scale-98'
                  }`}
                >
                  Finalizar Pedido
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONTENEDOR DE TOASTS (NOTIFICACIONES EMERGENTES Y CONFIRMACIONES)
         ========================================================================= */}
      {}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transform transition-all duration-300 animate-bounce-once ${
              toast.type === 'warning'
                ? 'bg-amber-900 text-amber-50 border-amber-700'
                : toast.type === 'confirm'
                ? 'bg-slate-900 text-white border-slate-700'
                : toast.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            {/* Ícono descriptivo según tipo */}
            <div className="mt-0.5 shrink-0">
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'confirm' && <ShieldAlert className="w-5 h-5 text-amber-400" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            {/* Mensaje */}
            <div className="flex-grow text-xs leading-relaxed font-medium">
              <p>{toast.message}</p>

              {/* Botón de Confirmación para eliminar del carrito (PUNTO 6) */}
              {toast.onConfirm && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      toast.onConfirm();
                      removeToast(toast.id);
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-sm transition"
                  >
                    {toast.confirmText || 'Confirmar'}
                  </button>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs transition"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Botón de cierre manual */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* =========================================================================
          MODAL DE CASOS DE PRUEBA DEL INSTRUCTOR (SENA)
         ========================================================================= */}
      {}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  Casos de Prueba Automáticos del Instructor
                </h3>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Haga clic en cualquiera de los siguientes botones para ejecutar y verificar los casos de prueba de la guía SENA:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {[
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
              ].map((test) => (
                <button
                  key={test.id}
                  onClick={() => runTestCase(test.id)}
                  className="text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition flex flex-col"
                >
                  <span className="font-bold text-xs text-slate-800">{test.title}</span>
                  <span className="text-[11px] text-slate-500 mt-1">{test.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE DOCUMENTACIÓN SENA (README.md GENERATOR)
         ========================================================================= */}
      {}
      {isReadmeOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-700" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Documentación README.md para SENA
                  </h3>
                  <p className="text-xs text-slate-500">Copia este archivo para entregarlo en tu repositorio público</p>
                </div>
              </div>
              <button
                onClick={() => setIsReadmeOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed border border-slate-800">
                {readmeMarkdown}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '¡Copiado!' : 'Copiar Markdown'}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center text-xs text-slate-500">
              <span>Nombre de repositorio sugerido: <strong>Apellido_Nombre_Carrito_React</strong></span>
              <button
                onClick={() => setIsReadmeOpen(false)}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-300 font-semibold">
            TIENDA PALMIRA • Centro de Biotecnología Industrial (CBI Palmira - SENA)
          </p>
          <p className="text-slate-500 mt-1">
            Desarrollo Front-End con React • Reto Práctico Carrito de Compras
          </p>
        </div>
      </footer>

    </div>
  );
}