import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';
import { createPublicClient, http } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';
import { defaultChain } from '@/lib/constants';

const protectedRoutes = '/dashboard';
// Routes that require wallet connection (everything except home page)
const walletRequiredRoutes = ['/mint', '/play', '/game', '/stats', '/tournament'];
// Routes that require alive agent (post-mint pages, except judgement flow)
const aliveAgentRequiredRoutes = ['/game', '/play/chat', '/play/setup'];
// Routes that are part of judgement flow (allowed even if agent is dead)
const judgementFlowRoutes = ['/play/judgement'];

async function checkUserStatus(userAddress: string | null) {
  console.log('[middleware] Checking user status for address:', userAddress);

  if (!userAddress) {
    console.log('[middleware] No wallet address provided');
    return { hasWallet: false, hasAgent: false, isAlive: false };
  }

  try {
    console.log('[middleware] Creating blockchain client');
    const publicClient = createPublicClient({
      chain: defaultChain,
      transport: http(),
    });

    try {
      console.log('[middleware] Checking active agent ID for:', userAddress);
      // Check if user has an active agent
      const activeAgentId = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getUserActiveAgentId",
        args: [userAddress as `0x${string}`],
      }) as bigint;

      console.log('[middleware] Active agent ID:', activeAgentId?.toString());

      if (!activeAgentId || activeAgentId === 0n) {
        console.log('[middleware] No active agent found');
        return {
          hasWallet: true,
          hasAgent: false,
          isAlive: false
        };
      }

      try {
        console.log('[middleware] Checking agent details for ID:', activeAgentId.toString());
        // Check if agent is alive
        const details = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getAgentDetails",
          args: [activeAgentId],
        }) as readonly [string, bigint, bigint, bigint, bigint, boolean];

        const isAlive = details?.[5] === true;
        console.log('[middleware] Agent details:', {
          owner: details?.[0],
          compliance: details?.[1]?.toString(),
          creativity: details?.[2]?.toString(),
          unhingedness: details?.[3]?.toString(),
          motivation: details?.[4]?.toString(),
          isAlive
        });

        const result = {
          hasWallet: true,
          hasAgent: true,
          isAlive
        };
        console.log('[middleware] Final result:', result);
        return result;
      } catch (detailsError) {
        console.error('[middleware] Failed to get agent details:', detailsError);
        // If details cannot be read, assume no alive agent
        const result = {
          hasWallet: true,
          hasAgent: false,
          isAlive: false
        };
        console.log('[middleware] Details error result:', result);
        return result;
      }
    } catch (agentIdError) {
      console.error('[middleware] Failed to get active agent ID:', agentIdError);
      // If activeAgentId cannot be read, assume no agent
      const result = {
        hasWallet: true,
        hasAgent: false,
        isAlive: false
      };
      console.log('[middleware] Agent ID error result:', result);
      return result;
    }
  } catch (error) {
    console.error('[middleware] Error checking user status:', error);
  }

  const fallbackResult = { hasWallet: false, hasAgent: false, isAlive: false };
  console.log('[middleware] Returning fallback result:', fallbackResult);
  return fallbackResult;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isProtectedRoute = pathname.startsWith(protectedRoutes);

  console.log('[middleware] Processing request for path:', pathname);

  // Original session-based protection
  if (isProtectedRoute && !sessionCookie) {
    console.log('[middleware] Protected route without session, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Skip wallet/agent checks for API routes, static files, assets, and home page
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/' || pathname.startsWith('/favicon') || pathname.startsWith('/assets')) {
    console.log('[middleware] Skipping checks for excluded path:', pathname);
    let res = NextResponse.next();

    if (sessionCookie && request.method === 'GET') {
      try {
        const parsed = await verifyToken(sessionCookie.value);
        const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

        res.cookies.set({
          name: 'session',
          value: await signToken({
            ...parsed,
            expires: expiresInOneDay.toISOString()
          }),
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          expires: expiresInOneDay
        });
      } catch (error) {
        console.error('[middleware] Error updating session:', error);
        res.cookies.delete('session');
        if (isProtectedRoute) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }
      }
    }

    return res;
  }

  // Get wallet address from cookies (set by the frontend)
  const walletAddress = request.cookies.get('wallet_address')?.value || null;
  console.log('[middleware] Wallet address from cookie:', walletAddress);

  // Check if wallet is required for this route
  const requiresWallet = walletRequiredRoutes.some(route => pathname.startsWith(route));
  console.log('[middleware] Route requires wallet:', requiresWallet, 'for path:', pathname);

  if (requiresWallet && !walletAddress) {
    console.log('[middleware] Wallet required but not found, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if alive agent is required for this route
  const requiresAliveAgent = aliveAgentRequiredRoutes.some(route => pathname.startsWith(route));
  const isJudgementFlow = judgementFlowRoutes.some(route => pathname.startsWith(route));

  console.log('[middleware] Route requires alive agent:', requiresAliveAgent);
  console.log('[middleware] Is judgement flow:', isJudgementFlow);

  if (requiresAliveAgent && !isJudgementFlow && walletAddress) {
    console.log('[middleware] Checking agent status for protected route');
    const status = await checkUserStatus(walletAddress);
    console.log('[middleware] Agent status check result:', status);

    if (!status.isAlive) {
      console.log('[middleware] Agent not alive, redirecting to mint');
      return NextResponse.redirect(new URL('/mint', request.url));
    } else {
      console.log('[middleware] Agent is alive, allowing access');
    }
  }

  console.log('[middleware] All checks passed, allowing request to:', pathname);
  let res = NextResponse.next();

  if (sessionCookie && request.method === 'GET') {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString()
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInOneDay
      });
    } catch (error) {
      console.error('Error updating session:', error);
      res.cookies.delete('session');
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
};
