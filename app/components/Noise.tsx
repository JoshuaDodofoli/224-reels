export default function Noise() {
    return (
        <div className="pointer-events-none fixed inset-0 z-9999 h-full w-full opacity-[0.06] mix-blend-difference">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
            >
                <filter id="noise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.8"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>
    );
}
