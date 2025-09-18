import { Suspense } from "react";
import ChatPageClient from "./ChatPageClient";
import Loading from '../judgement/components/LoadingScreen'
export default function ChatPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ChatPageClient />
        </Suspense>
    );
}
