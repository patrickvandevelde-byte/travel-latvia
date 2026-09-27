"use client";

import { useId, useState } from "react";
import { enquirySchema } from "@/modules/enquiries/schema";

type Props = {
  tripTypes: string[];
  submitLabel: string;
  note?: string | null;
  successMessage: string;
  fallbackEmail?: string | null;
};

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string; fields?: Record<string, string> };

export function EnquiryForm({ tripTypes, submitLabel, note, successMessage, fallbackEmail }: Props) {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "idle" });
  const f = (name: string) => `${id}-${name}`;
  const fieldError = (name: string) => (state.kind === "error" ? state.fields?.[name] : undefined);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    data.sourcePath = window.location.pathname;
    data.locale = document.documentElement.lang || "en";
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) if (v?.[0]) fields[k] = v[0];
      setState({ kind: "error", message: "Please check the highlighted fields.", fields });
      return;
    }
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 503 && fallbackEmail) {
        // Not wired up yet: hand over to the visitor's email app so no enquiry is lost.
        const body = Object.entries(parsed.data)
          .filter(([k, v]) => v && !["website", "sourcePath", "locale"].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n");
        window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(`Enquiry from ${parsed.data.name}`)}&body=${encodeURIComponent(body)}`;
        setState({ kind: "ok", message: "Your email app should open with the enquiry pre-filled." });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState({ kind: "ok", message: successMessage });
    } catch {
      setState({
        kind: "error",
        message: fallbackEmail
          ? `Something went wrong. Please email ${fallbackEmail} directly.`
          : "Something went wrong. Please try again.",
      });
    }
  }

  const input = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="grid gap-1.5">
      <label htmlFor={f(name)} className="text-[13px] font-semibold">
        {label}
      </label>
      <input
        id={f(name)}
        name={name}
        className="field-input"
        aria-invalid={fieldError(name) ? true : undefined}
        aria-describedby={fieldError(name) ? f(`${name}-err`) : undefined}
        {...props}
      />
      {fieldError(name) ? (
        <p id={f(`${name}-err`)} className="text-red text-sm">
          {fieldError(name)}
        </p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border-red bg-cream grid gap-3.5 rounded-[28px] border-[1.5px] p-5 sm:p-8"
    >
      {input("name", "Full name", { type: "text", autoComplete: "name", required: true })}
      {input("email", "Email address", { type: "email", autoComplete: "email", required: true })}
      {input("phone", "Phone number", { type: "tel", autoComplete: "tel" })}
      {input("period", "Travel period", { type: "text", placeholder: "e.g. October 2027, 5 to 7 days" })}
      <div className="grid gap-1.5">
        <label htmlFor={f("tripType")} className="text-[13px] font-semibold">
          What type of trip do you prefer?
        </label>
        <select id={f("tripType")} name="tripType" className="field-input" defaultValue="">
          <option value="">Choose one</option>
          {tripTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={f("wishes")} className="text-[13px] font-semibold">
          Wishes
        </label>
        <textarea id={f("wishes")} name="wishes" rows={5} className="field-input min-h-[120px] resize-y" />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={f("website")}>Website</label>
        <input id={f("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-solid w-full" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending…" : submitLabel}
      </button>
      <p
        role="status"
        aria-live="polite"
        className={`min-h-[1.4em] text-sm ${state.kind === "error" ? "text-red" : "text-forest"}`}
      >
        {state.kind === "ok" || state.kind === "error" ? state.message : ""}
      </p>
      {note ? <p className="text-ink-soft text-center text-xs">{note}</p> : null}
    </form>
  );
}
