'use server';

import { redirect } from 'next/navigation';
import { withTeam } from '@/lib/auth/middleware';

// No-op checkout while Stripe is removed. Redirect to dashboard.
export const checkoutAction = withTeam(async () => {
  redirect('/dashboard');
});

// No customer portal without Stripe. Redirect to pricing for now.
export const customerPortalAction = withTeam(async () => {
  redirect('/pricing');
});
