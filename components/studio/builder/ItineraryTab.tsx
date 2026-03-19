import React from 'react';
import { Plus, Trash2, GripVertical, MapPin, XCircle, Coffee, Utensils, Soup } from 'lucide-react';
import { Brochure, ItineraryDay } from '@/types/brochure';

interface ItineraryTabProps {
    form: Partial<Brochure>;
    setForm: React.Dispatch<React.SetStateAction<Partial<Brochure>>>;
    addDay: () => void;
    removeDay: (index: number) => void;
    updateDay: (index: number, updates: Partial<ItineraryDay>) => void;
    addActivity: (dayIndex: number) => void;
}

export default function ItineraryTab({
    form,
    setForm,
    addDay,
    removeDay,
    updateDay,
    addActivity,
}: ItineraryTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-bold text-midnight-navy flex items-center gap-3">
                    <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                    Itinerary Block Construction
                </h2>
                <button
                    onClick={addDay}
                    className="text-xs font-bold uppercase tracking-widest text-white bg-midnight-navy px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-midnight-navy/10 hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="w-4 h-4 text-brushed-gold" />
                    Append Next Day
                </button>
            </div>

            <div className="space-y-6">
                {form.itinerary?.map((day, idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-midnight-navy/5 shadow-sm p-8 group relative">
                        <div className="absolute left-4 top-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-4 h-4 text-midnight-navy/20 cursor-grab" />
                        </div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-midnight-navy text-white rounded-2xl flex flex-col items-center justify-center shadow-lg">
                                    <span className="text-[8px] uppercase tracking-tighter font-bold opacity-50">Day</span>
                                    <span className="text-xl font-serif font-bold text-brushed-gold">{day.day}</span>
                                </div>
                                <input
                                    value={day.title}
                                    onChange={(e) => updateDay(idx, { title: e.target.value })}
                                    placeholder="Day Theme..."
                                    className="text-2xl font-serif font-bold text-midnight-navy border-none p-0 focus:ring-0 w-full placeholder:text-midnight-navy/10"
                                />
                            </div>
                            <button
                                onClick={() => removeDay(idx)}
                                className="p-2 hover:bg-red-50 text-red-100 hover:text-red-500 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="col-span-3 space-y-4">
                                <label className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 ml-1">Daily Meal Provisions</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'B', label: 'Breakfast', icon: Coffee },
                                        { id: 'L', label: 'Lunch', icon: Utensils },
                                        { id: 'D', label: 'Dinner', icon: Soup }
                                    ].map((meal) => {
                                        // Normalize parsing: handle various separators and spaces
                                        const mealParts = (day.meals || "- / - / -").split(/[\/,]/).map(s => s.trim());
                                        const isSelected = mealParts.includes(meal.id);
                                        const Icon = meal.icon;

                                        return (
                                            <button
                                                key={meal.id}
                                                onClick={() => {
                                                    // Parse current state into 3 clean slots [B, L, D]
                                                    const current = (day.meals || "").split(/[\/,]/).map(s => s.trim());
                                                    const hasB = current.includes('B');
                                                    const hasL = current.includes('L');
                                                    const hasD = current.includes('D');

                                                    let nextB = hasB;
                                                    let nextL = hasL;
                                                    let nextD = hasD;

                                                    if (meal.id === 'B') nextB = !hasB;
                                                    if (meal.id === 'L') nextL = !hasL;
                                                    if (meal.id === 'D') nextD = !hasD;

                                                    const newVal = [
                                                        nextB ? 'B' : '-',
                                                        nextL ? 'L' : '-',
                                                        nextD ? 'D' : '-'
                                                    ].join(' / ');

                                                    updateDay(idx, { meals: newVal });
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isSelected
                                                    ? 'bg-midnight-navy text-white shadow-lg shadow-midnight-navy/10'
                                                    : 'bg-white border border-midnight-navy/5 text-midnight-navy/30 hover:border-midnight-navy/10 hover:text-midnight-navy/50'
                                                    }`}
                                            >
                                                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brushed-gold' : 'opacity-30'}`} />
                                                {meal.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] uppercase font-bold tracking-widest text-midnight-navy/40 ml-1">Activities & Stops</label>
                            <div className="space-y-2">
                                {day.activities.map((act, actIdx) => (
                                    <div key={actIdx} className="flex gap-3 group/act">
                                        <div className="w-8 h-8 rounded-lg bg-midnight-navy/5 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-midnight-navy/30" />
                                        </div>
                                        <input
                                            value={act.description}
                                            onChange={(e) => {
                                                const newActs = [...day.activities];
                                                newActs[actIdx].description = e.target.value;
                                                updateDay(idx, { activities: newActs });
                                            }}
                                            className="flex-1 bg-transparent border-b border-midnight-navy/5 focus:border-brushed-gold py-1 text-sm transition-colors"
                                        />
                                        <button
                                            onClick={() => {
                                                const newActs = [...day.activities];
                                                newActs.splice(actIdx, 1);
                                                updateDay(idx, { activities: newActs });
                                            }}
                                            className="opacity-0 group-hover/act:opacity-100 p-1 hover:bg-red-50 text-red-300 rounded"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addActivity(idx)}
                                    className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/30 hover:text-midnight-navy flex items-center gap-2 px-2 py-4 border-2 border-dashed border-midnight-navy/5 rounded-2xl w-full justify-center transition-all hover:bg-white"
                                >
                                    <Plus className="w-3 h-3" />
                                    Insert Activity Block
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
