import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    // Fetch initial orders
    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false }); // Show newest first

        if (!error && data) {
            setOrders(data);
        } else if (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Real-time subscription
        const channel = supabase
            .channel('orders_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setOrders(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setOrders(prev => prev.map(order => order.id === payload.new.id ? payload.new : order));
                } else if (payload.eventType === 'DELETE') {
                    setOrders(prev => prev.filter(order => order.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addOrder = async (order) => {
        const newOrder = {
            customer: order.customer,
            items: order.items,
            total: order.total,
            status: 'pending',
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        const { data, error } = await supabase
            .from('orders')
            .insert([newOrder])
            .select();

        if (error) {
            console.error("Error adding order:", error);
            return null;
        }
        return data[0];
    };

    const updateOrderStatus = async (id, status) => {
        await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);
    };

    const deleteOrder = async (id) => {
        await supabase
            .from('orders')
            .delete()
            .eq('id', id);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
