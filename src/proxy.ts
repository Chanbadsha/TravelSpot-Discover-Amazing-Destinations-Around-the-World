import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/src/lib/auth";

type RouteGuard = {
  pattern: RegExp;
  allowedRoles: string[];
};

const guards: RouteGuard[] = [
  { pattern: /^\/admin\/destinations(?:\/.*)?$/, allowedRoles: ["admin", "moderator"] },
  { pattern: /^\/admin(?:\/.*)?$/, allowedRoles: ["admin"] },
  { pattern: /^\/user(?:\/.*)?$/, allowedRoles: ["user"] },
  { pattern: /^\/suggest-spot(?:\/.*)?$/, allowedRoles: ["user", "admin", "moderator"] },
];

const roleHome: Record<string, string> = {
  admin: "/admin",
  moderator: "/admin/destinations",
  user: "/user",
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const matched = guards.find((g) => g.pattern.test(pathname));
  if (!matched) return NextResponse.next();

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role: string = (session.user as { role?: string })?.role ?? "user";

  if (!matched.allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/suggest-spot"],
};
