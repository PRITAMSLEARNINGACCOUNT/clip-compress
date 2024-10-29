import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req) => {
  const { userId } = await auth();
  // const AuthObj = await auth();
  // console.log(AuthObj);

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url).toString());
  }
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url).toString());
  }
  NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
