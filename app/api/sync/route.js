import { cookieName, sessionIsValid } from "../../../lib/auth";
import { refreshSnapshot } from "../../../lib/scheduler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  const token = request.cookies.get(cookieName())?.value;
  if (!(await sessionIsValid(token))) {
    return Response.json({ error: "Sign in to update the accounts." }, { status: 401 });
  }
  const data = await refreshSnapshot();
  return Response.json(data);
}
