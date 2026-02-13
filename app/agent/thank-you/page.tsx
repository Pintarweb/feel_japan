import Link from 'next/link';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl text-center border border-midnight-navy/5">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-midnight-navy mb-4 italic">Request Received</h1>
                <p className="text-midnight-navy/60 text-sm leading-relaxed mb-10">
                    Your agency profile has been submitted for manual verification. Our team will review your MOTAC license credentials shortly.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-midnight-navy/40 hover:text-midnight-navy transition-all">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Portfolio
                </Link>
            </div>
        </div>
    );
}
