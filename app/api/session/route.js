import { clearCookie, cookieName, createSession, destroySession, passwordMatches, sessionCookie, sessionIsValid } from "../../../lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const token = request.cookies.get(cookieName())?.value;
  return Response.json({ signedIn: await sessionIsValid(token) });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!(await passwordMatches(String(body.password || "")))) {
    return Response.json({ error: "That password doesn’t match." }, { status: 401 });
  }
  const token = await createSession();
  return Response.json(
    { signedIn: true },
    { headers: { "Set-Cookie": sessionCookie(token) } }
  );
}

export async function DELETE(request) {
  const token = request.cookies.get(cookieName())?.value;
  await destroySession(token);
  return Response.json({ signedIn: false }, { headers: { "Set-Cookie": clearCookie() } });
}
