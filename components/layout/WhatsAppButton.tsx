"use client";

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Smooth entrance after page load
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+60XXXXXXXXX";
    const message = encodeURIComponent("Hi Feel Japan Team, I'm visiting your website and would like to inquire about your B2B services.");
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;

    if (!isVisible) return null;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 group flex items-center gap-3"
        >
            {/* Tooltip Label */}
            <span className="bg-white/90 backdrop-blur-md text-midnight-navy px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl border border-midnight-navy/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 hidden md:block">
                Chat with Us
            </span>

            {/* The Button */}
            <div className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,211,102,0.5)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <MessageCircle className="w-7 h-7" />

                {/* Subtle Ripple/Pulse Animation */}
                <div className="absolute inset-0 bg-white/20 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
            </div>
        </a>
    );
}
