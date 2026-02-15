"use client";

import { ChevronDown, CheckCircle2, ShieldCheck, AlertCircle, PlaneTakeoff, MapPin, Wallet, BedDouble, Loader2, UserCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Brochure } from '@/types/brochure';

interface InquiryFormProps {
    brochures: Brochure[];
    isAgent?: boolean;
    agentProfile?: any;
}

const ROOM_CATEGORIES = [
    "Standard Room",
    "Superior Room",
    "Deluxe Room",
    "Executive Suite",
    "Japanese Traditional (Ryokan)",
    "Family Room",
    "Luxury Villa"
];

export default function InquiryForm({ brochures, isAgent = false, agentProfile }: InquiryFormProps) {
    const searchParams = useSearchParams();
    const [selectedPackage, setSelectedPackage] = useState("");

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

    // Agent / Contact State
    const [agencyName, setAgencyName] = useState(agentProfile?.agency_name || "");
    const [licenseNumber, setLicenseNumber] = useState(agentProfile?.license_number || "");
    const [fullName, setFullName] = useState(agentProfile?.full_name || "");
    const [email, setEmail] = useState(agentProfile?.email || "");
    const [countryCode, setCountryCode] = useState("+60");
    const [phoneNumber, setPhoneNumber] = useState(agentProfile?.phone || "");

    const COUNTRY_CODES = [
        { code: "+60", iso: "my", name: "Malaysia" },
        { code: "+65", iso: "sg", name: "Singapore" },
        { code: "+62", iso: "id", name: "Indonesia" },
        { code: "+66", iso: "th", name: "Thailand" },
        { code: "+673", iso: "bn", name: "Brunei" },
        { code: "+81", iso: "jp", name: "Japan" },
        { code: "+1", iso: "us", name: "USA" },
        { code: "+44", iso: "gb", name: "UK" },
        { code: "+61", iso: "au", name: "Australia" },
        { code: "+86", iso: "cn", name: "China" },
    ];

    const capitalizeWords = (str: string) => {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleCapitalizeBlur = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setter(capitalizeWords(value));
    };

    useEffect(() => {
        const pkg = searchParams.get('package');
        if (pkg) {
            setSelectedPackage(decodeURIComponent(pkg));
        }
    }, [searchParams]);

    const validateField = (fieldName: string, value: string) => {
        let error = "";
        switch (fieldName) {
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

        setIsSubmitting(true);

        try {
            const numAdults = parseInt(adults) || 0;
            const numChildren611 = parseInt(children611) || 0;
            const numInfantsUnder6 = parseInt(infantsUnder6) || 0;

            const payload = {
                pax: numAdults + numChildren611 + numInfantsUnder6,
                adults: numAdults,
                children_6_11: numChildren611,
                infants_under_6: numInfantsUnder6,
                travel_dates: `${dateFrom} to ${dateTo}`,
                package_slug: selectedPackage,
                room_category: roomCategory,
                places_of_visit: placesOfVisit,
                estimated_budget: estimatedBudget,
                newsletter_optin: newsletterOptin,
                // Guest details (will be ignored by API if logged in)
                // Guest details
                guest_full_name: fullName,
                guest_email: email,
                guest_agency_name: agencyName,
                guest_license_number: licenseNumber,
                guest_phone: `${countryCode} ${phoneNumber}`
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

    if (isSubmitted) {
        return (
            <section id="inquiry-form" className="max-w-4xl mx-auto py-24 px-6">
                <div
                    className="bg-white rounded-[3rem] border border-midnight-navy/5 shadow-2xl p-16 text-center animate-in fade-in zoom-in duration-700"
                    data-umami-event="inquiry-success"
                >
                    <div className="w-20 h-20 bg-brushed-gold/10 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle2 className="w-10 h-10 text-brushed-gold" />
                    </div>

                    <h2 className="text-4xl font-serif font-bold italic text-midnight-navy mb-6">Request Logged</h2>

                    <div className="max-w-md mx-auto space-y-6">
                        <p className="text-sm leading-relaxed text-midnight-navy/70">
                            Your bespoke travel architecture request has been successfully transmitted to our travel designers.
                        </p>

                        <div className="h-px w-12 bg-brushed-gold/30 mx-auto"></div>

                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-midnight-navy/70 leading-loose">
                            Due to high demand for curated itineraries, requests are processed in chronological order.
                            You will receive a formal response within 24-48 business hours.
                        </p>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
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
        <section id="inquire" className="px-4 py-8 md:py-16 relative z-10 -mt-6">
            <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden grid md:grid-cols-12">

                {/* Visual Side (Concierge Vibe) */}
                <div className="md:col-span-4 relative min-h-[300px] md:min-h-full bg-midnight-navy">
                    <img
                        src="/images/inquiry_form_image.jpeg"
                        alt="Concierge Service"
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-10 z-10">
                        <UserCheck className="w-12 h-12 text-brushed-gold mb-6" />
                        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 italic">Here to Assist.</h2>
                        <p className="text-white/80 text-sm leading-relaxed font-light">
                            Our team of travel designers acts as your personal concierge, ensuring every detail of your Japanese journey is meticulously crafted.
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:col-span-8 p-8 md:p-12 lg:p-16">
                    <div className="mb-10">
                        <span className="text-brushed-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">B2B Portal</span>
                        <h1 className="text-3xl md:text-4xl font-serif text-midnight-navy font-bold">Start Your Bespoke Journey</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">


                        {/* Contact Information (Section 1) */}
                        <div>
                            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-midnight-navy/5">
                                <UserCheck className="w-5 h-5 text-brushed-gold" />
                                <h5 className="text-midnight-navy text-sm font-bold uppercase tracking-widest">Partner Contact & Agency Details</h5>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Agency Name</label>
                                    <input
                                        type="text"
                                        name="agencyName"
                                        required
                                        value={agencyName}
                                        onChange={(e) => setAgencyName(e.target.value)}
                                        onBlur={(e) => handleCapitalizeBlur(setAgencyName, e.target.value)}
                                        className={inputClasses('agencyName')}
                                        placeholder="e.g. Travel With Style Sdn Bhd"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Travel License (MOTAC)</label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        required
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                                        className={inputClasses('licenseNumber')}
                                        placeholder="e.g. KPK/LN 1234"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        onBlur={(e) => handleCapitalizeBlur(setFullName, e.target.value)}
                                        className={inputClasses('fullName')}
                                        placeholder="e.g. Sarah Ahmad"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Contact Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClasses('email')}
                                        placeholder="e.g. sarah@travelwithstyle.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Phone Number</label>
                                    <div className="flex gap-2">
                                        <div className="relative w-44 flex-shrink-0">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center">
                                                <img
                                                    src={`https://flagcdn.com/w40/${COUNTRY_CODES.find(c => c.code === countryCode)?.iso}.png`}
                                                    srcSet={`https://flagcdn.com/w80/${COUNTRY_CODES.find(c => c.code === countryCode)?.iso}.png 2x`}
                                                    width="24"
                                                    height="16"
                                                    alt="Flag"
                                                    className="rounded-[2px] object-cover shadow-sm border border-black/10"
                                                />
                                            </div>
                                            <select
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}
                                                className="w-full bg-white text-midnight-navy border border-midnight-navy/10 rounded-lg pl-12 pr-8 py-4 appearance-none focus:outline-none focus:ring-1 focus:ring-brushed-gold cursor-pointer text-sm"
                                            >
                                                {COUNTRY_CODES.map((c) => (
                                                    <option key={c.code} value={c.code}>
                                                        {c.code} ({c.name})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-midnight-navy/50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\D/g, "");
                                                let formattedValue = rawValue;
                                                if (rawValue.length > 2) {
                                                    formattedValue = `${rawValue.slice(0, 2)} - ${rawValue.slice(2)}`;
                                                }
                                                if (rawValue.length > 6) {
                                                    formattedValue = `${rawValue.slice(0, 2)} - ${rawValue.slice(2, 6)} ${rawValue.slice(6, 11)}`;
                                                }
                                                setPhoneNumber(formattedValue);
                                            }}
                                            className={inputClasses('phone')}
                                            placeholder="12 - 3456 789"
                                            maxLength={15}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Travel Details Section (Now Section 1) */}
                        <div>
                            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-midnight-navy/5">
                                <PlaneTakeoff className="w-5 h-5 text-brushed-gold" />
                                <h5 className="text-midnight-navy text-sm font-bold uppercase tracking-widest">Travel Architecture Details</h5>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="relative" onClick={(e) => (e.currentTarget.querySelector('input') as any)?.showPicker()}>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Travel From</label>
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
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Travel To</label>
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
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Adults (12y+)</label>
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
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Children (6-11y)</label>
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
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Infants (Under 6y)</label>
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
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70 mb-1.5 ml-1">Brochure Selection</label>
                                    <div className="relative">
                                        <select
                                            value={selectedPackage}
                                            name="selectedPackage"
                                            onChange={(e) => setSelectedPackage(e.target.value)}
                                            className={inputClasses('selectedPackage') + " appearance-none cursor-pointer"}
                                            data-umami-event="brochure-selection"
                                            data-umami-event-package={selectedPackage}
                                        >
                                            <option value="" disabled>Select a package (Optional)</option>
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
                                            <BedDouble className="w-3 h-3 text-brushed-gold/85" />
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70">Room Category</label>
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
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brushed-gold/70">
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5 ml-1">
                                            <Wallet className="w-3 h-3 text-brushed-gold/85" />
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70">Est. Total Budget (MYR)</label>
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
                                        <MapPin className="w-3 h-3 text-brushed-gold/85" />
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/70">Tentative Places of Visit</label>
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
                                className="w-full bg-brushed-gold text-white py-5 rounded-xl text-sm font-bold tracking-[0.2em] uppercase shadow-2xl shadow-brushed-gold/30 hover:shadow-brushed-gold/70 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                data-umami-event="submit-inquiry-form"
                            >
                                {isSubmitting ? 'Processing Submission...' : 'Submit Trip Design Request'}
                            </button>

                            {/* PDPA Statement */}
                            <div className="flex items-start gap-3 pt-4 border-t border-midnight-navy/5">
                                <ShieldCheck className="w-4 h-4 text-midnight-navy/30 flex-shrink-0" />
                                <p className="text-[10px] text-midnight-navy/40 leading-tight">
                                    <strong>Data Protection Notice:</strong> By submitting this form, you acknowledge and consent to our collection, processing, and storage of your personal data in accordance with the <strong>Personal Data Protection Act 2010 (PDPA)</strong>. Your information is used solely for the purpose of facilitating your travel inquiry and will be treated with strict confidentiality.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
