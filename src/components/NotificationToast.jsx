
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const NotificationToast = ({ show, message, onClose, onClick }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed top-4 left-4 right-4 z-[100] flex justify-center pointer-events-none"
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl border border-green-100 p-4 flex items-center gap-4 w-full max-w-md pointer-events-auto cursor-pointer"
                        onClick={onClick}
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                            <CheckCircle size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-slate-800 text-lg leading-tight">Pedido Pronto!</h4>
                            <p className="text-slate-500 font-medium text-sm">{message}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-50 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;
