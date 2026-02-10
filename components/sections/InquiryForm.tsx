"use client";

import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
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

export default function InquiryForm({ brochures }: InquiryFormProps) {
    const searchParams = useSearchParams();
    const [selectedPackage, setSelectedPackage] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+60");
    const [phone, setPhone] = useState("");
    const [pax, setPax] = useState("2");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [newsletterOptin, setNewsletterOptin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation states
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const pkg = searchParams.get('package');
        if (pkg) {
            setSelectedPackage(decodeURIComponent(pkg));
        }
    }, [searchParams]);

    // Helper: Title Case
    const toTitleCase = (str: string) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Helper: Phone Formatter (Auto '-' and ' ')
    // Targeting Malaysian style: XX-XXXX XXXX
    const formatPhone = (val: string) => {
        const digits = val.replace(/\D/g, '');
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    };

    // Validation logic
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

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const { error } = await supabase.from('inquiries').insert({
                agency_name: agencyName,
                name: name,
                email: email,
                phone: `${countryCode} ${phone}`,
                pax: parseInt(pax) || 0,
                travel_dates: `${dateFrom} to ${dateTo}`,
                package_slug: selectedPackage,
                newsletter_optin: newsletterOptin
            });

            if (error) throw error;

            alert("Thank you! Your inquiry has been received. We will contact you shortly.");
            setAgencyName(""); setName(""); setEmail(""); setPhone(""); setPax("2"); setDateFrom(""); setDateTo("");
            setTouched({}); setErrors({});
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
        focus:outline-none focus:ring-1 transition-all placeholder:text-midnight-navy/20 cursor-pointer
        ${touched[fieldName] && errors[fieldName] ? 'border-red-300 focus:ring-red-400' : 'border-midnight-navy/10 focus:ring-brushed-gold'}
    `;

    const selectedCountry = COUNTRIES.find(c => c.code === countryCode);

    return (
        <section id="inquire" className="bg-[#f5f5f5] px-8 py-16 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10 -mt-6">
            <div className="text-center mb-10">
                <h4 className="text-midnight-navy text-2xl font-serif font-bold mb-3">Request a Custom Quote</h4>
                <p className="text-midnight-navy/60 text-xs tracking-widest uppercase mb-1">B2B Agent Inquiry</p>
                <div className="h-0.5 w-12 bg-brushed-gold mx-auto"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
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
                        className={inputClasses('agencyName').replace('cursor-pointer', '')}
                    />
                    {touched.agencyName && errors.agencyName && <span className="absolute -bottom-5 left-1 text-[9px] text-red-500 font-bold uppercase">{errors.agencyName}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <div className="flex justify-between items-center mb-1.5 ml-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Full Name</label>
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
                            className={inputClasses('name').replace('cursor-pointer', '')}
                        />
                        {touched.name && errors.name && <span className="absolute -bottom-5 left-1 text-[9px] text-red-500 font-bold uppercase">{errors.name}</span>}
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
                            className={inputClasses('email').replace('cursor-pointer', '')}
                        />
                        {touched.email && errors.email && <span className="absolute -bottom-5 left-1 text-[9px] text-red-500 font-bold uppercase">{errors.email}</span>}
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40">Phone Number</label>
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
                    {touched.phone && errors.phone && <span className="absolute -bottom-5 left-1 text-[9px] text-red-500 font-bold uppercase">{errors.phone}</span>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="relative" onClick={(e) => (e.currentTarget.querySelector('input') as any)?.showPicker()}>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Traveling From</label>
                        <input
                            type="date"
                            name="dateFrom"
                            required
                            value={dateFrom}
                            onBlur={handleBlur}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className={inputClasses('dateFrom')}
                        />
                    </div>
                    <div className="relative" onClick={(e) => (e.currentTarget.querySelector('input') as any)?.showPicker()}>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Traveling To</label>
                        <input
                            type="date"
                            name="dateTo"
                            required
                            value={dateTo}
                            onBlur={handleBlur}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) => setDateTo(e.target.value)}
                            className={inputClasses('dateTo')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Pax</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={pax}
                            onChange={(e) => setPax(e.target.value)}
                            className={inputClasses('pax').replace('cursor-pointer', '')}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-midnight-navy/40 mb-1.5 ml-1">Brochure Selection</label>
                        <div className="relative">
                            <select
                                value={selectedPackage}
                                onChange={(e) => setSelectedPackage(e.target.value)}
                                className={inputClasses('selectedPackage') + " appearance-none"}
                            >
                                <option value="" disabled>Select a collection</option>
                                {brochures.map((b) => (
                                    <option key={b.id} value={b.slug}>[{b.category}] {b.title}</option>
                                ))}
                                <option value="custom">Other / Custom Request</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brushed-gold">
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-3 pt-4">
                    <div className="flex items-center h-5">
                        <input
                            id="newsletter-optin"
                            name="newsletter-optin"
                            type="checkbox"
                            checked={newsletterOptin}
                            onChange={(e) => setNewsletterOptin(e.target.checked)}
                            className="h-5 w-5 rounded border-midnight-navy/20 text-brushed-gold focus:ring-brushed-gold accent-brushed-gold"
                        />
                    </div>
                    <label htmlFor="newsletter-optin" className="text-[11px] leading-tight text-midnight-navy/70 font-medium">
                        Keep me updated on new brochures and exclusive corporate itineraries.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brushed-gold text-white py-5 mt-2 rounded-lg text-xs font-bold tracking-widest uppercase shadow-xl shadow-brushed-gold/30 hover:shadow-brushed-gold/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Processing Submission...' : 'Send B2B Inquiry'}
                </button>
            </form>
        </section>
    );
}





