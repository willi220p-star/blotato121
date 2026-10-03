export function ThankYouNote() {
  return (
    <div className="thanks-note" role="status">
      <div className="thanks-mark" aria-hidden="true">
        <span className="thanks-glow" />
        <svg viewBox="0 0 24 24" width="36" height="36">
          <path className="thanks-check" d="M5 12.5 10 17.5 19 7" />
        </svg>
      </div>
      <p>Thank you for submitting the form, and we will be reaching you out soon.</p>
    </div>
  );
}
