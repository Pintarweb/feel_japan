import React from 'react';
import { Plus, ChevronUp, ChevronDown, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { Brochure } from '@/types/brochure';

interface TermsTabProps {
    form: Partial<Brochure>;
    setForm: React.Dispatch<React.SetStateAction<Partial<Brochure>>>;
    moveItem: (listName: 'inclusions' | 'exclusions' | 'optional', index: number, direction: 'up' | 'down') => void;
    removeItem: (listName: 'inclusions' | 'exclusions' | 'optional', index: number) => void;
}

export default function TermsTab({
    form,
    setForm,
    moveItem,
    removeItem,
}: TermsTabProps) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <h2 className="text-xl font-serif font-bold text-midnight-navy mb-8 flex items-center gap-3">
                    <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                    Package Logistics
                </h2>

                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Inclusions</label>
                            <button
                                onClick={() => setForm({ ...form, inclusions: [...(form.inclusions || []), "New point..."] })}
                                className="p-1 hover:bg-midnight-navy/5 rounded text-midnight-navy/40 hover:text-midnight-navy"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.inclusions?.map((inc, i) => (
                                <div key={i} className="flex gap-3 group/item bg-white p-3 rounded-xl border border-midnight-navy/5 hover:border-brushed-gold/30 transition-all shadow-sm">
                                    <div className="flex flex-col gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <button onClick={() => moveItem('inclusions', i, 'up')} className="p-0.5 hover:bg-midnight-navy/5 rounded text-midnight-navy/20 hover:text-midnight-navy">
                                            <ChevronUp className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => moveItem('inclusions', i, 'down')} className="p-0.5 hover:bg-midnight-navy/5 rounded text-midnight-navy/20 hover:text-midnight-navy">
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <CheckCircle2 className="w-3.5 h-3.5 mt-1 text-green-500 shrink-0" />
                                    <textarea
                                        value={inc}
                                        onChange={(e) => {
                                            const newList = [...(form.inclusions || [])];
                                            newList[i] = e.target.value;
                                            setForm({ ...form, inclusions: newList });
                                        }}
                                        rows={1}
                                        className="flex-1 bg-transparent border-none p-0 text-sm text-midnight-navy/70 resize-none h-auto focus:ring-0"
                                    />
                                    <button
                                        onClick={() => removeItem('inclusions', i)}
                                        className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 text-red-200 hover:text-red-500 rounded transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Exclusions</label>
                            <button
                                onClick={() => setForm({ ...form, exclusions: [...(form.exclusions || []), "New point..."] })}
                                className="p-1 hover:bg-midnight-navy/5 rounded text-midnight-navy/40 hover:text-midnight-navy"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.exclusions?.map((exc, i) => (
                                <div key={i} className="flex gap-3 group/item bg-white p-3 rounded-xl border border-midnight-navy/5 hover:border-midnight-navy/10 transition-all shadow-sm">
                                    <div className="flex flex-col gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <button onClick={() => moveItem('exclusions', i, 'up')} className="p-0.5 hover:bg-midnight-navy/5 rounded text-midnight-navy/20 hover:text-midnight-navy">
                                            <ChevronUp className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => moveItem('exclusions', i, 'down')} className="p-0.5 hover:bg-midnight-navy/5 rounded text-midnight-navy/20 hover:text-midnight-navy">
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <XCircle className="w-3.5 h-3.5 mt-1 text-red-400 shrink-0" />
                                    <textarea
                                        value={exc}
                                        onChange={(e) => {
                                            const newList = [...(form.exclusions || [])];
                                            newList[i] = e.target.value;
                                            setForm({ ...form, exclusions: newList });
                                        }}
                                        rows={1}
                                        className="flex-1 bg-transparent border-none p-0 text-sm text-midnight-navy/70 resize-none h-auto focus:ring-0"
                                    />
                                    <button
                                        onClick={() => removeItem('exclusions', i)}
                                        className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 text-red-200 hover:text-red-500 rounded transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-midnight-navy flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                Optional
                            </h3>
                            <button
                                onClick={() => setForm({ ...form, optional: [...(form.optional || []), "New optional addon..."] })}
                                className="p-1 hover:bg-midnight-navy/5 rounded text-midnight-navy/40 hover:text-midnight-navy"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.optional?.map((opt, i) => (
                                <div key={i} className="flex gap-3 group/item bg-white p-3 rounded-xl border border-midnight-navy/5 hover:border-midnight-navy/10 transition-all shadow-sm">
                                    <div className="flex flex-col gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <button onClick={() => moveItem('optional', i, 'up')} className="p-0.5 hover:bg-midnight-navy/5 rounded text-midnight-navy/20 hover:text-midnight-navy">
                                            <ChevronUp className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => moveItem('optional', i, 'down')} className="p-0.5 hover:bg-midnight-navy/5 rounded text-midnight-navy/20 hover:text-midnight-navy">
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="w-3.5 h-3.5 mt-1 rounded-full border border-midnight-navy/20 flex items-center justify-center shrink-0">
                                        <div className="w-1 h-1 bg-midnight-navy/40 rounded-full" />
                                    </div>
                                    <textarea
                                        value={opt}
                                        onChange={(e) => {
                                            const newList = [...(form.optional || [])];
                                            newList[i] = e.target.value;
                                            setForm({ ...form, optional: newList });
                                        }}
                                        rows={1}
                                        className="flex-1 bg-transparent border-none p-0 text-sm text-midnight-navy/70 resize-none h-auto focus:ring-0"
                                    />
                                    <button
                                        onClick={() => removeItem('optional', i)}
                                        className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 text-red-200 hover:text-red-500 rounded transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-serif font-bold text-midnight-navy mb-8 flex items-center gap-3">
                    <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                    Payment Logic
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Deposit Term</label>
                        <textarea
                            value={form.paymentTerms?.deposit}
                            onChange={(e) => setForm({ ...form, paymentTerms: { ...form.paymentTerms!, deposit: e.target.value } })}
                            rows={3}
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all text-sm leading-relaxed"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Final Payment Term</label>
                        <textarea
                            value={form.paymentTerms?.finalPayment}
                            onChange={(e) => setForm({ ...form, paymentTerms: { ...form.paymentTerms!, finalPayment: e.target.value } })}
                            rows={3}
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all text-sm leading-relaxed"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
