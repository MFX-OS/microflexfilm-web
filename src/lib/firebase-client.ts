"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Firebase web (client) SDK config. These NEXT_PUBLIC_* values are public
 * client identifiers — not secrets. Set in apphosting.yaml for production
 * and .env.local for development.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "mfx-2026",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.appId);
}

export function isStorageConfigured(): boolean {
  return Boolean(config.storageBucket);
}

let app: FirebaseApp | null = null;

function getApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (app) return app;
  app = getApps().length > 0 ? getApps()[0]! : initializeApp(config);
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getApp();
  return a ? getAuth(a) : null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const a = getApp();
  if (!a || !isStorageConfigured()) return null;
  return getStorage(a);
}

export const googleProvider = new GoogleAuthProvider();

/* ============ passwordless email-link sign-in ============ */

const EMAIL_KEY = "mfx_portal_email_for_signin";

/** Send a one-time sign-in link to the given email. */
export async function sendPortalSignInLink(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Auth not configured");
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/portal`
      : "https://microflexfilm.com/portal";
  await sendSignInLinkToEmail(auth, email, {
    url,
    handleCodeInApp: true,
  });
  if (typeof window !== "undefined") {
    window.localStorage.setItem(EMAIL_KEY, email);
  }
}

/** True if the current URL is a returning email sign-in link. */
export function isReturningEmailLink(): boolean {
  const auth = getFirebaseAuth();
  if (!auth || typeof window === "undefined") return false;
  return isSignInWithEmailLink(auth, window.location.href);
}

/** Email stashed in localStorage when the link was requested (if same device). */
export function cachedSignInEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(EMAIL_KEY);
}

/** Complete the email-link sign-in on return. Prompts for email if not cached. */
export async function completeEmailLinkSignIn(
  emailOverride?: string
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Auth not configured");
  const email = emailOverride || cachedSignInEmail();
  if (!email) throw new Error("NEED_EMAIL");
  const cred = await signInWithEmailLink(auth, email, window.location.href);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(EMAIL_KEY);
    // Strip the auth params from the URL so a refresh doesn't retry.
    window.history.replaceState({}, document.title, "/portal");
  }
  return cred;
}
