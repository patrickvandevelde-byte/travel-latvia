import { get } from "@vercel/edge-config";
import { type NextRequest, NextResponse } from "next/server";
import { matchRedirect, type RedirectMap } from "./modules/content/redirects";

/**
 * Serves marketer-managed redirects from Edge Config (ADR-012) without a
 * deploy. Does nothing until Edge Config is connected to the project.
 */
export async function proxy(request: NextRequest) {
  if (!process.env.EDGE_CONFIG) return NextResponse.next();
  let map: RedirectMap | undefined;
  try {
    map = await get<RedirectMap>("redirects");
  } catch {
    return NextResponse.next(); // never take the site down because of redirects
  }
  const rule = matchRedirect(map, request.nextUrl.pathname);
  if (!rule) return NextResponse.next();
  const target = rule.to.startsWith("/") ? new URL(rule.to, request.url) : new URL(rule.to);
  return NextResponse.redirect(target, rule.permanent ? 308 : 307);
}

export const config = {
  // Skip Next internals, the Studio, APIs and files with an extension.
  matcher: ["/((?!_next/|studio|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
