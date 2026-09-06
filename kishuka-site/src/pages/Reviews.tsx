import { FormEvent, useMemo, useState } from "react";
import { EMAIL, GOOGLE_REVIEW_URL, SUBURBS } from "../data";
import { trackAction } from "../notify";
import { loadReviews, saveReview } from "../storage";

export default function Reviews() {
  const [reviews, setReviews] = useState(() => loadReviews());
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = String(form.get("name") || "").trim();
    const suburb = String(form.get("suburb") || "").trim();
    const rating = Number(form.get("rating"));
    const service = String(form.get("service") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (!name || !suburb || !service || !message || rating < 1) {
      setError("Please fill every field and pick a star rating.");
      setSaved(false);
      return;
    }
    const review = {
      id: crypto.randomUUID(),
      name,
      suburb,
      rating,
      service,
      message,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setSending(true);
    setError("");
    try {
      await trackAction("review", {
        name,
        suburb,
        rating: String(rating),
        service,
        message,
      });
    } catch {
      setError(
        "Saved on the page, but the mailbox ping failed. The first send needs a FormSubmit confirm click in Gmail.",
      );
    }
    saveReview(review);
    setReviews(loadReviews());
    setSaved(true);
    setSending(false);
    formEl.reset();
  }

  return (
    <section className="shell section">
      <h2>Reviews</h2>
      <p className="lede">
        Leave feedback for KISHUKA on this page. It also lands in {EMAIL}. You
        can jump to Google and post a public review there too.
      </p>
      <p>
        <a className="cta-google" href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">
          Leave a Google review
        </a>
      </p>
      <p className="lede">
        Site average {average.toFixed(1)} from {reviews.length} Darwin comments.
      </p>
      <div className="split">
        <form className="form panel" onSubmit={onSubmit}>
          <label>
            Your name
            <input name="name" autoComplete="name" />
          </label>
          <label>
            Suburb
            <select name="suburb" defaultValue="">
              <option value="" disabled>
                Choose suburb
              </option>
              {SUBURBS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Service
            <select name="service" defaultValue="">
              <option value="" disabled>
                Choose service
              </option>
              <option>Carpet steam</option>
              <option>Upholstery</option>
              <option>Home clean</option>
              <option>End of lease</option>
            </select>
          </label>
          <label>
            Stars
            <select name="rating" defaultValue="5">
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <label>
            Your review
            <textarea name="message" rows={4} />
          </label>
          {error ? <div className="error">{error}</div> : null}
          {saved ? (
            <div className="ok-box">Thanks. Your review is on the page and in the mailbox.</div>
          ) : null}
          <button className="submit-blue" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Post review"}
          </button>
        </form>
        <div className="review-list">
          {reviews.map((r) => (
            <article className="panel review-item" key={r.id}>
              <h3>
                {r.name} · {r.suburb}
              </h3>
              <div className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              <small>
                {r.service} · {r.createdAt}
              </small>
              <p>{r.message}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
