import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Package, Utensils, ArrowLeft, X, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';

const OrderTracking = () => {
    const { orderId } = useParams();
    const { orders } = useOrder();
    const navigate = useNavigate();
    const [myOrderIds, setMyOrderIds] = useState([]);

    useEffect(() => {
        const storedIds = JSON.parse(localStorage.getItem('my_orders') || '[]');
        setMyOrderIds(storedIds);
    }, []);

    // Filter orders to only show the ones belonging to this user
    const myOrdersList = orders.filter(o => myOrderIds.includes(o.id)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // If viewing a specific order
    if (orderId) {
        const activeOrder = orders.find(o => o.id.toString() === orderId.toString());

        if (!activeOrder) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <X size={48} className="text-red-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Pedido não encontrado</h2>
                    <p className="text-slate-500 font-medium mb-8">Não encontramos o pedido #{orderId}.</p>
                    <div className="flex gap-4">
                        <Link to="/tracking" className="text-primary font-bold">Ver Meus Pedidos</Link>
                        <Link to="/menu" className="bg-primary text-white py-3 px-6 rounded-xl font-black shadow-lg shadow-green-200">
                            Novo Pedido
                        </Link>
                    </div>
                </div>
            );
        }

        const status = activeOrder.status;
        const steps = [
            { key: 'pending', label: 'Pagamento', icon: <Package size={24} />, active: status === 'pending' || status === 'preparing' || status === 'ready' || status === 'delivered' },
            { key: 'preparing', label: 'Cozinha', icon: <Utensils size={24} />, active: status === 'preparing' || status === 'ready' || status === 'delivered' },
            { key: 'ready', label: 'Pronto', icon: <CheckCircle size={24} />, active: status === 'ready' || status === 'delivered' },
        ];

        return (
            <div className="space-y-6">
                <Link to="/tracking" className="flex items-center gap-2 text-slate-500 mb-8 font-bold text-sm hover:text-primary transition-colors">
                    <ArrowLeft size={20} /> Voltar para Meus Pedidos
                </Link>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={40} className="text-primary animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Pedido #{activeOrder.id}</h2>
                    <p className="text-slate-500 font-medium">Estamos preparando sua delícia!</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 mb-6 shadow-xl shadow-black/5 border border-white">
                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 z-0 rounded-full"></div>
                        <div className="grid gap-12 relative z-10">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-6 items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-colors scale-110 ${step.active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-300'}`}>
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-xl font-black m-0 leading-tight ${step.active ? 'text-slate-800' : 'text-slate-300'}`}>
                                            {step.label}
                                        </h4>
                                        {step.active && step.key === 'preparing' && (
                                            <p className="text-primary text-sm font-bold mt-1 bg-primary/10 inline-block px-3 py-1 rounded-lg">Estimativa: 5-10 min</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        );
    }

    // List View (No specific order selected)
    if (myOrdersList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Package size={48} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Nenhum pedido ativo</h2>
                <p className="text-slate-500 font-medium mb-8">Você ainda não realizou nenhum pedido hoje.</p>
                <Link to="/menu" className="bg-primary text-white py-4 px-8 rounded-xl font-black shadow-lg shadow-green-200 hover:scale-105 transition-transform">
                    Fazer um Pedido
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Meus Pedidos</h1>
            <div className="grid gap-4">
                {myOrdersList.map(order => (
                    <Link to={`/tracking/${order.id}`} key={order.id} className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${order.status === 'ready' || order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {order.status === 'ready' || order.status === 'delivered' ? <CheckCircle size={24} /> : <Clock size={24} />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pedido #{order.id}</p>
                                <h3 className="text-lg font-black text-slate-800">{order.items.length} Itens</h3>
                                <p className="text-sm font-bold text-primary">R$ {order.total.toFixed(2)}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                ))}
            </div>
            <div className="text-center mt-8">
                <Link to="/menu" className="inline-flex items-center gap-2 font-black text-primary hover:text-green-700 transition-colors bg-white px-6 py-3 rounded-xl shadow-sm">
                    <Plus size={20} /> Fazer Novo Pedido
                </Link>
            </div>
        </div>
    );
};

export default OrderTracking;
