"use client"
import React, { useEffect } from "react";
import Mobile from "./mobile";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function Page() {
    const { setFrameReady, isFrameReady } = useMiniKit();

    useEffect(() => {
        if (!isFrameReady) setFrameReady();
    }, [isFrameReady, setFrameReady]);

    return (
        <main>
            <div className="mobile-ui">
                <Mobile />
            </div>
            <div className="desktop-ui">
                <h1>Welcome to Survivor.fun! (Desktop)</h1>
                <p>This is the desktop version of the page.</p>
            </div>
            <style jsx>{`
                .mobile-ui {
                    display: none;
                }
                .desktop-ui {
                    display: block;
                }
                @media (max-width: 767px) {
                    .mobile-ui {
                        display: block;
                    }
                    .desktop-ui {
                        display: none;
                    }
                }
            `}</style>
        </main>
    );
}
