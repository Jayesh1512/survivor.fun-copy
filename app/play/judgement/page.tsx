import { Suspense } from "react";
import JudgementPageClient from "./JudgementPageClient";

export default function JudgementPage() {
    return (
        <Suspense fallback={<div />}>
            <JudgementPageClient />
        </Suspense>
    );
}
