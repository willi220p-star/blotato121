"use client";

import { Suspense } from "react";
import { CreateView } from "../../components/create-view";

export default function Page() {
  return (
    <Suspense fallback={<div className="page"><p>Opening the composer…</p></div>}>
      <CreateView />
    </Suspense>
  );
}
