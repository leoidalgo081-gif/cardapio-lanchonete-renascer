import React, { useState } from 'react';
import { CheckCircle, Clock, Utensils, Bell, DollarSign, ChevronLeft, LayoutDashboard, Pizza, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import renascerLogo from '../assets/logo.png';

import { useOrder } from '../context/OrderContext';

import { requestNotificationPermission, sendNotification } from '../utils/notifications';
import LoadingOverlay from '../components/LoadingOverlay';

const AdminDashboard = () => {
    const { orders, updateOrderStatus } = useOrder();
    const prevOrdersLengthRef = React.useRef(0);

    // Request permission on mount
    React.useEffect(() => {
        requestNotificationPermission();
    }, []);

    // Check for new orders
    React.useEffect(() => {
        // Skip first run or if orders decreased/same
        if (prevOrdersLengthRef.current > 0 && orders.length > prevOrdersLengthRef.current) {
            const newOrdersCount = orders.length - prevOrdersLengthRef.current;
            const latestOrder = orders[0]; // Assuming new orders are added to start
            sendNotification('Novo Pedido!', `Chegou o pedido #${latestOrder.id} - ${latestOrder.customer}`);
        }
        prevOrdersLengthRef.current = orders.length;
    }, [orders]);

    const [activeTab, setActiveTab] = useState('active'); // active | history
    const [loadingId, setLoadingId] = useState(null);

    const updateStatus = async (id, newStatus) => {
        setLoadingId(id);
        await updateOrderStatus(id, newStatus);
        setLoadingId(null);
    };

    const statusConfig = {
        pending: { label: 'Pagamento', color: 'bg-red-50 text-red-600', icon: <DollarSign size={18} /> },
        preparing: { label: 'Na Cozinha', color: 'bg-primary-light text-primary', icon: <Utensils size={18} /> },
        ready: { label: 'Retirada', color: 'bg-accent/20 text-accent-dark', icon: <Bell size={18} /> },
        delivered: { label: 'Entregue', color: 'bg-slate-100 text-slate-500', icon: <CheckCircle size={18} /> },
    };

    const filteredOrders = activeTab === 'active'
        ? orders.filter(o => o.status !== 'delivered')
        : orders.filter(o => o.status === 'delivered');

    const sortedOrders = filteredOrders.sort((a, b) => a.id - b.id);

    const exportToCSV = () => {
        const headers = ['ID', 'Cliente', 'Data', 'Total', 'Itens', 'Status'];

        const rows = sortedOrders.map(order => [
            order.id,
            `"${order.customer}"`,
            order.time,
            order.total.toFixed(2).replace('.', ','),
            `"${order.items.join(', ')}"`,
            statusConfig[order.status].label
        ]);

        const csvContent = [
            headers.join(';'),
            ...rows.map(e => e.join(';'))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `pedidos_renascer_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-[#f0fdf4] min-h-screen pb-32">
            {loadingId && <LoadingOverlay message="Atualizando pedido..." />}
            {/* Admin Header */}
            <header className="bg-secondary text-white p-4 shadow-lg shadow-secondary/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            {/* Logo Replacement */}
                            <div className="flex items-center gap-3">
                                <img src={renascerLogo} alt="Renascer" className="h-8 object-contain brightness-0 invert" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                                <h2 className="text-xl m-0 text-white flex items-center gap-2" style={{ display: 'none' }}>
                                    <LayoutDashboard size={20} className="text-accent" />
                                    Painel da Cozinha
                                </h2>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Gestão de Pedidos em Tempo Real</p>
                        </div>
                    </div>
                    <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-black border border-primary/30 flex items-center gap-2">
                        <span>{orders.filter(o => o.status !== 'delivered').length} ATIVOS</span>
                        {activeTab === 'history' && (
                            <button
                                onClick={exportToCSV}
                                className="bg-green-600 text-white p-1 rounded-md hover:bg-green-700 transition-colors"
                                title="Exportar para Excel"
                            >
                                <Download size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {sortedOrders.map(order => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border-2 ${order.status === 'delivered' ? 'opacity-60 grayscale' : ''}`}
                                style={{ borderColor: order.status === 'ready' ? '#facc15' : order.status === 'preparing' ? '#22c55e' : order.status === 'delivered' ? '#e2e8f0' : '#fee2e2' }}
                            >
                                <div className="p-4 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">PEDIDO</span>
                                            <span className="text-4xl font-black text-slate-800 leading-none">#{order.id}</span>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${statusConfig[order.status].color}`}>
                                            {statusConfig[order.status].icon}
                                            {statusConfig[order.status].label}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <h3 className="text-lg text-slate-700 font-bold truncate">{order.customer}</h3>
                                        <div className="text-slate-400 text-xs font-bold flex items-center gap-1 mt-0.5">
                                            <Clock size={12} /> {order.time}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100 flex-1 overflow-y-auto max-h-32">
                                        <ul className="list-none grid gap-1.5">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="font-bold text-slate-600 flex items-start gap-2 text-sm leading-tight">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex justify-between items-end mb-4 px-1">
                                        <div className="text-secondary font-black text-xl">
                                            <span className="text-xs mr-1 text-slate-400">Total:</span>
                                            <span className="text-xs mr-0.5">R$</span>
                                            {order.total.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'preparing')}
                                                className="flex-1 bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-transform active:scale-95"
                                            >
                                                Confirmar Pago
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'ready')}
                                                className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-200 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-transform active:scale-95"
                                            >
                                                Pronto
                                            </button>
                                        )}
                                        {order.status === 'ready' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'delivered')}
                                                className="flex-1 bg-slate-800 text-white hover:bg-black shadow-lg shadow-slate-300 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-transform active:scale-95"
                                            >
                                                Entregue
                                            </button>
                                        )}
                                        {order.status === 'delivered' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'ready')} // Undo delivery
                                                className="flex-1 bg-slate-200 text-slate-600 hover:bg-slate-300 py-3 rounded-xl font-bold text-sm uppercase tracking-wide"
                                            >
                                                Desfazer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed border-gray-100 animate-up">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} className="text-gray-200" />
                        </div>
                        <h3 className="text-gray-400 font-black mb-1 text-xl">
                            {activeTab === 'active' ? 'Tudo Limpo!' : 'Nenhum Histórico'}
                        </h3>
                        <p className="text-gray-300 text-sm font-medium">
                            {activeTab === 'active' ? 'Nenhum pedido pendente na cozinha.' : 'Nenhum pedido foi entregue ainda.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Custom Admin Footer */}
            <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-4 flex justify-between items-center z-50 safe-area-bottom">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeTab === 'active' ? 'text-primary scale-105' : 'text-slate-400'}`}
                >
                    <div className={`p-2 rounded-full ${activeTab === 'active' ? 'bg-primary/10' : 'bg-transparent'}`}>
                        <Utensils size={24} strokeWidth={activeTab === 'active' ? 3 : 2} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wide">Pedidos em Preparo</span>
                </button>

                <div className="w-px h-10 bg-slate-200 mx-4"></div>

                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-primary scale-105' : 'text-slate-400'}`}
                >
                    <div className={`p-2 rounded-full ${activeTab === 'history' ? 'bg-primary/10' : 'bg-transparent'}`}>
                        <CheckCircle size={24} strokeWidth={activeTab === 'history' ? 3 : 2} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wide">Pedidos Fornecidos</span>
                </button>
            </nav>
        </div>
    );
};

export default AdminDashboard;
