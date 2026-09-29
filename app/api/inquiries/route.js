import { readInquiries, writeInquiries } from "../../../lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const inquiries = await readInquiries();
  return Response.json({ inquiries });
}

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const brand = String(body.brand || "").trim();
  const type = String(body.type || "Collaboration").trim();
  const message = String(body.message || "").trim();

  if (name.length < 2) {
    return Response.json({ error: "Add your name." }, { status: 400 });
  }
  if (message.length < 8) {
    return Response.json({ error: "Tell Isha a little about the collaboration." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That email doesn’t look complete." }, { status: 400 });
  }

  const inquiry = {
    id: crypto.randomUUID(),
    name,
    email,
    brand,
    type,
    message,
    createdAt: new Date().toISOString(),
  };
  const inquiries = await readInquiries();
  inquiries.unshift(inquiry);
  await writeInquiries(inquiries);
  return Response.json({ inquiry });
}
