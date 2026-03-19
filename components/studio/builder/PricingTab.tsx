import React from 'react';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { Brochure, PricingTier } from '@/types/brochure';

interface PricingTabProps {
    form: Partial<Brochure>;
    setForm: React.Dispatch<React.SetStateAction<Partial<Brochure>>>;
    addPricingTier: () => void;
    updatePricingTier: (index: number, updates: Partial<PricingTier>) => void;
    showColumnDropdown: boolean;
    setShowColumnDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PricingTab({
    form,
    setForm,
    addPricingTier,
    updatePricingTier,
    showColumnDropdown,
    setShowColumnDropdown,
}: PricingTabProps) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-xl font-serif font-bold text-midnight-navy flex items-center gap-3">
                        <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                        Pricing Tier Matrix
                    </h2>

                    <div className="flex bg-midnight-navy/5 p-1 rounded-xl items-center">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/40 px-3">Display Pricing:</span>
                        <button
                            onClick={() => setForm({ ...form, show_pricing: !form.show_pricing })}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${form.show_pricing !== false
                                ? 'bg-green-500 text-white shadow-sm'
                                : 'bg-red-500 text-white shadow-sm'
                                }`}
                        >
                            {form.show_pricing !== false ? "Visible" : "Hidden"}
                        </button>
                        {form.show_pricing === false && (
                            <span className="ml-3 text-[9px] font-bold text-red-500/60 uppercase">Hidden for Clients</span>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-midnight-navy/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-midnight-navy/60 hover:bg-midnight-navy/10 transition-all border border-midnight-navy/5"
                        >
                            <Settings className="w-3.5 h-3.5" />
                            Configure Columns
                        </button>

                        {showColumnDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-midnight-navy/5 rounded-2xl shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-midnight-navy/5">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/40">Visible Columns</span>
                                    <button onClick={() => setShowColumnDropdown(false)} className="text-[9px] font-bold uppercase text-brushed-gold">Done</button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { id: 'adult', label: 'Adult Price' },
                                        { id: 'cwb', label: 'Child with Bed' },
                                        { id: 'cnb', label: 'Child no Bed' },
                                        { id: 'single', label: 'Single Supp' },
                                        { id: 'vehicle', label: 'Transport Vehicle' }
                                    ].map(col => {
                                        const isChecked = (form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes(col.id as any);
                                        return (
                                            <label key={col.id} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {
                                                        const current = form.pricing?.displayColumns || ['adult', 'cwb', 'cnb'];
                                                        const next = current.includes(col.id as any)
                                                            ? current.filter(c => c !== col.id)
                                                            : [...current, col.id];
                                                        if (next.length === 0) return; // Must show at least one
                                                        setForm({ ...form, pricing: { ...form.pricing!, displayColumns: next as any } });
                                                    }}
                                                    className="w-4 h-4 rounded border-midnight-navy/10 text-midnight-navy focus:ring-brushed-gold/30"
                                                />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isChecked ? 'text-midnight-navy' : 'text-midnight-navy/40 group-hover:text-midnight-navy/60'}`}>
                                                    {col.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={addPricingTier}
                        className="text-xs font-bold uppercase tracking-widest text-midnight-navy/60 hover:text-midnight-navy flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Tier
                    </button>
                </div>

                <div className="bg-white rounded-[2rem] border border-midnight-navy/5 shadow-sm overflow-hidden mb-8">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8f9fa] text-[10px] uppercase font-bold tracking-widest text-midnight-navy/40">
                            <tr>
                                <th className="px-8 py-4 text-center">Pax Range</th>
                                {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('adult') && <th className="px-8 py-4 text-center">Adult Price</th>}
                                {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('cwb') && <th className="px-8 py-4 text-center">CWB</th>}
                                {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('cnb') && <th className="px-8 py-4 text-center">CNB</th>}
                                {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('single') && <th className="px-8 py-4 text-center">Single</th>}
                                {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('vehicle') && <th className="px-8 py-4 text-center">Vehicle</th>}
                                <th className="px-8 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-midnight-navy/5 text-center">
                            {form.pricing?.tiers.map((tier, idx) => (
                                <tr key={idx}>
                                    <td className="px-8 py-6">
                                        <input
                                            value={tier.pax}
                                            onChange={(e) => updatePricingTier(idx, { pax: e.target.value })}
                                            placeholder="e.g. 2-3 Pax"
                                            className="bg-transparent border-none p-0 text-sm font-bold text-midnight-navy w-full text-center"
                                        />
                                    </td>
                                    {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('adult') && (
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className="text-midnight-navy/30 font-mono text-xs">¥</span>
                                                <input
                                                    type="number"
                                                    value={tier.adultPrice}
                                                    onChange={(e) => updatePricingTier(idx, { adultPrice: parseInt(e.target.value) })}
                                                    className="bg-transparent border-none p-0 text-sm font-bold text-midnight-navy w-24 text-center"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('cwb') && (
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className="text-midnight-navy/30 font-mono text-xs">¥</span>
                                                <input
                                                    type="number"
                                                    value={tier.childPriceWithBed || 0}
                                                    onChange={(e) => updatePricingTier(idx, { childPriceWithBed: parseInt(e.target.value) })}
                                                    className="bg-transparent border-none p-0 text-sm font-bold text-midnight-navy w-24 text-center"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('cnb') && (
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className="text-midnight-navy/30 font-mono text-xs">¥</span>
                                                <input
                                                    type="number"
                                                    value={tier.childPriceNoBed || 0}
                                                    onChange={(e) => updatePricingTier(idx, { childPriceNoBed: parseInt(e.target.value) })}
                                                    className="bg-transparent border-none p-0 text-sm font-bold text-midnight-navy w-24 text-center"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('single') && (
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className="text-midnight-navy/30 font-mono text-xs">¥</span>
                                                <input
                                                    type="number"
                                                    value={tier.singlePrice || 0}
                                                    onChange={(e) => updatePricingTier(idx, { singlePrice: parseInt(e.target.value) })}
                                                    className="bg-transparent border-none p-0 text-sm font-bold text-midnight-navy w-24 text-center"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {(form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes('vehicle') && (
                                        <td className="px-8 py-6">
                                            <input
                                                value={tier.vehicle || ''}
                                                onChange={(e) => updatePricingTier(idx, { vehicle: e.target.value })}
                                                placeholder="e.g. Alphard"
                                                className="bg-transparent border-none p-0 text-sm font-bold text-midnight-navy w-full text-center placeholder:text-midnight-navy/10"
                                            />
                                        </td>
                                    )}
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => {
                                                const newTiers = [...(form.pricing?.tiers || [])];
                                                newTiers.splice(idx, 1);
                                                setForm({ ...form, pricing: { ...form.pricing!, tiers: newTiers } });
                                            }}
                                            className="text-red-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Surcharge / Pricing Note</label>
                    <input
                        value={form.pricing?.surchargeNote}
                        onChange={(e) => setForm({ ...form, pricing: { ...form.pricing!, surchargeNote: e.target.value } })}
                        className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all text-sm italic font-serif"
                    />
                </div>
            </section>
        </div>
    );
}
