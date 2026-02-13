import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (!exchangeError) {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Check if user came from signup (metadata) and might need password setup
                const isNewSignup = user.user_metadata?.agency_name !== undefined;

                // We'll also check if they have a 'password' identity. 
                // Note: supabase identities check can be complex, another way is check a custom flag in metadata 
                // or just see if it's their very first session.
                const hasPassword = user.identities?.some(id => id.provider === 'email' && id.identity_data?.has_password === true);

                // If it's a new signup and they don't have a password yet, send them to setup
                if (isNewSignup && !hasPassword) {
                    return NextResponse.redirect(`${origin}/agent/setup-password`)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-error`)
}
