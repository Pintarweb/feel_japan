import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Brochure } from '@/types/brochure';

interface GeneralInfoTabProps {
    form: Partial<Brochure>;
    setForm: React.Dispatch<React.SetStateAction<Partial<Brochure>>>;
    setSlugManuallyEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GeneralInfoTab({ form, setForm, setSlugManuallyEdited }: GeneralInfoTabProps) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <h2 className="text-xl font-serif font-bold text-midnight-navy mb-8 flex items-center gap-3">
                    <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                    Identity & Display
                </h2>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Package Title</label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. Classic Golden Route"
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-serif italic text-lg shadow-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Unique Slug (ID)</label>
                        <input
                            value={form.slug}
                            onChange={(e) => {
                                setSlugManuallyEdited(true);
                                setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
                            }}
                            placeholder="classic-golden-route"
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-mono text-sm shadow-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all shadow-sm font-bold text-xs tracking-widest uppercase"
                        >
                            <option value="FIT">FIT (Bespoke)</option>
                            <option value="GIT">GIT (Group)</option>
                            <option value="Seasonal">Seasonal (Festive)</option>
                            <option value="Corporate">Corporate (MICE)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Hero Image URL</label>
                        <div className="relative">
                            <ImageIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-midnight-navy/30" />
                            <input
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                placeholder="Unsplash URL"
                                className="w-full bg-white border border-midnight-navy/10 rounded-xl pl-11 pr-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all text-xs shadow-sm mb-2"
                            />
                        </div>
                        {form.image && (
                            <div className="mt-2 relative h-32 w-full rounded-xl overflow-hidden border border-midnight-navy/5 bg-midnight-navy/5">
                                <img
                                    src={form.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-midnight-navy/20">Live Preview</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-serif font-bold text-midnight-navy mb-8 flex items-center gap-3">
                    <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                    Campaign & Availability
                </h2>
                <p className="text-[10px] text-midnight-navy/40 mb-6 font-medium italic -mt-6 ml-4">By default, offers are "forever". Set dates to auto-archive upon expiry.</p>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Campaign Start Date</label>
                        <input
                            type="date"
                            value={form.campaign_start || ''}
                            onChange={(e) => setForm({ ...form, campaign_start: e.target.value })}
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-medium text-sm shadow-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Campaign End Date</label>
                        <input
                            type="date"
                            value={form.campaign_end || ''}
                            onChange={(e) => setForm({ ...form, campaign_end: e.target.value })}
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-medium text-sm shadow-sm"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-serif font-bold text-midnight-navy mb-8 flex items-center gap-3">
                    <div className="h-4 w-1 bg-brushed-gold rounded-full"></div>
                    Marketing Content
                </h2>
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Subtitle / Catchphrase</label>
                        <input
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            placeholder="A journey through history..."
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-medium text-sm shadow-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Featured Cities (Comma separated)</label>
                        <input
                            value={Array.isArray(form.city) ? form.city.join(', ') : (form.city || '')}
                            onChange={(e) => setForm({ ...form, city: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="Tokyo, Kyoto, Osaka"
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-medium text-sm shadow-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Tour Highlights (Comma separated)</label>
                        <input
                            value={Array.isArray(form.highlights) ? form.highlights.join(', ') : (form.highlights || '')}
                            onChange={(e) => setForm({ ...form, highlights: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="Private Geisha Dinner, Bullet Train, Mt. Fuji View"
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-medium text-sm shadow-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-midnight-navy/40 ml-1">Summary Overview</label>
                        <textarea
                            value={form.summary}
                            onChange={(e) => setForm({ ...form, summary: e.target.value })}
                            rows={4}
                            placeholder="Describe the essence of this tour..."
                            className="w-full bg-white border border-midnight-navy/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brushed-gold/30 transition-all font-serif text-base shadow-sm leading-relaxed"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
