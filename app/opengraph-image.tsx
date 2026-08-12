import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "./utils/site";

export const alt = `${SITE_NAME} — a personal archive of moving images`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#f5f5f5",
                    color: "#0d0d0d",
                    padding: "72px 80px",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 26,
                        letterSpacing: "0.04em",
                    }}
                >
                    <span>{SITE_NAME}</span>
                    <span style={{ color: "#8a8a8a" }}>Personal archive</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 32,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 210,
                                fontWeight: 700,
                                letterSpacing: "-0.08em",
                                lineHeight: 0.8,
                            }}
                        >
                            224
                        </span>
                        <span
                            style={{
                                fontSize: 54,
                                fontWeight: 700,
                                letterSpacing: "0.22em",
                                lineHeight: 1,
                            }}
                        >
                            REELS
                        </span>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: 3,
                            marginTop: 46,
                            background: "#e10600",
                        }}
                    />
                    <p
                        style={{
                            maxWidth: 900,
                            margin: "28px 0 0",
                            color: "#555555",
                            fontSize: 28,
                            lineHeight: 1.35,
                        }}
                    >
                        {SITE_DESCRIPTION}
                    </p>
                </div>
            </div>
        ),
        size,
    );
}
