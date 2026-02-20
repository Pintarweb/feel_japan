'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, ArrowRightLeft } from 'lucide-react';

export default function CurrencyWidget() {
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRate() {
            try {
                // Public exchange rate API (no key required for basic rates)
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

    return (
        <div className="bg-white p-6 rounded-sm border border-midnight-navy/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brushed-gold">Currency Watch</h3>
                    <p className="text-[10px] text-midnight-navy/40 uppercase tracking-widest mt-1">Live Market Rate</p>
                </div>
                <div className="p-2 bg-brushed-gold/5 rounded-full group-hover:bg-brushed-gold/10 transition-colors">
                    <ArrowRightLeft className="w-4 h-4 text-brushed-gold" />
                </div>
            </div>

            {loading ? (
                <div className="h-20 animate-pulse bg-midnight-navy/5 rounded-sm"></div>
            ) : rate ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-midnight-navy/30 uppercase tracking-widest">1 MYR equals</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-serif text-midnight-navy">{rate.toFixed(2)}</span>
                                <span className="text-lg font-serif text-brushed-gold">JPY</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-midnight-navy/5 flex items-center justify-center bg-off-white">
                            <TrendingUp className="w-5 h-5 text-brushed-gold/40" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-midnight-navy/5">
                        <RefreshCw className="w-3 h-3 text-brushed-gold animate-spin-slow" />
                        <span className="text-[9px] font-medium text-midnight-navy/40 uppercase tracking-widest">
                            Auto-updated every 12 hours
                        </span>
                    </div>
                </div>
            ) : (
                <div className="text-[10px] text-midnight-navy/40 italic py-4">Live rates unavailable</div>
            )}
        </div>
    );
}
