/**
 * Anti-spam detection for the Microflex inquiry form.
 *
 * Layered defense:
 *   1. Honeypot field — bots fill all fields; humans never see it
 *   2. Submit-time threshold — humans take 10+ seconds; bots are sub-2s
 *   3. Disposable email block — mailinator, tempmail, guerrillamail, etc.
 *   4. URL count — more than 2 URLs in a message is spam
 *   5. Keyword blocklist — crypto, SEO, casino, pharma, loan spam
 *   6. All-caps detection — message that's 80%+ uppercase and long is spam
 *   7. Gibberish detection — random keyboard mashing
 *
 * Returns { ok: true } on pass, or { ok: false, reason } on reject.
 * Caller logs the reason to Firestore for audit and tuning.
 */

export type SpamCheckResult =
  | { ok: true }
  | { ok: false; reason: string; layer: string };

// --------- 1. Honeypot ----------------------------------------------------
export function checkHoneypot(value: string | null | undefined): SpamCheckResult {
  if (value && value.trim().length > 0) {
    return { ok: false, layer: "honeypot", reason: `honeypot filled: "${value.slice(0, 40)}"` };
  }
  return { ok: true };
}

// --------- 2. Submit-time threshold ---------------------------------------
const MIN_FILL_SECONDS = 3;
const MAX_FILL_HOURS = 24;

export function checkTiming(formLoadedAtMs: number | null): SpamCheckResult {
  if (!formLoadedAtMs || isNaN(formLoadedAtMs)) {
    // No timestamp = either JS disabled, or bot stripped it. Reject.
    return { ok: false, layer: "timing", reason: "missing form load timestamp" };
  }
  const elapsedMs = Date.now() - formLoadedAtMs;
  const elapsedSec = elapsedMs / 1000;

  if (elapsedSec < MIN_FILL_SECONDS) {
    return {
      ok: false,
      layer: "timing",
      reason: `submitted in ${elapsedSec.toFixed(1)}s (min ${MIN_FILL_SECONDS}s)`,
    };
  }
  if (elapsedSec > MAX_FILL_HOURS * 3600) {
    return {
      ok: false,
      layer: "timing",
      reason: `form open for ${(elapsedSec / 3600).toFixed(1)}h (stale token)`,
    };
  }
  return { ok: true };
}

// --------- 3. Disposable email block --------------------------------------
// Top disposable email providers. Update list as new ones surface.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.org",
  "temp-mail.org",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.biz",
  "sharklasers.com",
  "10minutemail.com",
  "10minutemail.net",
  "trashmail.com",
  "trashmail.net",
  "throwawaymail.com",
  "yopmail.com",
  "yopmail.fr",
  "fakeinbox.com",
  "getairmail.com",
  "dispostable.com",
  "maildrop.cc",
  "mintemail.com",
  "spam4.me",
  "tempinbox.com",
  "tempmail.net",
  "tempmail.com",
  "tempr.email",
  "throwaway.email",
  "mohmal.com",
  "emailondeck.com",
  "anonbox.net",
  "deadaddress.com",
  "mytemp.email",
  "0-mail.com",
  "20minutemail.com",
  "33mail.com",
  "armyspy.com",
  "byom.de",
  "cuvox.de",
  "dayrep.com",
  "einrot.com",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "mvrht.com",
  "tutanota.com", // ban encrypted services if causing issues (optional)
]);

export function checkEmail(email: string): SpamCheckResult {
  if (!email) return { ok: true };
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) {
    return { ok: false, layer: "email", reason: "malformed email (no domain)" };
  }
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, layer: "email", reason: `disposable email domain: ${domain}` };
  }
  // Block emails ending in numbers — most fake/throwaway accounts pattern
  // Skip this — too aggressive for B2B (real people have name123@gmail.com)
  return { ok: true };
}

// --------- 4. URL count ---------------------------------------------------
const URL_REGEX = /\b(?:https?:\/\/|www\.)\S+/gi;

export function checkUrlCount(message: string): SpamCheckResult {
  if (!message) return { ok: true };
  const matches = message.match(URL_REGEX) || [];
  if (matches.length > 2) {
    return {
      ok: false,
      layer: "url-count",
      reason: `${matches.length} URLs in message (max 2)`,
    };
  }
  return { ok: true };
}

