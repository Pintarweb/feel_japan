"use client";

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface GatekeeperProps {
    children: React.ReactNode;
}

export default function Gatekeeper({ children }: GatekeeperProps) {
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    // Simple session check
    useEffect(() => {
        const isAuth = sessionStorage.getItem("studio_auth") === "true";
        if (isAuth) setAuthorized(true);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // A simple "secret" key for now as requested
        if (password === "FEELJAPAN_BESPOKE") {
            setAuthorized(true);
            sessionStorage.setItem("studio_auth", "true");
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    if (authorized) return <>{children}</>;

    return (
        <div className="min-h-screen bg-midnight-navy flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brushed-gold/5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-midnight-navy/5 rounded-full -ml-12 -mb-12"></div>

                <div className="relative text-center">
                    <div className="w-16 h-16 bg-midnight-navy/5 text-midnight-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8" />
                    </div>

                    <h1 className="text-2xl font-serif font-bold text-midnight-navy mb-2">Studio Access</h1>
                    <p className="text-midnight-navy/40 text-sm mb-8 uppercase tracking-widest font-bold">Authorized Personnel Only</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-midnight-navy/40 ml-1">Access Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Studio Key"
                                className={`w-full bg-[#f8f9fa] border-none rounded-xl px-5 py-4 focus:ring-2 transition-all ${error ? 'ring-2 ring-red-400' : 'focus:ring-brushed-gold/30'}`}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-midnight-navy text-white py-4 rounded-xl text-sm font-bold tracking-[0.2em] uppercase shadow-lg shadow-midnight-navy/20 hover:bg-midnight-navy/90 hover:-translate-y-0.5 transition-all"
                        >
                            Open Studio
                        </button>
                    </form>

                    {error && (
                        <p className="mt-4 text-red-500 text-[10px] font-bold uppercase tracking-widest animate-bounce">Access Denied</p>
                    )}
                </div>
            </div>
        </div>
    );
}
