import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Heading,
    Text,
    Section,
    Row,
    Column,
    Hr,
    Tailwind,
    pixelBasedPreset,
} from '@react-email/components';

interface InquiryNotificationProps {
    agencyName: string;
    agentName: string;
    licenseNo: string;
    agentEmail: string;
    agentPhone: string;
    userId?: string | null;
    isVerified: boolean;
    packageSlug: string;
    travelDates: string;
    pax: number;
    adults: number;
    childrenCWB: number;
    childrenCNB: number;
    infants0to2: number;
    roomCategory: string;
    estimatedBudget: string;
    placesOfVisit: string;
}

export default function InquiryNotification({
    agencyName,
    agentName,
    licenseNo,
    agentEmail,
    agentPhone,
    userId,
    isVerified,
    packageSlug,
    travelDates,
    pax,
    adults,
    childrenCWB,
    childrenCNB,
    infants0to2,
    roomCategory,
    estimatedBudget,
    placesOfVisit,
}: InquiryNotificationProps) {
    return (
        <Html lang="en">
            <Tailwind config={{ presets: [pixelBasedPreset] }}>
                <Head />
                <Preview>New B2B Inquiry: {agencyName} - {agentName}</Preview>
                <Body className="bg-slate-50 font-sans py-10 px-5 text-slate-700">
                    <Container className="max-w-[600px] mx-auto bg-white rounded-xl overflow-hidden border-solid border-slate-200 border-[1px]">
                        <Section className="bg-slate-900 p-8 text-center">
                            <Heading className="text-[#C5A059] m-0 text-2xl font-light tracking-widest uppercase">
                                New B2B Inquiry
                            </Heading>
                        </Section>

                        <Section className="p-8">
                            <Text className="mt-0 text-[15px] mb-6 text-slate-600">
                                A new lead has been captured via the Feel Japan with K B2B Portal.
                            </Text>

                            <Section className="mb-6">
                                <Heading as="h3" className="text-slate-900 border-none border-b-[2px] border-b-slate-100 border-solid pb-2 text-sm uppercase tracking-widest m-0 mb-3">
                                    Agent Details
                                </Heading>

                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Agency Name</Column>
                                    <Column className="text-slate-900 font-semibold text-sm">{agencyName}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Agent Name</Column>
                                    <Column className="text-slate-900 font-semibold text-sm">{agentName}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">License No</Column>
                                    <Column className="text-slate-900 text-sm">{licenseNo}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Email</Column>
                                    <Column className="text-slate-900 text-sm">{agentEmail}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Phone</Column>
                                    <Column className="text-slate-900 text-sm">{agentPhone}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">User Type</Column>
                                    <Column className="text-slate-900 text-sm">{userId ? `Partner (${userId})` : 'Guest'}</Column>
                                </Row>
                            </Section>

                            <Section
                                className={`p-4 mb-6 rounded-r-lg border-none border-l-4 border-solid ${isVerified ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-500'}`}
                            >
                                <Text className={`font-bold text-sm m-0 mb-1 ${isVerified ? 'text-green-800' : 'text-amber-700'}`}>
                                    {isVerified ? '✓ Verified Partner' : '⚠ Unverified / Guest'}
                                </Text>
                                <Text className={`text-[13px] m-0 ${isVerified ? 'text-green-700' : 'text-amber-600'}`}>
                                    {isVerified ? 'Partner is pre-verified in the portal.' : 'Manual validation required for guest/unverified submission.'}
                                </Text>
                            </Section>

                            <Section>
                                <Heading as="h3" className="text-slate-900 border-none border-b-[2px] border-b-slate-100 border-solid pb-2 text-sm uppercase tracking-widest m-0 mb-3">
                                    Itinerary Requirements
                                </Heading>

                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Package</Column>
                                    <Column className="text-slate-900 font-semibold text-sm">{packageSlug || 'Custom Architecture'}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Dates</Column>
                                    <Column className="text-slate-900 text-sm">{travelDates}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Pax</Column>
                                    <Column className="text-slate-900 text-sm">{pax} Total (A:{adults} CWB:{childrenCWB} CNB:{childrenCNB} I:{infants0to2})</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Category</Column>
                                    <Column className="text-slate-900 text-sm">{roomCategory}</Column>
                                </Row>
                                <Row className="mb-2 border-none border-b-[1px] border-b-slate-100 border-solid pb-2">
                                    <Column className="text-slate-500 w-[35%] text-sm">Budget</Column>
                                    <Column className="text-slate-900 text-sm">{estimatedBudget}</Column>
                                </Row>
                                <Row className="pt-2">
                                    <Column className="text-slate-500 align-top text-sm">Destinations</Column>
                                </Row>
                                <Row>
                                    <Column className="text-slate-900 text-sm leading-relaxed">{placesOfVisit || 'N/A'}</Column>
                                </Row>
                            </Section>
                        </Section>

                        <Section className="bg-slate-50 p-5 text-center border-none border-t-[1px] border-slate-200 border-solid">
                            <Text className="m-0 text-[11px] text-slate-400 uppercase tracking-widest">
                                Feel Japan with K • B2B Portal • Secure Transmission
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

InquiryNotification.PreviewProps = {
    agencyName: "Sakura Travels",
    agentName: "Hiroshi Tanaka",
    licenseNo: "KPL/LN: 9988",
    agentEmail: "hiroshi@sakuratravels.example",
    agentPhone: "+81 90 1234 5678",
    userId: "user_12345",
    isVerified: true,
    packageSlug: "osaka-kyoto-5d4n",
    travelDates: "Oct 12 - Oct 17, 2026",
    pax: 4,
    adults: 2,
    childrenCWB: 1,
    childrenCNB: 1,
    infants0to2: 0,
    roomCategory: "4-Star (Premium)",
    estimatedBudget: "¥500,000",
    placesOfVisit: "Osaka Castle, Dotonbori, Fushimi Inari, Arashiyama Bamboo Grove",
} satisfies InquiryNotificationProps;
