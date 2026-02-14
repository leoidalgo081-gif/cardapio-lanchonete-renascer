import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = ({ message = "Enviando para a cozinha..." }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="text-center">
                <motion.div
                    className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-500/30"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                        borderRadius: ["20%", "50%", "20%"]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity
                    }}
                >
                    <span className="material-symbols-outlined text-4xl text-white">restaurant</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-xl font-bold tracking-wide"
                >
                    {message}
                </motion.h2>
                <div className="mt-4 flex gap-1 justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-yellow-400 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
