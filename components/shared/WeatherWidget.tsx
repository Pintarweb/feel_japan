'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetching weather for Tokyo (using a free public endpoint or similar)
        async function fetchWeather() {
            try {
                // Open-meteo is a great no-key-required API for basic weather
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

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="w-8 h-8 text-amber-400" />;
        if (code > 0 && code < 4) return <Cloud className="w-8 h-8 text-gray-400" />;
        if (code >= 51) return <CloudRain className="w-8 h-8 text-blue-400" />;
        return <Sun className="w-8 h-8 text-amber-400" />;
    };

    return (
        <div className="bg-white p-6 rounded-sm border border-midnight-navy/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brushed-gold">Tokyo Weather</h3>
                    <p className="text-[10px] text-midnight-navy/40 uppercase tracking-widest mt-1">Ground Conditions</p>
                </div>
                <div className="p-2 bg-brushed-gold/5 rounded-full group-hover:bg-brushed-gold/10 transition-colors">
                    <Thermometer className="w-4 h-4 text-brushed-gold" />
                </div>
            </div>

            {loading ? (
                <div className="h-20 animate-pulse bg-midnight-navy/5 rounded-sm"></div>
            ) : weather ? (
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        {getWeatherIcon(weather.weathercode)}
                        <span className="text-[10px] font-bold text-midnight-navy/40 mt-2 uppercase tracking-tighter">
                            {weather.weathercode === 0 ? 'Clear Sky' : 'Partly Cloudy'}
                        </span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-serif text-midnight-navy">{Math.round(weather.temperature)}</span>
                            <span className="text-xl font-serif text-brushed-gold">°C</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-midnight-navy/40">
                                <Wind className="w-3 h-3" />
                                <span className="text-[10px] font-medium">{weather.windspeed} km/h</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-[10px] text-midnight-navy/40 italic py-4">Current conditions unavailable</div>
            )}
        </div>
    );
}
