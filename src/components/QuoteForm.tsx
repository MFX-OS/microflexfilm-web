import { submitInquiry } from "@/app/actions/submitInquiry";

export default function QuoteForm() {
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
          </div>

          <div
            className="rounded-[32px] p-7 md:p-8"
            style={{
              border: "1px solid rgba(0,216,242,0.22)",
              background: "rgba(255,255,255,0.045)",
            }}
          >
            <form action={submitInquiry} className="grid gap-3.5">
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
                  <option>Labels & Stickers</option>
                  <option>Shrink Sleeves</option>
                  <option>Sachets / Stick Packs</option>
                  <option>Custom Packaging</option>
                </Select>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Input name="skus" placeholder="Number of SKUs" />
                <Input name="quantity" placeholder="Estimated Quantity" />
              </div>
              <Textarea
                name="message"
                placeholder="Tell us about your project, timeline, artwork status, materials, finishes, or questions."
              />
              <button type="submit" className="btn btn-primary mt-2">
                Submit Project Request
              </button>
              <p className="text-xs text-muted-dark">
                By submitting this form, you are sending project information to Microflex for
                review.
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
