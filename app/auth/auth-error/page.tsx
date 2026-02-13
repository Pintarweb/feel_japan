import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-midnight-navy flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-2xl">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldAlert className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-midnight-navy text-2xl font-serif font-bold mb-4">Authentication Error</h1>
                <p className="text-midnight-navy/60 text-sm mb-10 leading-relaxed">
                    We encountered a prism during your verification process. This can happen if the link has expired or has already been used.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/agent/login"
                        className="block w-full px-8 py-4 bg-midnight-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-midnight-navy/90 transition-all"
                    >
                        Try Logging In Again
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-midnight-navy/40 hover:text-midnight-navy transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Home
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50">
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-midnight-navy/20">
                        Feel Japan with K • Security Verification
                    </p>
                </div>
            </div>
        </div>
    )
}
