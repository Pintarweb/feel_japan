import StudioBuilderClient from './StudioBuilder';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function StudioBuilderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-midnight-navy flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brushed-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <StudioBuilderClient />
        </Suspense>
    );
}
