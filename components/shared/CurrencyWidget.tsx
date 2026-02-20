'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, ArrowRightLeft, JapaneseYen, Landmark, Wallet } from 'lucide-react';

export default function CurrencyWidget() {
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isReversed, setIsReversed] = useState(false);

    useEffect(() => {
        async function fetchRate() {
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/MYR');
                const data = await res.json();
                if (data.rates && data.rates.JPY) {
                    setRate(data.rates.JPY);
                }
            } catch (error) {
                console.error('Currency fetch error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRate();
    }, []);

    const toggleReverse = () => setIsReversed(!isReversed);

    return (
        <div className={`relative overflow-hidden group rounded-2xl transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${loading ? 'bg-white border border-midnight-navy/5' : ''}`}>
            {loading ? (
                <div className="p-8 h-48 animate-pulse bg-white flex flex-col justify-center gap-4">
                    <div className="w-24 h-4 bg-midnight-navy/5 rounded-full" />
                    <div className="w-full h-12 bg-midnight-navy/5 rounded-sm" />
                </div>
            ) : (
                <div className={`p-8 bg-gradient-to-br transition-all duration-500 ${isReversed ? 'from-indigo-600 to-violet-800' : 'from-emerald-600 to-teal-800'} relative z-10 min-h-[220px] flex flex-col justify-between text-white`}>
                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />

                    {/* Background Decorative Element */}
                    <div className={`absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-3xl transition-all duration-1000 ${isReversed ? 'bg-indigo-400/20 group-hover:bg-indigo-400/30' : 'bg-emerald-400/20 group-hover:bg-emerald-400/30'}`} />

                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Landmark className="w-3 h-3 text-white/60" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">Market Rate</span>
                            </div>
                            <h3 className="text-xl font-serif">
                                {isReversed ? 'JPY ⇌ MYR' : 'MYR ⇌ JPY'}
                            </h3>
                        </div>
                        <button
                            onClick={toggleReverse}
                            className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 group/btn shadow-lg"
                            title="Reverse Direction"
                        >
                            <ArrowRightLeft className={`w-4 h-4 text-white transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-end justify-between relative z-10">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                {isReversed ? '100 Yen equals' : '1 Ringgit equals'}
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-serif tracking-tighter">
                                    {rate ? (isReversed ? ((100 / rate).toFixed(2)) : rate.toFixed(2)) : '...'}
                                </span>
                                <span className="text-2xl font-serif text-white/60">
                                    {isReversed ? 'MYR' : 'YEN'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            {isReversed ? (
                                <Wallet className="w-14 h-14 text-white drop-shadow-[0_8px_16px_rgba(255,255,255,0.3)] animate-[bounce_4s_infinite_ease-in-out]" />
                            ) : (
                                <JapaneseYen className="w-14 h-14 text-white drop-shadow-[0_8px_16px_rgba(255,255,255,0.3)] animate-[bounce_4s_infinite_ease-in-out]" />
                            )}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/5">
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isReversed ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">
                                        {isReversed ? 'Inverse View' : 'Live Tracker'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
}
