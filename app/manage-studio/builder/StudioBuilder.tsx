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

import GeneralInfoTab from '@/components/studio/builder/GeneralInfoTab';
import ItineraryTab from '@/components/studio/builder/ItineraryTab';
import PricingTab from '@/components/studio/builder/PricingTab';
import TermsTab from '@/components/studio/builder/TermsTab';
import PreviewModal from '@/components/studio/builder/PreviewModal';

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
            finalPayment: "1 month before arrival"
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
                                <GeneralInfoTab
                                    form={form}
                                    setForm={setForm}
                                    setSlugManuallyEdited={setSlugManuallyEdited}
                                />
                            )}

                            {/* TAB: Itinerary */}
                            {activeTab === 'itinerary' && (
                                <ItineraryTab
                                    form={form}
                                    setForm={setForm}
                                    addDay={addDay}
                                    removeDay={removeDay}
                                    updateDay={updateDay}
                                    addActivity={addActivity}
                                />
                            )}

                            {/* TAB: Pricing */}
                            {activeTab === 'pricing' && (
                                <PricingTab
                                    form={form}
                                    setForm={setForm}
                                    addPricingTier={addPricingTier}
                                    updatePricingTier={updatePricingTier}
                                    showColumnDropdown={showColumnDropdown}
                                    setShowColumnDropdown={setShowColumnDropdown}
                                />
                            )}

                            {/* TAB: Terms */}
                            {activeTab === 'terms' && (
                                <TermsTab
                                    form={form}
                                    setForm={setForm}
                                    moveItem={moveItem}
                                    removeItem={removeItem}
                                />
                            )}

                        </div>
                    </main>
                </div>

                {/* Preview Overlay Modal */}
                {showPreview && (
                    <PreviewModal
                        form={form}
                        brochureId={brochureId}
                        saving={saving}
                        isPdfOutdated={!!isPdfOutdated}
                        setShowPreview={setShowPreview}
                        handleSave={handleSave}
                    />
                )}
            </div>
        </Gatekeeper >
    );
}
