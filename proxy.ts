import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// In Next.js 16, proxy.ts replaces middleware.ts
// It is recommended to keep this file lightweight and move heavy auth logic to layouts/pages
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Basic protection can stay here if desired, but redundant if layouts have auth().protect()
    // Keeping it for defense-in-depth but the search suggests moving away from heavy middleware logic
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};