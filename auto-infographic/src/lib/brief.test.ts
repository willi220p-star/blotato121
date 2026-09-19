import { describe, expect, it } from 'vitest'
import { briefFooter, defaultQuestions, lockBrief, staysOnTopic, topicSeed } from './brief'

describe('brief lock', () => {
  it('keeps the user topic first and appends their answers', () => {
    const locked = lockBrief('Workplace disability access for new hires', {
      audience: 'HR teams',
      contact: 'Email',
      contactValue: 'access@example.com',
      must: 'ramps, captions, flexible hours',
    })
    expect(locked.startsWith('Workplace disability access for new hires')).toBe(true)
    expect(locked).toMatch(/HR teams/)
    expect(locked).toMatch(/access@example.com/)
    expect(locked).toMatch(/Stay on this exact topic/)
    expect(topicSeed(locked)).toBe('Workplace disability access for new hires')
  })

  it('rejects copy that wandered onto another subject', () => {
    expect(staysOnTopic('Workplace disability access', 'Disability ramps, captions, and flexible hours at work')).toBe(true)
    expect(staysOnTopic('Workplace disability access', 'Roast to Bitter: The Chemistry of Coffee')).toBe(false)
  })

  it('asks contact, emails, and disability focus after a disability prompt', () => {
    const questions = defaultQuestions('An infographic about disability access at work', 'infographic')
    expect(questions.some((q) => q.id === 'contact')).toBe(true)
    expect(questions.some((q) => q.id === 'focus')).toBe(true)
    expect(questions.some((q) => q.id === 'emails')).toBe(true)
    expect(questions.some((q) => q.id === 'must')).toBe(true)
  })

  it('puts the email on the footer when they asked for it', () => {
    const locked = lockBrief('Workplace disability access', {
      emails: 'Yes, show the email',
      contactValue: 'access@example.com',
      cta: 'Email the access team',
    })
    expect(briefFooter(locked, 'Save this graphic')).toBe('Email the access team · access@example.com')
  })
})
