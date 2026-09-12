import { GAP_MAIL_TO, type GapMailPayload } from './gapMail'

async function postFormSubmit(to: string, payload: GapMailPayload): Promise<boolean> {
  const response = await fetch(`https://formsubmit.co/ajax/${to}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: 'SaveWorld',
      subject: payload.subject,
      message: payload.message,
      month: payload.month,
      household: payload.householdName,
      _captcha: 'false',
      _template: 'box',
    }),
  })
  return response.ok
}

export async function sendGapMail(
  payload: GapMailPayload,
): Promise<{ ok: boolean; detail: string }> {
  try {
    const response = await fetch('/api/notify-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (response.ok) return { ok: true, detail: 'api' }
  } catch {
    // Preview and first-load fall back to FormSubmit.
  }

  const results = await Promise.all(
    GAP_MAIL_TO.map(async (to) => {
      try {
        return await postFormSubmit(to, payload)
      } catch {
        return false
      }
    }),
  )
  if (results.every(Boolean)) return { ok: true, detail: 'formsubmit' }
  return { ok: false, detail: 'send-failed' }
}
