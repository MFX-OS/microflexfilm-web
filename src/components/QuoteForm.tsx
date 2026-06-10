"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitInquiry } from "@/app/actions/submitInquiry";

const ACCEPT = ".ai,.pdf,.psd,.png,.jpg,.jpeg,.tif,.tiff,.eps,.zip,.svg";
const MAX_FILES = 3;
const MAX_TOTAL_MB = 10;

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn btn-primary mt-2"
      style={pending || disabled ? { opacity: 0.55, pointerEvents: "none" } : undefined}
    >
      {pending ? "Submitting…" : "Submit Project Request"}
    </button>
  );
}

export default function QuoteForm() {
  // Anti-spam: capture the time the form mounts on the client.
  const [formLoadedAtMs, setFormLoadedAtMs] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const submittedRef = useRef(false);

  useEffect(() => {
    setFormLoadedAtMs(Date.now());
  }, []);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setFileError(null);
    if (files.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files — for more, share a link below instead.`);
      e.target.value = "";
      setFileNames([]);
      return;
    }
    const total = files.reduce((s, f) => s + f.size, 0);
    if (total > MAX_TOTAL_MB * 1024 * 1024) {
      setFileError(`Files exceed ${MAX_TOTAL_MB} MB total — please share a link below instead.`);
      e.target.value = "";
      setFileNames([]);
      return;
    }
    setFileNames(files.map((f) => f.name));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Belt-and-suspenders double-submit guard (server dedupes too)
    if (submittedRef.current) {
      e.preventDefault();
      return;
    }
    submittedRef.current = true;
    // Re-allow after 15s in case of a network failure
    setTimeout(() => {
      submittedRef.current = false;
    }, 15000);
  }

  return (
    <section id="quote-form" className="py-16 md:py-20">
      <div className="container-x">
        <div className="grid gap-7 md:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="kicker mb-3">Start a Project</div>
            <h2 className="display text-[clamp(34px,4.3vw,62px)] text-paper">
              Tell us what you need.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Submit project information and the Microflex team will route your request to the
              right group for review.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-dark">
              Attach artwork or PO files directly (up to {MAX_FILES} files, {MAX_TOTAL_MB} MB
              total), or paste a link from Google Drive, Dropbox, or WeTransfer for larger
              files.
            </p>
          </div>

          <div
            className="rounded-[32px] p-7 md:p-8"
            style={{
              border: "1px solid rgba(0,216,242,0.22)",
              background: "rgba(255,255,255,0.045)",
            }}
          >
            <form action={submitInquiry} onSubmit={onSubmit} className="grid gap-3.5">
              {/* ===== Anti-spam fields (invisible to humans) ===== */}
              <div aria-hidden="true" style={honeypotStyle}>
                <label htmlFor="website">Website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>
              <input type="hidden" name="formLoadedAtMs" value={formLoadedAtMs ?? ""} />
              {/* ================================================== */}

              <div className="grid gap-3.5 sm:grid-cols-2">
                <Input name="name" placeholder="Contact Name" required />
                <Input name="company" placeholder="Company Name" required />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="phone" placeholder="Phone" />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Select name="requestType" required defaultValue="">
                  <option value="" disabled>
                    What do you need?
                  </option>
                  <option>Request a Quote</option>
                  <option>Upload Artwork</option>
                  <option>Upload a Purchase Order</option>
                  <option>Request a Sample Kit</option>
                  <option>Existing Project Support</option>
                </Select>
                <Select name="packagingType" defaultValue="">
                  <option value="" disabled>
                    Packaging Type
                  </option>
                  <option>Printed Film</option>
                  <option>Stand-Up Pouch</option>
                  <option>Lay Flat Pouch</option>
                  <option>Labels &amp; Stickers</option>
                  <option>Shrink Sleeves</option>
                  <option>Sachets / Stick Packs</option>
                  <option>Custom Packaging</option>
                </Select>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Input name="skus" placeholder="Number of SKUs" />
                <Input name="quantity" placeholder="Estimated Quantity" />
              </div>

              {/* ===== Files: direct upload + link ===== */}
              <div
                className="rounded-2xl p-4"
                style={{ border: "1px dashed rgba(0,216,242,0.35)", background: "rgba(0,216,242,0.04)" }}
              >
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-muted">
                    Artwork / PO files (optional)
                  </span>
                  <input
                    type="file"
                    name="files"
                    multiple
                    accept={ACCEPT}
                    onChange={onFilesChange}
                    className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-xs file:font-extrabold file:uppercase file:tracking-wider"
                    style={{ color: "#a9b9c8" }}
                  />
                </label>
                {fileNames.length > 0 && (
                  <p className="mt-2 text-xs text-cyan">✓ {fileNames.join(" · ")}</p>
                )}
                {fileError && <p className="mt-2 text-xs" style={{ color: "#ff9d9d" }}>{fileError}</p>}
                <p className="mt-2 text-[11px] leading-relaxed text-muted-dark">
                  Up to {MAX_FILES} files, {MAX_TOTAL_MB} MB total. AI, PDF, PSD, PNG, JPG,
                  TIFF, EPS, SVG, ZIP.
                </p>
              </div>
              <Input
                name="fileLink"
                type="url"
                placeholder="Or paste a file link (Google Drive, Dropbox, WeTransfer…)"
              />
              {/* ======================================= */}

              <Textarea
                name="message"
                placeholder="Tell us about your project, timeline, artwork status, materials, finishes, or questions."
              />
              <SubmitButton disabled={Boolean(fileError)} />
              <p className="text-xs text-muted-dark">
                By submitting this form, you are sending project information to Microflex for
                review. Submissions are screened automatically for spam and abuse.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  borderColor: "rgba(0,216,242,0.22)",
  background: "rgba(0,0,0,0.28)",
};

const honeypotStyle: React.CSSProperties = {
  position: "absolute",
  left: "-10000px",
  top: "auto",
  width: "1px",
  height: "1px",
  overflow: "hidden",
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl px-4 py-3.5 text-sm text-paper outline-none transition placeholder:text-paper/40 focus:border-cyan"
      style={{ ...inputStyle, border: `1px solid ${inputStyle.borderColor}` }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl px-4 py-3.5 text-sm text-paper outline-none transition focus:border-cyan"
      style={{ ...inputStyle, border: `1px solid ${inputStyle.borderColor}` }}
    >
      {props.children}
    </select>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={5}
      className="w-full rounded-2xl px-4 py-3.5 text-sm text-paper outline-none transition placeholder:text-paper/40 focus:border-cyan"
      style={{ ...inputStyle, border: `1px solid ${inputStyle.borderColor}` }}
    />
  );
}
