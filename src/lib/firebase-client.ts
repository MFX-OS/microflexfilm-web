"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

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
};

export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.appId);
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

export const googleProvider = new GoogleAuthProvider();
