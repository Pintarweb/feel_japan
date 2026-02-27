import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Heading,
    Text,
    Section,
    Tailwind,
    pixelBasedPreset,
    Font,
} from '@react-email/components';

interface ClientAcknowledgmentProps {
    agentName: string;
    agencyName: string;
    packageSlug: string;
    inquiryId: string;
}

export default function ClientAcknowledgment({
    agentName,
    agencyName,
    packageSlug,
    inquiryId,
}: ClientAcknowledgmentProps) {
    // Format ID for display
    const displayId = (inquiryId || '12345678').substring(0, 8).toUpperCase();

    return (
        <Html lang="en">
            <Tailwind config={{ presets: [pixelBasedPreset] }}>
                <Head>
                    <Font
                        fontFamily="Georgia"
                        fallbackFontFamily="serif"
                    />
                </Head>
                <Preview>Inquiry Confirmed: Feel Japan with K Bespoke (Ref: {displayId})</Preview>
                <Body className="bg-slate-50 py-10 px-5 text-slate-700">
                    <Container className="max-w-[600px] mx-auto bg-white rounded-lg overflow-hidden border-solid border-slate-200 border-x border-b border-t-8 border-t-[#C5A059]">
                        <Section className="p-10">
                            <Section className="text-center mb-10">
                                <Heading className="text-slate-900 text-3xl font-normal m-0 mb-2 tracking-wide">
                                    Feel Japan with K
                                </Heading>
                                <Text className="text-[#C5A059] font-sans text-[11px] uppercase tracking-widest m-0">
                                    Bespoke Travel Architecture
                                </Text>
                            </Section>

                            <Text className="text-base leading-relaxed mb-5 text-slate-700">
                                Dear {agentName},
                            </Text>

                            <Text className="text-base leading-relaxed mb-5 text-slate-700">
                                We wish to formally acknowledge receipt of your bespoke travel request for <strong>{agencyName}</strong>. Your inquiry has been successfully transmitted to our team of travel designers.
                            </Text>

                            <Text className="text-base leading-relaxed mb-8 text-slate-700">
                                At Feel Japan with K, we treat every itinerary as a unique piece of architecture. A member of our concierge team will carefully review your requirements and reach out to you within 24 to 48 business hours.
                            </Text>

                            <Section className="bg-slate-50 border-solid border-slate-200 border rounded-md p-6 text-center mb-8">
                                <Text className="font-sans text-xs color-slate-500 uppercase tracking-wide m-0 mb-2">
                                    Reference Details
                                </Text>
                                <Text className="text-lg text-slate-900 m-0 mb-1">
                                    <strong>{packageSlug || 'Bespoke Arrangement'}</strong>
                                </Text>
                                <Text className="font-sans text-[13px] text-slate-500 m-0">
                                    Transmission ID: {displayId}
                                </Text>
                            </Section>

                            <Text className="text-base leading-relaxed mb-1 text-slate-700">
                                Warm regards,
                            </Text>
                            <Text className="text-base italic text-[#C5A059] m-0">
                                The Feel Japan with K Concierge Team
                            </Text>
                        </Section>

                        <Section className="bg-slate-900 p-6 text-center">
                            <Text className="font-sans text-[11px] text-slate-400 m-0 tracking-wide">
                                This is an automated acknowledgment. Please do not reply directly to this email.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

ClientAcknowledgment.PreviewProps = {
    agentName: "Hiroshi Tanaka",
    agencyName: "Sakura Travels",
    packageSlug: "osaka-kyoto-5d4n",
    inquiryId: "a1b2c3d4e5f6",
} satisfies ClientAcknowledgmentProps;
