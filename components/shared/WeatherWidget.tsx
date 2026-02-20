'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin } from 'lucide-react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true');
                const data = await res.json();
                if (data.current_weather) {
                    setWeather(data.current_weather);
                }
            } catch (error) {
                console.error('Weather fetch error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchWeather();
    }, []);

    const getWeatherTheme = (code: number) => {
        // Clear sky
        if (code === 0) return {
            bg: 'from-amber-400 to-orange-500',
            glow: 'shadow-orange-200',
            text: 'text-white',
            label: 'Clear Sky',
            icon: <Sun className="w-16 h-16 text-white drop-shadow-[0_8px_16px_rgba(255,255,255,0.4)] animate-[float_4s_ease-in-out_infinite]" />
        };
        // Clouds
        if (code > 0 && code < 4) return {
            bg: 'from-blue-400 to-indigo-500',
            glow: 'shadow-blue-200',
            text: 'text-white',
            label: 'Partly Cloudy',
            icon: <div className="relative">
                <Sun className="w-12 h-12 text-amber-200 absolute -top-2 -right-2 opacity-80" />
                <Cloud className="w-16 h-16 text-white drop-shadow-[0_8px_16px_rgba(255,255,255,0.4)] animate-[float_5s_ease-in-out_infinite]" />
            </div>
        };
        // Rain
        if (code >= 51) return {
            bg: 'from-slate-600 to-slate-800',
            glow: 'shadow-slate-300',
            text: 'text-white',
            label: 'Showers',
            icon: <CloudRain className="w-16 h-16 text-white drop-shadow-[0_8px_16px_rgba(255,255,255,0.4)] animate-[float_3s_ease-in-out_infinite]" />
        };

        return {
            bg: 'from-brushed-gold to-midnight-navy',
            glow: 'shadow-gold-200',
            text: 'text-white',
            label: 'Tokyo Status',
            icon: <Sun className="w-16 h-16 text-white" />
        };
    };

    const theme = weather ? getWeatherTheme(weather.weathercode) : getWeatherTheme(0);

    return (
        <div className={`relative overflow-hidden group rounded-2xl transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${loading ? 'bg-white border border-midnight-navy/5' : ''}`}>
            {loading ? (
                <div className="p-8 h-48 animate-pulse bg-white flex flex-col justify-center gap-4">
                    <div className="w-24 h-4 bg-midnight-navy/5 rounded-full" />
                    <div className="w-full h-12 bg-midnight-navy/5 rounded-sm" />
                </div>
            ) : (
                <div className={`p-8 bg-gradient-to-br ${theme.bg} relative z-10 min-h-[220px] flex flex-col justify-between`}>
                    {/* Glass Overlay for Depth */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />

                    {/* Background Decorative Circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />

                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-white/60" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">Tokyo, JP</span>
                            </div>
                            <h3 className="text-xl font-serif text-white">{theme.label}</h3>
                        </div>
                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                            <Thermometer className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="flex items-end justify-between relative z-10">
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-serif text-white tracking-tighter">{Math.round(weather.temperature)}</span>
                            <span className="text-2xl font-serif text-white/60">°C</span>
                        </div>

                        <div className="flex flex-col items-end">
                            {theme.icon}
                            <div className="mt-4 flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                    <Wind className="w-3 h-3" />
                                    <span>{weather.windspeed} km/h wind</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
