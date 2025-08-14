"use client"
import React from "react";
import Mobile from "./mobile";

export default function Page() {
    return (
        <main>
            <div className="mobile-ui">
               <Mobile/>
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