import { readProfile, writeProfile } from "../../../lib/profile";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json(await readProfile());
}

export async function POST(request) {
  const body = await request.json();
  const profile = await writeProfile(body);
  return Response.json(profile);
}
