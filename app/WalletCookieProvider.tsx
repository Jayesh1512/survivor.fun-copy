"use client";

import { useWalletCookie } from '@/lib/hooks/useWalletCookie';

export default function WalletCookieProvider() {
    useWalletCookie();
    return null;
}
