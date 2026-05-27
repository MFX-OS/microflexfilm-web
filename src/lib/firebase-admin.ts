import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * In Firebase App Hosting the runtime injects Application Default Credentials
 * automatically — no service-account JSON needed.
 *
 * Locally, you can either:
 *   1. Run `gcloud auth application-default login`, OR
 *   2. Set FIREBASE_SERVICE_ACCOUNT_KEY to a JSON string of a service account.
 */
function initAdmin(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0]!;

  const projectId = process.env.FIREBASE_PROJECT_ID ?? "mfx-2026";

  // Service account JSON passed via env (useful for local dev / CI)
  const saKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (saKey) {
    try {
      const credentials = JSON.parse(saKey);
      return initializeApp({
        credential: cert(credentials),
        projectId,
      });
    } catch (e) {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY present but unparseable — falling back to ADC.");
    }
  }

  // Default path — works inside App Hosting / Cloud Run / Functions.
  return initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

const app = initAdmin();
export const adminDb = getFirestore(app);
