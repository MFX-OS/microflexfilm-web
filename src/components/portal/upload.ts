"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage, isStorageConfigured } from "@/lib/firebase-client";

export { isStorageConfigured };

export type UploadResult = { name: string; url: string; contentType: string; size: number };

/**
 * Upload a portal file to the SAME Storage path the MFX-OS uses:
 *   portal-uploads/quotes/{quoteId}/{kind}/{timestamp}_{name}
 *
 * The OS storage.rules grant the signed-in customer write access here when
 * their email matches the quote's poClientEmail / fields.custEmail (isQuoteCustomer),
 * and cap uploads at 25 MB. Keep this path in sync with MFX-OS/storage.rules.
 */
export async function uploadPortalFile(
  quoteId: string,
  kind: "po" | "art",
  file: File
): Promise<UploadResult> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("STORAGE_NOT_CONFIGURED");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `portal-uploads/quotes/${quoteId}/${kind}/${Date.now()}_${safeName}`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type || "application/octet-stream" });
  const url = await getDownloadURL(r);
  return { name: file.name, url, contentType: file.type || "application/octet-stream", size: file.size };
}
