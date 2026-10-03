"use client";

import { asset } from "../../lib/paths";

export default function ThanksPage() {
  return (
    <div className="page narrow">
      <header className="page-intro">
        <p className="eyebrow">Collaboration</p>
        <h1>Thank you for submitting the form</h1>
        <p>
          Isha has your collaboration note. A thank-you email is on its way to the address you entered: “Thank you for sending collaboration to Isha.”
        </p>
        <p>
          <a className="primary" href={asset("/")}>Back to Isha’s studio</a>
        </p>
      </header>
    </div>
  );
}
