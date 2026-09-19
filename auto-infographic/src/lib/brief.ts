export interface BriefQuestion {
  id: string
  label: string
  placeholder?: string
  options?: string[]
}

export function topicSeed(prompt: string): string {
  return prompt
    .split(/\n\nStay on this exact topic/i)[0]
    .split(/\n\n(?:Audience|Focus|Emails|Must include|Contact(?: details)?|Tone|Next step):/i)[0]
    .replace(/^EXACT TOPIC:\s*/i, '')
    .trim()
}

export function topicWords(prompt: string): string[] {
  const stop = new Set([
    'about',
    'after',
    'audience',
    'carousel',
    'create',
    'exact',
    'generate',
    'infographic',
    'make',
    'please',
    'something',
    'topic',
    'want',
    'with',
    'this',
    'that',
    'from',
    'have',
    'just',
    'like',
    'need',
    'related',
  ])
  return topicSeed(prompt)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !stop.has(word))
}

export function staysOnTopic(prompt: string, text: string): boolean {
  const keys = topicWords(prompt)
  if (keys.length === 0) return true
  const blob = text.toLowerCase()
  return keys.some((word) => blob.includes(word))
}

export function defaultQuestions(prompt: string, mode: 'infographic' | 'carousel'): BriefQuestion[] {
  const t = prompt.toLowerCase()
  const questions: BriefQuestion[] = [
    {
      id: 'audience',
      label: 'Who is this for?',
      placeholder: 'e.g. HR teams, families, the public',
    },
    {
      id: 'must',
      label: 'What must appear? Names, facts, steps — type the exact things.',
      placeholder: 'If I leave this out, the piece is wrong',
    },
    {
      id: 'emails',
      label: 'Do you want emails shown on this?',
      options: ['Yes, show the email', 'No emails', 'A signup line only'],
    },
    {
      id: 'contact',
      label: 'Add contact details?',
      options: ['No', 'Email', 'Phone', 'Website', 'Email + website'],
    },
    {
      id: 'contactValue',
      label: 'Paste the email, phone, or URL if you want it on the piece',
      placeholder: 'optional',
    },
    {
      id: 'tone',
      label: 'Tone',
      options: ['Clear & factual', 'Warm & human', 'Bold & campaign', 'Quiet & respectful'],
    },
    {
      id: 'cta',
      label: 'What should people do after they see it?',
      placeholder: mode === 'carousel' ? 'e.g. save, share, email us' : 'e.g. apply, donate, email us',
    },
  ]

  if (/\b(disab|accessib|ada|wheelchair|neurodiv|impair)/.test(t)) {
    questions.unshift({
      id: 'focus',
      label: 'Which disability / access focus?',
      options: ['Workplace access', 'Public access', 'Education', 'Healthcare', 'Neurodiversity', 'All of the above'],
    })
  }
  return questions
}

export function fieldFromBrief(prompt: string, label: string): string {
  const match = prompt.match(new RegExp(`${label}:\\s*([^\\n]+)`, 'i'))
  return match?.[1]?.trim() ?? ''
}

export function briefFooter(prompt: string, fallback: string): string {
  const contact = fieldFromBrief(prompt, 'Contact details')
  const cta = fieldFromBrief(prompt, 'Next step')
  const emails = fieldFromBrief(prompt, 'Emails')
  if (/no emails/i.test(emails) && !contact) return (cta || fallback).slice(0, 64)
  if (contact) return [cta, contact].filter(Boolean).join(' · ').slice(0, 64)
  if (/signup/i.test(emails)) return (cta || 'Join the list').slice(0, 64)
  if (cta) return cta.slice(0, 64)
  return fallback.slice(0, 64)
}

export function lockBrief(prompt: string, answers: Record<string, string>): string {
  const lines = [prompt.trim()]
  const order = ['focus', 'emails', 'audience', 'must', 'contact', 'contactValue', 'tone', 'cta']
  const labels: Record<string, string> = {
    focus: 'Focus',
    emails: 'Emails',
    audience: 'Audience',
    must: 'Must include',
    contact: 'Contact',
    contactValue: 'Contact details',
    tone: 'Tone',
    cta: 'Next step',
  }
  for (const id of order) {
    const value = answers[id]?.trim()
    if (value) lines.push(`${labels[id]}: ${value}`)
  }
  lines.push('Stay on this exact topic. Do not invent a different subject.')
  return lines.join('\n\n')
}
