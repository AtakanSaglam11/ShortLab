// Middleware basique : auth basic-auth quand AUTH_PASSWORD est défini (prod).
// Pas d'effet en local tant que AUTH_PASSWORD est vide.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const expected = process.env.AUTH_PASSWORD;
  if (!expected) return NextResponse.next();

  const auth = req.headers.get("authorization");
  const encoded = Buffer.from(`admin:${expected}`).toString("base64");
  if (auth === `Basic ${encoded}`) return NextResponse.next();

  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="insta-analytics"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/cron).*)"],
};
