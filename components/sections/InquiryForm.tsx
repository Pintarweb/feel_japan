"use client";

import { ChevronDown, CheckCircle2, AlertCircle, User, PlaneTakeoff, MapPin, Wallet, BedDouble } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Brochure } from '@/types/brochure';

interface InquiryFormProps {
    brochures: Brochure[];
}

const COUNTRIES = [
    { code: "+60", label: "MY", iso: "my" },
    { code: "+65", label: "SG", iso: "sg" },
    { code: "+62", label: "ID", iso: "id" },
    { code: "+66", label: "TH", iso: "th" },
    { code: "+63", label: "PH", iso: "ph" },
    { code: "+84", label: "VN", iso: "vn" },
    { code: "+81", label: "JP", iso: "jp" },
    { code: "+1", label: "US", iso: "us" },
    { code: "+44", label: "UK", iso: "gb" },
    { code: "+61", label: "AU", iso: "au" },
];

const ROOM_CATEGORIES = [
    "Standard Room",
    "Superior Room",
    "Deluxe Room",
    "Executive Suite",
    "Japanese Traditional (Ryokan)",
    "Family Room",
    "Luxury Villa"
];

export default function InquiryForm({ brochures }: InquiryFormProps) {
    const searchParams = useSearchParams();
    const [selectedPackage, setSelectedPackage] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+60");
    const [phone, setPhone] = useState("");

    // Travel Details state
    const [adults, setAdults] = useState("2");
    const [children611, setChildren611] = useState("0");
    const [infantsUnder6, setInfantsUnder6] = useState("0");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [roomCategory, setRoomCategory] = useState("");
    const [placesOfVisit, setPlacesOfVisit] = useState("");
    const [estimatedBudget, setEstimatedBudget] = useState("");

    const [newsletterOptin, setNewsletterOptin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Validation states
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const pkg = searchParams.get('package');
        if (pkg) {
            setSelectedPackage(decodeURIComponent(pkg));
        }
    }, [searchParams]);

    const toTitleCase = (str: string) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatPhone = (val: string) => {
        const digits = val.replace(/\D/g, '');
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    };

    const validateField = (fieldName: string, value: string) => {
        let error = "";
        switch (fieldName) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
                break;
            case 'phone':
                if (value.length < 9) error = "Phone number too short";
                break;
            case 'agencyName':
            case 'name':
                if (value.length < 3) error = "Too short";
                break;
            case 'dateFrom':
            case 'dateTo':
                if (!value) error = "Required";
                break;
        }
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
        validateField(e.target.name, e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.values(errors).some(e => e !== "") || !agencyName || !name || !email || !phone || !dateFrom || !dateTo) {
            alert("Please check for errors in the form before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            const numAdults = parseInt(adults) || 0;
            const numChildren611 = parseInt(children611) || 0;
            const numInfantsUnder6 = parseInt(infantsUnder6) || 0;

            const payload = {
                agency_name: agencyName,
                name: name,
                email: email,
                phone: `${countryCode} ${phone}`,
                pax: numAdults + numChildren611 + numInfantsUnder6,
                adults: numAdults,
                children_6_11: numChildren611,
                infants_under_6: numInfantsUnder6,
                travel_dates: `${dateFrom} to ${dateTo}`,
                package_slug: selectedPackage,
                room_category: roomCategory,
                places_of_visit: placesOfVisit,
                estimated_budget: estimatedBudget,
                newsletter_optin: newsletterOptin
            };

            const response = await fetch('/api/inquire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit inquiry');
            }

            // Success State
            setIsSubmitted(true);

            // Note: We don't reset the form immediately so the data doesn't "flicker" out
            // but we could clear it if they want to submit another one via the Return button.
        } catch (error: any) {
            console.error('Error submitting inquiry:', error);
            alert("Error submitting request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStatus = (fieldName: string) => {
        if (!touched[fieldName]) return null;
        if (errors[fieldName]) return <AlertCircle className="w-4 h-4 text-red-500 animate-in fade-in zoom-in duration-300" />;
        return <CheckCircle2 className="w-4 h-4 text-green-500 animate-in fade-in zoom-in duration-300" />;
    };

    const inputClasses = (fieldName: string) => `
        w-full bg-white text-midnight-navy border rounded-lg px-4 py-4 
        focus:outline-none focus:ring-1 transition-all placeholder:text-midnight-navy/20
        ${touched[fieldName] && errors[fieldName] ? 'border-red-300 focus:ring-red-400' : 'border-midnight-navy/10 focus:ring-brushed-gold'}
    `;

    const selectedCountry = COUNTRIES.find(c => c.code === countryCode);

    if (isSubmitted) {
        return (
            <section id="inquiry-form" className="max-w-4xl mx-auto py-24 px-6">
                <div className="bg-white rounded-[3rem] border border-midnight-navy/5 shadow-2xl p-16 text-center animate-in fade-in zoom-in duration-700">
                    <div className="w-20 h-20 bg-brushed-gold/10 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle2 className="w-10 h-10 text-brushed-gold" />
                    </div>

                    <h2 className="text-4xl font-serif font-bold italic text-midnight-navy mb-6">Request Logged</h2>

                    <div className="max-w-md mx-auto space-y-6">
                        <p className="text-sm leading-relaxed text-midnight-navy/70">
                            Your bespoke travel architecture request has been successfully transmitted to our travel designers.
                        </p>

                        <div className="h-px w-12 bg-brushed-gold/30 mx-auto"></div>

                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-midnight-navy/40 leading-loose">
                            Due to high demand for curated itineraries, requests are processed in chronological order.
                            You will receive a formal response within 24-48 business hours.
                        </p>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setAgencyName(""); setName(""); setEmail(""); setPhone("");
                                setAdults("2"); setChildren611("0"); setInfantsUnder6("0");
                                setDateFrom(""); setDateTo(""); setRoomCategory(""); setPlacesOfVisit(""); setEstimatedBudget("");
                                setTouched({}); setErrors({});
                            }}
                            className="text-[10px] uppercase tracking-widest font-bold text-brushed-gold hover:text-midnight-navy transition-colors border-b border-brushed-gold/20 pb-1"
                        >
                            Log Another Request
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="inquire" className="bg-[#f5f5f5] px-8 py-16 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10 -mt-6">
            <div className="text-center mb-10">
                <h4 className="text-midnight-navy text-3xl font-serif font-bold mb-3 italic">B2B Agent Inquiry</h4>
                <p className="text-midnight-navy/50 text-xs tracking-[0.3em] uppercase mb-1">Request a Bespoke Corporate Itinerary</p>
                <div className="h-0.5 w-16 bg-brushed-gold mx-auto mt-4"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 max-w-2xl mx-auto">

                {/* Section 1: Personal Information */}
                <div>
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-midnight-navy/5">
                        <User className="w-5 h-5 text-brushed-gold" />
                        <h5 className="text-midnight-navy text-sm font-bold uppercase tracking-widest">Personal Information</h5>
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Agency Name</label>
                                {renderStatus('agencyName')}
                            </div>
                            <input
                                type="text"
                                name="agencyName"
                                required
                                value={agencyName}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    const val = toTitleCase(e.target.value);
                                    setAgencyName(val);
                                    if (touched.agencyName) validateField('agencyName', val);
                                }}
                                placeholder="Luxury Travels Co."
                                className={inputClasses('agencyName')}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Your Full Name</label>
                                    {renderStatus('name')}
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={name}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        const val = toTitleCase(e.target.value);
                                        setName(val);
                                        if (touched.name) validateField('name', val);
                                    }}
                                    placeholder="John Doe"
                                    className={inputClasses('name')}
                                />
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Email Address</label>
                                    {renderStatus('email')}
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={email}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (touched.email) validateField('email', e.target.value);
                                    }}
                                    placeholder="john@agency.com"
                                    className={inputClasses('email')}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Contact Number</label>
                                {renderStatus('phone')}
                            </div>
                            <div className="flex gap-0 shadow-sm rounded-lg overflow-hidden border border-midnight-navy/10 focus-within:ring-1 focus-within:ring-brushed-gold transition-all">
                                <div className="relative bg-[#f0f0f0] border-r border-midnight-navy/10 px-3 py-4 flex items-center gap-1.5 cursor-pointer hover:bg-gray-200 transition-colors">
                                    {selectedCountry && (
                                        <img
                                            src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                                            alt={selectedCountry.label}
                                            className="w-5 h-auto object-contain rounded-[1px] shadow-sm"
                                        />
                                    )}
                                    <span className="text-sm font-bold text-midnight-navy/70">{countryCode}</span>
                                    <ChevronDown className="w-3 h-3 text-midnight-navy/40" />
                                    <select
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                    >
                                        {COUNTRIES.map(c => (
                                            <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={phone}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        const formatted = formatPhone(e.target.value);
                                        setPhone(formatted);
                                        if (touched.phone) validateField('phone', formatted);
                                    }}
                                    placeholder="12-345 6789"
                                    className="w-full bg-white text-midnight-navy border-none px-4 py-4 focus:outline-none placeholder:text-midnight-navy/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Travel Details */}
                <div>
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-midnight-navy/5">
                        <PlaneTakeoff className="w-5 h-5 text-brushed-gold" />
                        <h5 className="text-midnight-navy text-sm font-bold uppercase tracking-widest">Travel Details</h5>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative" onClick={(e) => (e.currentTarget.querySelector('input') as any)?.showPicker()}>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Travel From</label>
                                <input
                                    type="date"
                                    name="dateFrom"
                                    required
                                    value={dateFrom}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.preventDefault()}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className={inputClasses('dateFrom') + " cursor-pointer"}
                                />
                            </div>
                            <div className="relative" onClick={(e) => (e.currentTarget.querySelector('input') as any)?.showPicker()}>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Travel To</label>
                                <input
                                    type="date"
                                    name="dateTo"
                                    required
                                    value={dateTo}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.preventDefault()}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className={inputClasses('dateTo') + " cursor-pointer"}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Adults (12y+)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    name="adults"
                                    value={adults}
                                    onChange={(e) => setAdults(e.target.value)}
                                    className={inputClasses('adults')}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Children (6-11y)</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="children611"
                                    value={children611}
                                    onChange={(e) => setChildren611(e.target.value)}
                                    className={inputClasses('children611')}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Infants (Under 6y)</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="infantsUnder6"
                                    value={infantsUnder6}
                                    onChange={(e) => setInfantsUnder6(e.target.value)}
                                    className={inputClasses('infantsUnder6')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Brochure Selection</label>
                            <div className="relative">
                                <select
                                    value={selectedPackage}
                                    name="selectedPackage"
                                    onChange={(e) => setSelectedPackage(e.target.value)}
                                    className={inputClasses('selectedPackage') + " appearance-none cursor-pointer"}
                                >
                                    <option value="" disabled>Select a collection (Optional)</option>
                                    <option value="Corporate">Corporate Services</option>
                                    {brochures.map((b) => (
                                        <option key={b.id} value={b.slug}>[{b.category}] {b.title}</option>
                                    ))}
                                    <option value="custom">Custom Itinerary Request</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brushed-gold">
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5 ml-1">
                                    <BedDouble className="w-3 h-3 text-brushed-gold/60" />
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Room Category</label>
                                </div>
                                <div className="relative">
                                    <select
                                        name="roomCategory"
                                        value={roomCategory}
                                        onChange={(e) => setRoomCategory(e.target.value)}
                                        className={inputClasses('roomCategory') + " appearance-none cursor-pointer"}
                                    >
                                        <option value="">Select Category</option>
                                        {ROOM_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brushed-gold/40">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1.5 ml-1">
                                    <Wallet className="w-3 h-3 text-brushed-gold/60" />
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Est. Total Budget (MYR)</label>
                                </div>
                                <input
                                    type="text"
                                    name="estimatedBudget"
                                    value={estimatedBudget}
                                    onChange={(e) => setEstimatedBudget(e.target.value)}
                                    placeholder="e.g. 15,000"
                                    className={inputClasses('estimatedBudget')}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1.5 ml-1">
                                <MapPin className="w-3 h-3 text-brushed-gold/60" />
                                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Tentative Places of Visit</label>
                            </div>
                            <textarea
                                name="placesOfVisit"
                                value={placesOfVisit}
                                onChange={(e) => setPlacesOfVisit(e.target.value)}
                                placeholder="List cities or landmarks (e.g. Tokyo, Kyoto, Mt. Fuji...)"
                                rows={3}
                                className={inputClasses('placesOfVisit') + " py-3 resize-none"}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white/50 p-6 rounded-2xl border border-midnight-navy/5 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="flex items-center h-5">
                            <input
                                id="newsletter-optin"
                                name="newsletter-optin"
                                type="checkbox"
                                checked={newsletterOptin}
                                onChange={(e) => setNewsletterOptin(e.target.checked)}
                                className="h-6 w-6 rounded border-midnight-navy/20 text-brushed-gold focus:ring-brushed-gold accent-brushed-gold cursor-pointer"
                            />
                        </div>
                        <label htmlFor="newsletter-optin" className="text-[11px] leading-relaxed text-midnight-navy/70 font-medium">
                            I wish to receive updates on new luxury brochure releases, exclusive B2B corporate itineraries, and special agent-only seasonal offers.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brushed-gold text-white py-5 rounded-xl text-sm font-bold tracking-[0.2em] uppercase shadow-2xl shadow-brushed-gold/30 hover:shadow-brushed-gold/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Processing Submission...' : 'Send B2B Service Request'}
                    </button>
                    <p className="text-[10px] text-center text-midnight-navy/30 uppercase tracking-widest mt-4">
                        Secure B2B Portal • 24h Response Guarantee
                    </p>
                </div>
            </form>
        </section>
    );
}






