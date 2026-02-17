
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Clean slug (remove leading /brochures/ if present)
        const cleanSlug = slug.replace(/^\/brochures\//, '').replace(/^\//, '');

        const scriptPath = path.join(process.cwd(), '.agent/skills/brochure-capture/scripts/capture.ts');

        // Use full path to npx if needed, but usually npx is in PATH
        const command = `npx tsx "${scriptPath}" --slug="${cleanSlug}" --force`;

        console.log(`[API] Triggering PDF regeneration for: ${cleanSlug}`);

        // We run this asynchronously so the user doesn't wait 15-20s for the browser to finish
        // The UI will show a "Regenerating..." toast or similar if we want, or just a background task.
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`[API] PDF Regeneration Error for ${cleanSlug}:`, error.message);
                console.error(stderr);
                return;
            }
            console.log(`[API] PDF Regeneration Complete for ${cleanSlug}`);
            console.log(stdout);
        });

        return NextResponse.json({
            success: true,
            message: 'PDF regeneration triggered in background'
        });

    } catch (err: any) {
        console.error('[API] Capture Route Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
