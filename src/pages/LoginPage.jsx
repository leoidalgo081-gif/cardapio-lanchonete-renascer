import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded password for the event
        if (password === '1234' || password === 'admin') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <Lock size={32} className="text-slate-800" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800">Acesso Restrito</h1>
                    <p className="text-slate-500 text-sm font-medium">Painel da Cozinha</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Senha de Acesso
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-lg font-bold text-slate-800 focus:outline-none focus:border-primary transition-colors text-center tracking-widest"
                            placeholder="****"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">
                            Senha incorreta. Tente novamente.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white font-black uppercase tracking-wide py-4 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-900 transition-transform active:scale-95"
                    >
                        Entrar
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-slate-400 font-bold text-xs uppercase tracking-wide py-2 hover:text-slate-600 transition-colors"
                    >
                        Voltar para o Início
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
