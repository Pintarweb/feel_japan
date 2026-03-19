import React from 'react';
import { XCircle, AlertCircle, FileCheck, Calendar, CheckCircle2, Save } from 'lucide-react';
import { Brochure } from '@/types/brochure';

interface PreviewModalProps {
    form: Partial<Brochure>;
    brochureId: string | null;
    saving: boolean;
    isPdfOutdated: boolean | "" | null | undefined;
    setShowPreview: (show: boolean) => void;
    handleSave: () => void;
}

export default function PreviewModal({
    form,
    brochureId,
    saving,
    isPdfOutdated,
    setShowPreview,
    handleSave,
}: PreviewModalProps) {
    return (
        <div className="fixed inset-0 z-[100] bg-midnight-navy/95 backdrop-blur-sm flex items-center justify-center p-8 overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative">
                {/* Modal Header */}
                <div className="bg-midnight-navy p-8 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-serif font-bold italic">Heritage Asset Preview</h2>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-brushed-gold font-bold">Review and confirm deployment to heritage database</p>
                    </div>
                    <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* PDF Status Notice */}
                {isPdfOutdated && (
                    <div className="bg-amber-50 border-y border-amber-200 px-8 py-3 flex items-center justify-between animate-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900">
                                PDF Outdated: Changes detected since last generation ({form.pdf_last_generated_at ? new Date(form.pdf_last_generated_at).toLocaleDateString() : 'Never Generated'})
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-medium text-amber-700/60 italic">
                                Run `npx tsx .agent/skills/brochure-capture/scripts/capture.ts --force` after saving
                            </span>
                        </div>
                    </div>
                )}

                {!isPdfOutdated && brochureId && (
                    <div className="bg-emerald-50 border-y border-emerald-200 px-8 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-500">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900">
                            PDF Integrated: File in Supabase matches current version
                        </span>
                    </div>
                )}

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-12 bg-[#fcfcfc]">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* Hero Section Preview */}
                        <div className="relative h-[400px] rounded-[2rem] overflow-hidden shadow-xl">
                            <img src={form.image} alt={form.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy via-midnight-navy/20 to-transparent opacity-90"></div>
                            <div className="absolute bottom-12 left-12 right-12">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-3 py-1 bg-brushed-gold text-midnight-navy text-[10px] font-bold uppercase tracking-widest rounded-full">{form.category}</span>
                                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                        {form.itinerary?.length} Days • {Array.isArray(form.city) ? form.city.join(', ') : form.city}
                                    </span>
                                </div>
                                <h1 className="text-5xl font-serif font-bold text-white mb-2 italic">{form.title}</h1>
                                <p className="text-white/60 text-lg font-serif italic">{form.subtitle}</p>
                            </div>
                        </div>

                        {/* Campaign Lifecycle Verification */}
                        <div className="bg-white p-8 rounded-[2rem] border border-midnight-navy/5 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-midnight-navy/5 rounded-2xl">
                                    <Calendar className="w-6 h-6 text-midnight-navy/40" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-midnight-navy uppercase tracking-widest mb-1">Campaign Lifecycle</h3>
                                    <p className="text-[10px] text-midnight-navy/40 font-bold uppercase tracking-[0.2em]">Automated Availability Period</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-12">
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/30 block mb-1">Commencement</span>
                                    <span className="text-sm font-bold text-midnight-navy">{form.campaign_start ? new Date(form.campaign_start).toLocaleDateString() : 'IMMEDIATE / FOREVER'}</span>
                                </div>
                                <div className="h-8 w-px bg-midnight-navy/5"></div>
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/30 block mb-1">Completion</span>
                                    <span className="text-sm font-bold text-midnight-navy">{form.campaign_end ? new Date(form.campaign_end).toLocaleDateString() : 'IMMEDIATE / FOREVER'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary & Highlights Preview */}
                        <div className="grid grid-cols-3 gap-12">
                            <div className="col-span-2 space-y-6">
                                <h3 className="text-xl font-serif font-bold border-b border-midnight-navy/10 pb-4">Tour Overview</h3>
                                <p className="text-midnight-navy/70 leading-relaxed font-serif text-lg">{form.summary}</p>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xl font-serif font-bold border-b border-midnight-navy/10 pb-4">Key Highlights</h3>
                                <ul className="space-y-3">
                                    {form.highlights?.map((h, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-brushed-gold shrink-0 mt-1" />
                                            <span className="text-sm font-medium text-midnight-navy/80">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Pricing Table Preview */}
                        <div className="bg-midnight-navy/5 p-10 rounded-[2.5rem] border border-midnight-navy/10 overflow-hidden">
                            <h3 className="text-xl font-serif font-bold text-center mb-8 uppercase tracking-widest">Pricing Structure</h3>
                            <div className="w-full overflow-hidden rounded-2xl border border-midnight-navy/10 bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-midnight-navy text-white">
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em]">Group Size</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-right">Adult Price</th>
                                            {form.pricing?.tiers.some(t => (t.childPriceWithBed ?? 0) > 0) && (
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-right">Child (Bed)</th>
                                            )}
                                            {form.pricing?.tiers.some(t => (t.childPriceNoBed ?? 0) > 0) && (
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-right">Child (No Bed)</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-midnight-navy/5">
                                        {form.pricing?.tiers.map((t, i) => (
                                            <tr key={i} className="hover:bg-midnight-navy/5 transition-colors">
                                                <td className="px-6 py-4 text-sm font-bold text-midnight-navy">{t.pax}</td>
                                                <td className="px-6 py-4 text-sm font-serif font-bold text-midnight-navy text-right">
                                                    <span className="text-brushed-gold mr-1">¥</span>
                                                    {t.adultPrice.toLocaleString()}
                                                </td>
                                                {form.pricing?.tiers.some(tier => (tier.childPriceWithBed ?? 0) > 0) && (
                                                    <td className="px-6 py-4 text-sm font-serif font-bold text-midnight-navy/60 text-right">
                                                        {t.childPriceWithBed ? (
                                                            <>
                                                                <span className="text-brushed-gold/60 mr-1">¥</span>
                                                                {t.childPriceWithBed.toLocaleString()}
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                )}
                                                {form.pricing?.tiers.some(tier => (tier.childPriceNoBed ?? 0) > 0) && (
                                                    <td className="px-6 py-4 text-sm font-serif font-bold text-midnight-navy/60 text-right">
                                                        {t.childPriceNoBed ? (
                                                            <>
                                                                <span className="text-brushed-gold/60 mr-1">¥</span>
                                                                {t.childPriceNoBed.toLocaleString()}
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {form.pricing?.surchargeNote && (
                                <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 text-center italic">
                                    {form.pricing.surchargeNote}
                                </p>
                            )}
                        </div>

                        {/* Itinerary Preview */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-serif font-bold border-b border-midnight-navy/10 pb-4">Itinerary Architecture</h3>
                            <div className="space-y-4">
                                {form.itinerary?.map((day, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-midnight-navy/5 shadow-sm">
                                        <div className="flex gap-4">
                                            <span className="text-brushed-gold font-serif text-2xl">Day {day.day}</span>
                                            <div>
                                                <h4 className="text-sm font-bold text-midnight-navy uppercase tracking-wide">{day.title}</h4>
                                                <p className="text-[10px] text-midnight-navy/40 font-bold uppercase tracking-widest mb-3">{day.meals}</p>
                                                <div className="space-y-2">
                                                    {day.activities?.map((act, ai) => (
                                                        <div key={ai} className="text-xs text-midnight-navy/70 flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brushed-gold mt-1 shrink-0"></div>
                                                            <span>{act.description}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-xl font-serif font-bold border-b border-midnight-navy/10 pb-4">Inclusions</h3>
                                <ul className="space-y-2">
                                    {form.inclusions?.map((item, i) => (
                                        <li key={i} className="text-xs text-midnight-navy/70 flex gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xl font-serif font-bold border-b border-midnight-navy/10 pb-4">Exclusions</h3>
                                <ul className="space-y-2">
                                    {form.exclusions?.map((item, i) => (
                                        <li key={i} className="text-xs text-midnight-navy/70 flex gap-2">
                                            <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Optional arrangements (Relocated after Exclusions) */}
                        {form.optional && form.optional.length > 0 && (
                            <div className="bg-[#fcfcfc] p-10 rounded-[2.5rem] border-2 border-dashed border-midnight-navy/5">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-midnight-navy/60 mb-8 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brushed-gold"></div>
                                    Optional Arrangements Preview
                                </h3>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                    {form.optional.map((item, i) => (
                                        <div key={i} className="flex gap-4 text-xs font-medium text-midnight-navy/70 leading-relaxed">
                                            <span className="text-brushed-gold font-bold text-lg leading-none">+</span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Terms */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-serif font-bold border-b border-midnight-navy/10 pb-4">Payment Terms</h3>
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/40 block mb-1">Deposit</span>
                                    <p className="text-xs text-midnight-navy/70 leading-relaxed italic">{form.paymentTerms?.deposit}</p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/40 block mb-1">Final Payment</span>
                                    <p className="text-xs text-midnight-navy/70 leading-relaxed italic">{form.paymentTerms?.finalPayment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer (Action Buttons) - correctly nested inside flex-col box */}
                <div className="p-8 bg-white border-t border-midnight-navy/5 flex justify-center gap-6 shrink-0">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="px-12 py-4 rounded-xl border-2 border-midnight-navy text-midnight-navy text-xs font-bold uppercase tracking-widest hover:bg-midnight-navy/5 transition-all"
                    >
                        Refine Details
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-16 py-4 rounded-xl bg-midnight-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-midnight-navy/90 shadow-xl shadow-midnight-navy/20 flex items-center gap-3 transition-all hover:-translate-y-1 disabled:opacity-50"
                    >
                        <Save className={`w-4 h-4 ${saving ? 'animate-pulse text-white/50' : 'text-brushed-gold'}`} />
                        {saving ? "Deploying Asset..." : "Confirm & Deploy Asset"}
                    </button>
                </div>
            </div>
        </div>
    );
}
