import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutFlow from './CheckoutFlow';
import { useOrder } from '../context/OrderContext';

const MenuPage = ({ setCartCount }) => {
    const { addOrder } = useOrder();
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Todos');

    const categories = ['Todos', ...new Set(MOCK_PRODUCTS.map(p => p.category))];

    const filteredProducts = activeCategory === 'Todos'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setCartCount(prev => prev + 1);
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === productId);
            if (!existing) return prev;
            if (existing.quantity === 1) {
                return prev.filter(item => item.id !== productId);
            }
            return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
        });
        setCartCount(prev => prev - 1);
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const navigate = useNavigate();

    if (showCheckout) {
        return (
            <CheckoutFlow
                cart={cart}
                total={total}
                onBack={() => setShowCheckout(false)}
                onConfirm={(name) => {
                    const newOrder = addOrder({
                        items: cart.map(i => `${i.quantity}x ${i.name}`),
                        total: total,
                        customer: name,
                        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    });
                    setShowCheckout(false);
                    setCart([]);
                    setCartCount(0);
                    const myOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
                    myOrders.push(newOrder.id);
                    localStorage.setItem('my_orders', JSON.stringify(myOrders));
                    localStorage.setItem('lastOrderId', newOrder.id);
                    navigate(`/tracking/${newOrder.id}`);
                }}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Simple Category Tabs - Stitch Style */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 overflow-x-auto scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeCategory === cat
                            ? 'bg-white shadow-sm text-primary'
                            : 'text-slate-500'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product List - Stitch Style Cards */}
            <div className="space-y-4 pb-24">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-ios p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="font-black text-primary text-lg">
                                    <span className="text-xs mr-0.5">R$</span>
                                    {product.price.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 active:scale-90 transition-transform"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Mini-Cart (Above Nav) */}
            <AnimatePresence>
                {cart.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-24 left-4 right-4 bg-primary p-4 rounded-ios shadow-xl shadow-green-900/20 text-white flex justify-between items-center z-40 cursor-pointer"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-black">
                                {cart.reduce((a, b) => a + b.quantity, 0)}
                            </div>
                            <div className="font-bold">
                                <p className="text-xs opacity-80 uppercase tracking-widest">Total</p>
                                <p className="text-xl leading-none">R$ {total.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 font-bold bg-white text-primary px-4 py-2 rounded-xl text-sm">
                            Ver Sacola
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Sheet (Stitch Style) */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-[var(--background)] rounded-t-[30px] z-[70] h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="bg-white p-6 rounded-b-[30px] shadow-sm z-10">
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-slate-900">Seu Pedido</h2>
                                    <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="bg-white p-4 rounded-ios flex items-center gap-4 shadow-sm border border-slate-100">
                                        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 leading-tight mb-1">{item.name}</p>
                                            <p className="text-primary font-black">R$ {item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1">
                                            <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm"><Minus size={16} /></button>
                                            <span className="font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white p-6 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Total</span>
                                    <span className="text-3xl font-black text-slate-900">R$ {total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        setShowCheckout(true);
                                    }}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-200"
                                >
                                    Fazer Pedido
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenuPage;
