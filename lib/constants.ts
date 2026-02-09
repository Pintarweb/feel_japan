import { MapPin, Star, Utensils } from 'lucide-react';

export const BROCHURES = [
    {
        id: 1,
        title: "FIT Tokyo Summer 2026",
        description: "Free Independent Traveler package for Tokyo. Explore the vibrant capital at your own pace.",
        image: "/thumbnails/fit_tokyo_summer.jpg",
        link: "/brochures/5D4N%20Tokyo%20Mt%20Fuji%20Summer%20Discovery",
        tags: [
            { label: "FIT", icon: Star, color: "text-brushed-gold", border: "border-brushed-gold" },
            { label: "Tokyo", icon: MapPin, color: "text-midnight-navy/60", border: "border-midnight-navy/10" }
        ]
    },
    {
        id: 2,
        title: "FIT Osaka Summer 2026",
        description: "Curated FIT experience in Osaka. Culinary delights and historical landmarks await.",
        image: "/thumbnails/fit_osaka_summer.jpg",
        link: "/brochures/FITOSKSUMMER26.html",
        tags: [
            { label: "FIT", icon: Star, color: "text-brushed-gold", border: "border-brushed-gold" },
            { label: "Osaka", icon: MapPin, color: "text-midnight-navy/60", border: "border-midnight-navy/10" }
        ]
    },
    {
        id: 3,
        title: "FIT Tokyo & Osaka Summer 2026",
        description: "The complete dual-city experience. Modern Tokyo meets traditional Osaka in one seamless journey.",
        image: "/thumbnails/fit_tokyo_osaka_summer.jpg",
        link: "/brochures/FITTYOOSKSUMMER26.html",
        tags: [
            { label: "FIT", icon: Star, color: "text-brushed-gold", border: "border-brushed-gold" },
            { label: "Dual City", icon: MapPin, color: "text-midnight-navy/60", border: "border-midnight-navy/10" }
        ]
    },
    {
        id: 4,
        title: "GIT Tokyo Summer 2026",
        description: "Group Inclusive Tour for Tokyo. Perfect for corporate retreats and large delegations.",
        image: "/thumbnails/git_tokyo_summer.jpg",
        link: "/brochures/GITTYOSUMMER26.html",
        tags: [
            { label: "GIT", icon: Utensils, color: "text-brushed-gold", border: "border-brushed-gold" },
            { label: "Tokyo", icon: MapPin, color: "text-midnight-navy/60", border: "border-midnight-navy/10" }
        ]
    },
    {
        id: 5,
        title: "GIT Osaka Summer 2026",
        description: "Group Inclusive Tour for Osaka. Experience the kitchen of Japan with your group.",
        image: "/thumbnails/git_osaka_summer.jpg",
        link: "/brochures/GITOSKSUMMER26.html",
        tags: [
            { label: "GIT", icon: Utensils, color: "text-brushed-gold", border: "border-brushed-gold" },
            { label: "Osaka", icon: MapPin, color: "text-midnight-navy/60", border: "border-midnight-navy/10" }
        ]
    },
    {
        id: 6,
        title: "GIT Tokyo & Osaka Summer 2026",
        description: "Comprehensive Group Tour covering both major cities. The ultimate corporate incentive trip.",
        image: "/thumbnails/git_tokyo_osaka_summer.jpg",
        link: "/brochures/GITTYOOSKSUMMER26.html",
        tags: [
            { label: "GIT", icon: Utensils, color: "text-brushed-gold", border: "border-brushed-gold" },
            { label: "Dual City", icon: MapPin, color: "text-midnight-navy/60", border: "border-midnight-navy/10" }
        ]
    }
];
