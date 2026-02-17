"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Brochure, ItineraryDay, PricingTier } from '@/types/brochure';
import {
    ArrowLeft,
    Save,
    Rocket,
    Plus,
    Trash2,
    GripVertical,
    Image as ImageIcon,
    Layout,
    List,
    DollarSign,
    CheckCircle2,
    XCircle,
    Info,
    Calendar,
    MapPin,
    Coffee,
    Utensils,
    Soup,
    ChevronDown,
    ChevronUp,
    Copy,
    Settings,
    AlertCircle,
    FileCheck,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Gatekeeper from '@/components/studio/Gatekeeper';

export default function StudioBuilder() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const brochureId = searchParams.get('id');

    const [loading, setLoading] = useState(brochureId ? true : false);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'itinerary' | 'pricing' | 'terms'>('details');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);


    // Builder State
    const [form, setForm] = useState<Partial<Brochure>>({
        title: "",
        slug: "",
        category: 'FIT',
        subtitle: "",
        summary: "",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
        city: [],
        highlights: [],
        itinerary: [],
        pricing: {
            title: "Package Pricing",
            tiers: [{ pax: "2-3 Pax", adultPrice: 0, childPriceWithBed: 0, childPriceNoBed: 0 }],
            surchargeNote: "Surcharge applies during peak periods.",
            displayColumns: ['adult', 'cwb', 'cnb']
        },
        inclusions: [],
        exclusions: [],
        optional: [],
        paymentTerms: {
            deposit: "50% non-refundable deposit required to secure booking.",
            finalPayment: "Final balance due 30 days prior to arrival."
        },
        tags: {
            type: "Private Tour",
            pax: "Min 2 Pax"
        },
        campaign_start: "",
        campaign_end: "",
        show_pricing: true
    });

    // PDF Generation Status
    const isPdfOutdated = brochureId && (
        !form.pdf_last_generated_at ||
        (form.updated_at && new Date(form.updated_at) > new Date(form.pdf_last_generated_at))
    );

    useEffect(() => {
        if (brochureId) {
            fetchBrochure();
        } else {
            // New package default day
            if (form.itinerary?.length === 0) {
                addDay();
            }
            fetchLatestPaymentTerms();
        }
    }, [brochureId]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!brochureId && !slugManuallyEdited && form.title) {
            const generatedSlug = form.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setForm(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [form.title, brochureId, slugManuallyEdited]);

    async function fetchLatestPaymentTerms() {
        try {
            const { data } = await supabase
                .from('brochures')
                .select('payment_terms')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data?.payment_terms) {
                setForm(prev => ({
                    ...prev,
                    paymentTerms: data.payment_terms
                }));
            }
        } catch (err) {
            console.log("No previous payment terms found, using defaults.");
        }
    }

    async function fetchBrochure() {
        try {
            const { data, error } = await supabase
                .from('brochures')
                .select('*')
                .eq('id', brochureId)
                .single();

            if (data) {
                // Map snake_case from DB to camelCase for component state
                const mappedData: Partial<Brochure> = {
                    ...data,
                    optional: data.optional || [],
                    paymentTerms: data.payment_terms || {
                        deposit: "",
                        finalPayment: ""
                    }
                };
                setForm(mappedData);
            }
        } catch (err) {
            console.error("Error fetching brochure:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        setSaving(true);
        console.log("Studio: Commencing deployment for", brochureId || "new asset", form);

        try {
            // Explicitly construct the record to ensure no junk fields reach Supabase
            // and mapping camelCase to snake_case where required.
            const record: any = {
                title: form.title,
                slug: form.slug,
                category: form.category,
                summary: form.summary,
                subtitle: form.subtitle,
                image: form.image,
                city: form.city,
                highlights: form.highlights,
                itinerary: form.itinerary,
                pricing: form.pricing,
                inclusions: form.inclusions,
                exclusions: form.exclusions,
                optional: form.optional,
                tags: form.tags,
                payment_terms: form.paymentTerms,
                campaign_start: form.campaign_start || null,
                campaign_end: form.campaign_end || null,
                show_pricing: form.show_pricing ?? true,
                is_archived: false // Explicitly restore/ensure active when deploying from Studio
            };

            if (brochureId) {
                const { error } = await supabase
                    .from('brochures')
                    .update(record)
                    .eq('id', brochureId);

                if (error) {
                    console.error("Studio Update Failed:", error);
                    alert(`Supabase Update Error: ${error.message} (${error.code})`);
                    throw error;
                }
            } else {
                // Primary Key generation for new Heritage Assets
                const newId = form.slug || `bespoke-${Date.now()}`;
                const { error } = await supabase
                    .from('brochures')
                    .insert([{ ...record, id: newId }]);

                if (error) {
                    console.error("Studio Insert Failed:", error);
                    alert(`Supabase Insert Error: ${error.message} (${error.code})`);
                    throw error;
                }
            }

            console.log("Studio: Deployment successful.");

            // Trigger background PDF regeneration for both Client and Agent versions
            // This happens in the background to avoid blocking the UI
            if (form.slug) {
                console.log("Studio: Triggering PDF regeneration for slug:", form.slug);
                fetch('/api/brochure/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug: form.slug })
                }).catch(err => console.error("PDF Regeneration Trigger Failed:", err));
            }

            alert("Heritage Asset Deployed & PDF Regeneration Triggered!");
            setShowPreview(false);
            window.location.href = '/manage-studio';
        } catch (err: any) {
            console.error("Studio Save Error Details:", {
                message: err?.message,
                details: err?.details,
                hint: err?.hint,
                code: err?.code
            });
            alert(`Failed to save: ${err?.message || "Unknown Studio Error"}`);
        } finally {
            setSaving(false);
        }
    };

    // Helper functions for dynamic lists
    const addDay = () => {
        const newDay: ItineraryDay = {
            day: (form.itinerary?.length || 0) + 1,
            title: "New Discovery",
            meals: "B / - / -",
            description: "",
            activities: []
        };
        setForm({ ...form, itinerary: [...(form.itinerary || []), newDay] });
    };

    const removeDay = (index: number) => {
        const newItinerary = [...(form.itinerary || [])];
        newItinerary.splice(index, 1);
        // Re-index days
        const reindexed = newItinerary.map((d, i) => ({ ...d, day: i + 1 }));
        setForm({ ...form, itinerary: reindexed });
    };

    const updateDay = (index: number, updates: Partial<ItineraryDay>) => {
        const newItinerary = [...(form.itinerary || [])];
        newItinerary[index] = { ...newItinerary[index], ...updates };
        setForm({ ...form, itinerary: newItinerary });
    };

    const addActivity = (dayIndex: number) => {
        const newItinerary = [...(form.itinerary || [])];
        newItinerary[dayIndex].activities.push({ icon: "MapPin", description: "Activity details..." });
        setForm({ ...form, itinerary: newItinerary });
    };

    const addPricingTier = () => {
        const newTiers = [...(form.pricing?.tiers || [])];
        newTiers.push({ pax: "", adultPrice: 0, childPriceWithBed: 0, childPriceNoBed: 0, singlePrice: 0, vehicle: "" });
        setForm({ ...form, pricing: { ...form.pricing!, tiers: newTiers } });
    };

    const updatePricingTier = (index: number, updates: Partial<PricingTier>) => {
        const newTiers = [...(form.pricing?.tiers || [])];
        // Ensure numbers are actually numbers or 0, avoiding NaN
        if ('adultPrice' in updates) updates.adultPrice = isNaN(updates.adultPrice as any) ? 0 : Number(updates.adultPrice);
        if ('childPriceWithBed' in updates) updates.childPriceWithBed = isNaN(updates.childPriceWithBed as any) ? 0 : Number(updates.childPriceWithBed);
        if ('childPriceNoBed' in updates) updates.childPriceNoBed = isNaN(updates.childPriceNoBed as any) ? 0 : Number(updates.childPriceNoBed);
        if ('singlePrice' in updates) updates.singlePrice = isNaN(updates.singlePrice as any) ? 0 : Number(updates.singlePrice);

        newTiers[index] = { ...newTiers[index], ...updates };
        setForm({ ...form, pricing: { ...form.pricing!, tiers: newTiers } });
    };

    // New helpers for reordering and removing items
    const moveItem = (listName: 'inclusions' | 'exclusions' | 'optional', index: number, direction: 'up' | 'down') => {
        const list = [...(form[listName] || [])];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= list.length) return;

        [list[index], list[newIndex]] = [list[newIndex], list[index]];
        setForm({ ...form, [listName]: list });
    };

    const removeItem = (listName: 'inclusions' | 'exclusions' | 'optional', index: number) => {
        const list = [...(form[listName] || [])];
        list.splice(index, 1);
        setForm({ ...form, [listName]: list });
    };

    if (loading) return (
        <div className="min-h-screen bg-midnight-navy flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-brushed-gold border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Initializing Creator Studio...</span>
            </div>
        </div>
    );

    return (
        <Gatekeeper>
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-midnight-navy">
                {/* Fixed Top Bar */}
                <header className="h-20 bg-white border-b border-midnight-navy/5 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        <Link href="/manage-studio" className="p-2 hover:bg-midnight-navy/5 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-midnight-navy" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-serif font-bold text-midnight-navy">
                                    {brochureId ? `Editing: ${form.title}` : "Create New Package"}
                                </h1>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${form.category === 'FIT' ? 'bg-midnight-navy text-white' :
                                    form.category === 'GIT' ? 'bg-brushed-gold text-midnight-navy' :
                                        'bg-[#C5A059] text-white'
                                    }`}>
                                    {form.category}
                                </span>
                            </div>
                            <p className="text-[10px] text-midnight-navy/40 font-bold uppercase tracking-widest">
                                {brochureId ? `STUDIO_ID: ${form.slug}` : "Drafting Active Assets"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowPreview(true)}
                            disabled={saving}
                            className="bg-midnight-navy text-white px-8 py-3 rounded-xl flex items-center gap-3 text-xs font-bold tracking-widest uppercase shadow-lg shadow-midnight-navy/20 hover:bg-midnight-navy/90 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : 'text-brushed-gold'}`} />
                            {saving ? "Deploying..." : (brochureId ? "Save Changes" : "Preview & Save")}
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar Navigation */}
                    <aside className="w-64 bg-white border-r border-midnight-navy/5 p-6 flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'details' ? 'bg-midnight-navy text-white shadow-lg shadow-midnight-navy/10' : 'text-midnight-navy/40 hover:bg-midnight-navy/5'}`}
                        >
                            <Layout className="w-4 h-4" />
                            General Info
                        </button>
                        <button
                            onClick={() => setActiveTab('itinerary')}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'itinerary' ? 'bg-midnight-navy text-white shadow-lg shadow-midnight-navy/10' : 'text-midnight-navy/40 hover:bg-midnight-navy/5'}`}
                        >
                            <Calendar className="w-4 h-4" />
                            Itinerary Blocks
                        </button>
                        <button
                            onClick={() => setActiveTab('pricing')}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'pricing' ? 'bg-midnight-navy text-white shadow-lg shadow-midnight-navy/10' : 'text-midnight-navy/40 hover:bg-midnight-navy/5'}`}
                        >
                            <DollarSign className="w-4 h-4" />
                            Pricing Matrix
                        </button>
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'terms' ? 'bg-midnight-navy text-white shadow-lg shadow-midnight-navy/10' : 'text-midnight-navy/40 hover:bg-midnight-navy/5'}`}
                        >
                            <List className="w-4 h-4" />
                            Inclusions & Terms
                        </button>

                        <div className="mt-auto p-4 bg-midnight-navy/5 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-3 h-3 text-midnight-navy/40" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-midnight-navy/40">Studio Tip</span>
                            </div>
                            <p className="text-[10px] text-midnight-navy/60 leading-relaxed font-serif italic">
                                Use high-resolution images and clear itinerary descriptions for better conversion.
                            </p>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-12 bg-[#fcfcfc]">
                        <div className="max-w-4xl mx-auto pb-24">

                            {/* TAB: General Info */}
                            {activeTab === 'details' && (
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
                            )}

                            {/* TAB: Itinerary */}
                            {activeTab === 'itinerary' && (
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
                            )}

                            {/* TAB: Pricing */}
                            {activeTab === 'pricing' && (
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
                                                                const isChecked = (form.pricing?.displayColumns || ['adult', 'cwb', 'cnb']).includes(col.id);
                                                                return (
                                                                    <label key={col.id} className="flex items-center gap-3 cursor-pointer group">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={() => {
                                                                                const current = form.pricing?.displayColumns || ['adult', 'cwb', 'cnb'];
                                                                                const next = current.includes(col.id)
                                                                                    ? current.filter(c => c !== col.id)
                                                                                    : [...current, col.id];
                                                                                if (next.length === 0) return; // Must show at least one
                                                                                setForm({ ...form, pricing: { ...form.pricing!, displayColumns: next } });
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
                            )}

                            {/* TAB: Terms */}
                            {activeTab === 'terms' && (
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
                            )}

                        </div>
                    </main>
                </div>

                {/* Preview Overlay Modal */}
                {showPreview && (
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
                )}
            </div>
        </Gatekeeper >
    );
}