// --------- 5. Keyword blocklist -------------------------------------------
// Substring match (case-insensitive). Tuned for crypto / SEO / pharma / casino spam.
const SPAM_KEYWORDS = [
  // SEO / ranking spam
  "rank your site",
  "rank your website",
  "first page of google",
  "guaranteed ranking",
  "buy backlinks",
  "high da backlinks",
  "seo services",
  "seo expert",
  "improve your seo",
  "boost your rankings",
  // Crypto / investment
  "crypto",
  "bitcoin",
  "btc investment",
  "trading signals",
  "forex",
  "binary options",
  "nft project",
  "ico launch",
  // Casino / gambling
  "casino",
  "online betting",
  "sports betting",
  "judi online",
  "slot online",
  "togel",
  // Pharma / adult
  "viagra",
  "cialis",
  "kamagra",
  "porn",
  "xxx",
  "escort",
  // Loans / financial scams
  "payday loan",
  "personal loan",
  "guaranteed approval",
  "credit repair",
  // Generic mass-mail openers
  "dear sir/madam",
  "dear sir / madam",
  "i am writing to inform",
  "this is to bring to your notice",
  "kindly check the attached",
];

export function checkKeywords(message: string): SpamCheckResult {
  if (!message) return { ok: true };
  const lower = message.toLowerCase();
  for (const kw of SPAM_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        ok: false,
        layer: "keywords",
        reason: `spam keyword: "${kw}"`,
      };
    }
  }
  return { ok: true };
}

// --------- 6. All-caps detection ------------------------------------------
export function checkAllCaps(message: string): SpamCheckResult {
  if (!message || message.length < 40) return { ok: true };
  const letters = message.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 30) return { ok: true };
  const upperCount = (letters.match(/[A-Z]/g) || []).length;
  const ratio = upperCount / letters.length;
  if (ratio > 0.8) {
    return {
      ok: false,
      layer: "all-caps",
      reason: `${Math.round(ratio * 100)}% uppercase`,
    };
  }
  return { ok: true };
}

// --------- 7. Gibberish detection -----------------------------------------
// Detect long runs of consonants (random keyboard mashing) or absurdly long
// single "words" (no spaces).
export function checkGibberish(message: string): SpamCheckResult {
  if (!message) return { ok: true };

  // Single "word" longer than 40 chars = gibberish
  const longestWord = message.split(/\s+/).reduce((max, w) => Math.max(max, w.length), 0);
  if (longestWord > 40) {
    return {
      ok: false,
      layer: "gibberish",
      reason: `single word ${longestWord} chars long`,
    };
  }

  // 7+ consonants in a row = gibberish (no English word has this)
  if (/[bcdfghjklmnpqrstvwxyz]{7,}/i.test(message)) {
    return { ok: false, layer: "gibberish", reason: "7+ consonants in a row" };
  }

  // 6+ vowels in a row = gibberish
  if (/[aeiou]{6,}/i.test(message)) {
    return { ok: false, layer: "gibberish", reason: "6+ vowels in a row" };
  }

  return { ok: true };
}


// --------- 8. File link validation ----------------------------------------
// Accept only plain http(s) links to real hostnames — no IP literals,
// no embedded credentials, no exotic schemes.
export function checkFileLink(link: string): SpamCheckResult {
  if (!link) return { ok: true };
  if (link.length > 500) {
    return { ok: false, layer: "file-link", reason: "file link too long" };
  }
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return { ok: false, layer: "file-link", reason: "file link is not a valid URL" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, layer: "file-link", reason: `blocked scheme: ${url.protocol}` };
  }
  if (url.username || url.password) {
    return { ok: false, layer: "file-link", reason: "credentials embedded in URL" };
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname) || url.hostname === "localhost") {
    return { ok: false, layer: "file-link", reason: "IP-literal or localhost host" };
  }
  return { ok: true };
}

// --------- Master check ---------------------------------------------------
export interface SpamCheckInput {
  honeypot: string | null;
  formLoadedAtMs: number | null;
  email: string;
  message: string;
  fileLink?: string;
}

export function runAllChecks(input: SpamCheckInput): SpamCheckResult {
  const checks: SpamCheckResult[] = [
    checkHoneypot(input.honeypot),
    checkTiming(input.formLoadedAtMs),
    checkEmail(input.email),
    checkUrlCount(input.message),
    checkKeywords(input.message),
    checkAllCaps(input.message),
    checkGibberish(input.message),
    checkFileLink(input.fileLink ?? ""),
  ];

  for (const result of checks) {
    if (!result.ok) return result;
  }
  return { ok: true };
}
