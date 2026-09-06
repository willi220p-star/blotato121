export const INBOX = "regmisushant94@gmail.com";

type Payload = Record<string, string>;

export async function sendToInbox(payload: Payload) {
  const body = {
    _captcha: "false",
    _template: "table",
    _honey: "",
    mailbox: INBOX,
    ...payload,
  };
  const res = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || "Could not send to mailbox");
  }
  return data;
}

export function trackVisit(page: string) {
  try {
    const key = "kishuka-visit-mailed";
    if (sessionStorage.getItem(key)) {
      const hops = Number(sessionStorage.getItem("kishuka-hops") || "1") + 1;
      sessionStorage.setItem("kishuka-hops", String(hops));
      return;
    }
    sessionStorage.setItem(key, "1");
    sessionStorage.setItem("kishuka-hops", "1");
    void sendToInbox({
      _subject: `KISHUKA website visit: ${page}`,
      type: "website visit",
      page,
      when: new Date().toLocaleString("en-AU", { timeZone: "Australia/Darwin" }),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      from: document.referrer || "direct",
    });
  } catch {
    // visit mail is best-effort
  }
}

export function trackAction(action: string, details: Payload) {
  return sendToInbox({
    _subject: `KISHUKA ${action}`,
    type: action,
    when: new Date().toLocaleString("en-AU", { timeZone: "Australia/Darwin" }),
    ...details,
  });
}
