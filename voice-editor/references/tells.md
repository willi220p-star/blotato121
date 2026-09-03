# Tells

Patterns that make a reader say "this was generated." Fix structure first, words second.

## Structure and rhythm

- **Low burstiness.** Every sentence 15–20 words, paragraphs the same height. Force a short line and a long one. Uneven paragraph lengths. At most one isolated one-liner.
- **Fractal summaries.** "In this section we'll…" / "…as we've seen." Delete all of them.
- **Signposted ending.** "In conclusion," "Overall," restatement, then uplift. Delete. End on the last concrete point.
- **Pep-talk closer.** "As we move forward, embracing X will be key." Delete on sight.
- **Prompt echo.** "This essay will explore…" Delete.
- **Listicle in a trench coat.** "The first reason is… The second reason is…" Merge into prose, unless the user asked for a numbered list.
- **Uniform staccato.** "X is A. X is B. X is C." Combine, or change the frame each time.

## Constructions

- **Negative parallelism.** "It's not X. It's Y." / "This isn't a budget. It's a statement of intent." Say Y, or say the budget number.
- **Rhetorical Q&A.** "So what does this mean? It means…" Ask a real question or make the claim.
- **Copula dodge.** "serves as", "stands as", "acts as a", "functions as" → "is"
- **Participial tail.** Every paragraph ending with a dangling "— ensuring that…" Cut the tail or make it a new sentence with a subject.
- **Hedge stack.** "It may potentially help to somewhat improve…" Pick a verb and a degree.
- **Vague authority.** "Experts agree", "studies show", "research suggests" with no name. Cite or cut.
- **Both-sidesing.** Every claim immediately balanced by its opposite. Commit.
- **One-point dilution.** Same idea restated three ways in one paragraph. Keep the sharpest sentence.

## Punctuation and formatting

- Em dashes everywhere. Target zero, max one.
- Bold-first bullets: `**Security:** explanation`. Almost no human does this unprompted.
- Emoji bullets (✅ 🧠 🔹). Strip.
- Title Case Headings and colon-split titles ("The Power of X: Why Y Works"). Sentence case.
- Markdown residue (`**`, `##`, `[text](url)`) in a context that does not render markdown.
- Curly quotes pasted into a plain-text box. Straighten them.
- Semicolons where a period would do. Prefer the period unless the user writes that way.

## Voice

- First three sentences evoke nothing visible. Inject a thing, place, number, or name — from the user's material, or a `[placeholder]`.
- Proper-noun avoidance: "a client", "a tool", "a city". Name it or bracket it.
- Invented people clustering on Emily / Sarah / Jerome. Don't invent people.
- Uniform positivity. Let something be annoying, unfinished, or wrong.
- Register scrubbing: no contractions, no slang, in a casual piece. Restore what the author's samples use.
- Suspiciously tidy anecdotes that exist only to prove the thesis. Real stories keep one useless true detail. Do not fabricate that detail.

## Leaked machine scaffolding

Delete immediately:
- "Certainly!" / "Of course!" / "Great question!"
- "Here's…" as a wrapper for the whole answer
- "I hope this helps" / "Let me know if you need anything else"
- "As an AI language model"
- `[insert example]` left in the body
- `utm_source=chatgpt.com` on links
- "Best regards" on something that is not an email
- Hallucinated citations (real-looking papers, quotes, or URLs the user did not supply)

## What not to do while fixing

- Don't swap every word for a weird one. Readers see the costume.
- Don't scatter random typos. Errors should read as casualness, and only where the register allows them.
- Don't scrub personality along with the tells. A flat, tell-free page is still machine-shaped.
- Don't invent facts, stats, quotes, or named people.
- Don't shrink every long sentence. Humans write long sentences. They do not write *only* 18-word ones.
- Don't turn the piece into an all-lowercase rant with doubled exclamation marks and a fake abandoned outline. That is another template.

## Human markers to restore (only if missing, only if true)

- Contractions
- A number with texture: `$43`, `11 months`, `4:30am`, `v2`
- A named thing (brand, tool, street, person) the author actually has
- A parenthetical aside with attitude
- "I think" / "honestly" / "to be fair" used once
- A sentence starting with And, But, or Because
- One single-sentence paragraph
- A mild complaint or unresolved edge
- An irrelevant-but-true detail already in their notes
- A question the reader was genuinely asking
- Uneven list items
- A plain "is" where a generator would write "serves as"
