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
        <main className="h-full">
            <Mobile />
        </main>
    );
}
