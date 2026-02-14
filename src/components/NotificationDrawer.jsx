import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationDrawer = ({ isOpen, onClose, notifications, onMarkAsRead }) => {
    const navigate = useNavigate();

    const handleNotificationClick = (notification) => {
        onMarkAsRead(notification.id);
        if (notification.orderId) {
            navigate(`/tracking/${notification.orderId}`);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Bell className="text-primary" />
                                Notificações
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                            {notifications.length === 0 ? (
                                <div className="text-center py-20 opacity-50">
                                    <Bell size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p className="font-bold text-slate-400">Nenhuma notificação</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${notif.read ? 'bg-white border-slate-100' : 'bg-green-50 border-green-100 shadow-sm'}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white'}`}>
                                                {notif.type === 'ready' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`font-bold text-sm mb-1 ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h4>
                                                    {!notif.read && <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></span>}
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notif.message}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide">{notif.time}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDrawer;
