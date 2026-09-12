const RECIPIENTS = ['regmisushant94@gmail.com', 'ishadhakal67@gmail.com']

async function sendOne(to, payload) {
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
  if (!response.ok) {
    throw new Error(`FormSubmit ${response.status}`)
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const payload = req.body ?? {}
  if (
    typeof payload.subject !== 'string' ||
    typeof payload.message !== 'string' ||
    typeof payload.month !== 'string' ||
    !/^\d{4}-\d{2}$/.test(payload.month)
  ) {
    res.status(400).json({ error: 'Invalid report' })
    return
  }

  try {
    await Promise.all(RECIPIENTS.map((to) => sendOne(to, payload)))
    res.status(200).json({ ok: true, to: RECIPIENTS })
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Send failed',
    })
  }
}
