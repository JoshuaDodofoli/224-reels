export const navLinks = [
    {
        title: "Archive",
        path: "/",
    },
    {
        title: "Info",
        path: "/about",
    },
];

export interface Reel {
    img: string;
    slug: string;
    title: string;
    desc: string;
    type: string;
    date: string;
    /** Mux playback ID — optional until videos are wired up. */
    video?: string;
}

export const reelsData: Reel[] = [
    {
        img: "/images/img-1.webp",
        slug: "first",
        title: "Neon Drift",
        desc: "A hypnotic journey through neon-lit city streets at 3 AM. Shot entirely handheld over a single weekend, this piece leans into motion blur and chromatic aberration to evoke the disorienting beauty of urban isolation. Every frame was graded with a custom LUT built from expired film scans.",
        type: "snippet",
        date: "March 2024",
    },
    {
        img: "/images/img-2.webp",
        slug: "second",
        title: "Pulse — Brand Reel",
        desc: "A full brand identity launch reel for Pulse Apparel, a streetwear label born out of East London. The brief called for raw energy balanced with high-fashion restraint. We shot over three days across Hackney, Shoreditch, and Peckham, casting entirely from the local community to keep the authenticity front and centre.",
        type: "reel",
        date: "January 2024",
    },
    {
        img: "/images/img-3.webp",
        slug: "third",
        title: "Between Frames",
        desc: "An introspective short exploring the quiet moments that exist between action — the pause before a word, the breath before a jump. Constructed from 48 hours of observational footage condensed into under two minutes, the piece questions what we lose when we chase only the highlight.",
        type: "snippet",
        date: "August 2023",
    },
    {
        img: "/images/img-4.webp",
        slug: "fourth",
        title: "Solstice",
        desc: "Created for Solstice Music Festival's 2024 campaign, this reel distils the feeling of a summer weekend into 90 seconds of pure sensation. Working with a 4-person crew and a tight turnaround, we captured live performances, crowd energy, and the golden-hour backstage moments that rarely make the official recap.",
        type: "reel",
        date: "June 2024",
    },
    {
        img: "/images/img-5.webp",
        slug: "fifth",
        title: "Orbit",
        desc: "A motion-design-heavy snippet produced as a showreel entry exploring macro photography blended with 3D rendered environments. Each transition is driven by the natural geometry found in the source footage — pollen grains, soap films, and water tension — then extended digitally to create seamless depth.",
        type: "snippet",
        date: "November 2023",
    },
    {
        img: "/images/img-6.webp",
        slug: "sixth",
        title: "Atlas — Product Launch",
        desc: "Atlas approached us to launch their next-generation carry-on luggage with a campaign that felt more like a travel film than a product ad. We built a narrative around a single traveller across Tokyo, Marrakech, and Reykjavík — each city colour-graded to its own palette while maintaining a cohesive visual thread throughout.",
        type: "reel",
        date: "April 2024",
    },
    {
        img: "/images/img-7.webp",
        slug: "seventh",
        title: "Undercurrent",
        desc: "Shot on a single roll of 16mm film with no reshoot budget, Undercurrent documents a small community of free divers off the Cornish coast. The constraint forced an intimacy that digital rarely achieves — every moment on film had to count. The grain, the scratches, the light leaks all stayed in.",
        type: "snippet",
        date: "May 2023",
    },
    {
        img: "/images/img-8.webp",
        slug: "eighth",
        title: "Concrete & Chrome",
        desc: "The annual showreel for Meridian Architecture Studio, translating their portfolio of civic buildings into cinematic movement. Drone choreography, tilt-shift miniaturisation, and time-lapse cloud drama were layered together to give structure to the work without ever feeling like a slideshow. Scored with a custom piano arrangement.",
        type: "reel",
        date: "February 2024",
    },
];
