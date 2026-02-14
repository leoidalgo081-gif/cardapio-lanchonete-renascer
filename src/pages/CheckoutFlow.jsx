import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ArrowLeft } from 'lucide-react';

import { motion } from 'framer-motion';
import LoadingOverlay from '../components/LoadingOverlay';

const CheckoutFlow = ({ cart, total, onBack, onConfirm }) => {
    const [name, setName] = useState('');
    const [step, setStep] = useState(1); // 1: Name, 2: Pix
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock Pix Key (Ideally this would be a real key or a dynamic BRCode)
    const pixKey = "suachavepix@aqui.com";
    const pixPayload = `00020126330014BR.GOV.BCB.PIX0111${pixKey}520400005303986540${total.toFixed(2)}5802BR5918LanchoneteRenascer6009SAO PAULO62070503***6304`;

    const handleCopy = () => {
        navigator.clipboard.writeText(pixPayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (step === 1) {
        return (
            <div className="bg-white rounded-ios p-8 shadow-sm border border-slate-100">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 font-bold text-sm">
                    <ArrowLeft size={20} /> Voltar ao cardápio
                </button>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Quem está pedindo?</h2>
                <p className="text-slate-500 mb-6 font-medium">Seu nome será usado para te chamar quando o pedido estiver pronto.</p>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full p-4 rounded-xl border-2 border-slate-100 mb-6 text-lg focus:border-primary outline-none transition-colors font-bold text-slate-900 placeholder:font-normal"
                    autoFocus
                />

                <button
                    disabled={!name.trim()}
                    onClick={() => setStep(2)}
                    className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                >
                    Continuar para Pagamento
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-ios p-8 shadow-sm border border-slate-100 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Pagamento via Pix</h2>
            <p className="text-slate-500 mb-6 font-medium">Total a pagar: <span className="font-extrabold text-primary">R$ {total.toFixed(2)}</span></p>

            <div className="bg-slate-50 p-6 rounded-2xl inline-block mb-6 border border-slate-100">
                <QRCodeSVG value={pixPayload} size={200} />
            </div>

            <div className="mb-8">
                <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Pix Copia e Cola</p>
                <button
                    onClick={handleCopy}
                    className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary transition-colors group"
                >
                    <span className="truncate text-slate-600 font-mono text-sm font-bold group-hover:text-primary transition-colors">{pixPayload}</span>
                    {copied ? <Check className="text-primary" size={20} /> : <Copy className="text-slate-400 group-hover:text-primary transition-colors" size={20} />}
                </button>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-left mb-8">
                <p className="text-orange-800 text-sm leading-relaxed font-medium">
                    <strong className="font-bold">Passo a passo:</strong><br />
                    1. Copie o código acima ou escaneie o QR Code.<br />
                    2. Pague no aplicativo do seu banco.<br />
                    3. Após pagar, clique no botão abaixo para avisar a cozinha.
                </p>
            </div>

            <button
                onClick={async () => {
                    setIsLoading(true);
                    await onConfirm(name);
                    // Stop loading only if navigation doesn't happen (though usually unmounts)
                    setTimeout(() => setIsLoading(false), 5000);
                }}
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale"
            >
                Confirmar e Avisar Cozinha
            </button>
            {isLoading && <LoadingOverlay message="Enviando pedido..." />}
            <p className="text-xs text-center text-slate-400 mt-4 px-8">
                * A verificação do pagamento será feita no balcão ao retirar.
            </p>
        </div>
    );
};

export default CheckoutFlow;
