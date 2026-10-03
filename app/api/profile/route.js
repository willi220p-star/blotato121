import { cookieName, sessionIsValid } from "../../../lib/auth";
import { readProfile, writeProfile } from "../../../lib/profile";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json(await readProfile());
}

export async function POST(request) {
  const token = request.cookies.get(cookieName())?.value;
  if (!(await sessionIsValid(token))) {
    return Response.json({ error: "Sign in on the Manage page to edit the studio." }, { status: 401 });
  }
  const body = await request.json();
  const profile = await writeProfile(body);
  return Response.json(profile);
}
