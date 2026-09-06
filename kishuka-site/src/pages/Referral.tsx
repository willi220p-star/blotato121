import { FormEvent, useState } from "react";
import { SUBURBS } from "../data";
import { makeCode, saveReferral } from "../storage";

export default function Referral() {
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const yourName = String(form.get("yourName") || "").trim();
    const yourPhone = String(form.get("yourPhone") || "").trim();
    const friendName = String(form.get("friendName") || "").trim();
    const friendPhone = String(form.get("friendPhone") || "").trim();
    const suburb = String(form.get("suburb") || "").trim();
    if (!yourName || !yourPhone || !friendName || !friendPhone || !suburb) {
      setError("Please fill your details and your friend's details.");
      setCode("");
      return;
    }
    const referral = {
      id: crypto.randomUUID(),
      code: makeCode(),
      yourName,
      yourPhone,
      friendName,
      friendPhone,
      suburb,
    };
    saveReferral(referral);
    setError("");
    setCode(referral.code);
    e.currentTarget.reset();
  }

  return (
    <section className="shell section">
      <h2>Referral: 25% off</h2>
      <p className="lede">
        Send a neighbour to KISHUKA. When they book and pay for a service, your
        next clean is 25% off. One code per paid referral.
      </p>
      <div className="split">
        <form className="form panel" onSubmit={onSubmit}>
          <label>
            Your name
            <input name="yourName" />
          </label>
          <label>
            Your mobile
            <input name="yourPhone" />
          </label>
          <label>
            Friend's name
            <input name="friendName" />
          </label>
          <label>
            Friend's mobile
            <input name="friendPhone" />
          </label>
          <label>
            Their suburb
            <select name="suburb" defaultValue="">
              <option value="" disabled>
                Choose suburb
              </option>
              {SUBURBS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {error ? <div className="error">{error}</div> : null}
          {code ? (
            <div className="ok-box">
              Referral in. Your 25% code is <code>{code}</code>. Quote it on
              your next booking after they complete their job.
            </div>
          ) : null}
          <button className="submit-yellow" type="submit">
            Send referral
          </button>
        </form>
        <aside className="panel">
          <h3>How it works</h3>
          <p>1. You send us a friend who needs steam or a home clean.</p>
          <p>2. They book and pay for the job.</p>
          <p>3. You get 25% off your next KISHUKA visit.</p>
          <p>The discount sits on your account. It does not stack with the $40 first-clean offer.</p>
        </aside>
      </div>
    </section>
  );
}
