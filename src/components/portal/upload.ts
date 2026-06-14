"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage, isStorageConfigured } from "@/lib/firebase-client";

export { isStorageConfigured };

export type UploadResult = { name: string; url: string; contentType: string; size: number };

/**
 * Upload a file to Firebase Storage under the signed-in client's namespace.
 * Returns the file name + public download URL for recording in Firestore.
 */
export async function uploadPortalFile(
  uid: string,
  folder: string,
  file: File
): Promise<UploadResult> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("STORAGE_NOT_CONFIGURED");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `portal/${uid}/${folder}/${Date.now()}_${safeName}`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type || "application/octet-stream" });
  const url = await getDownloadURL(r);
  return { name: file.name, url, contentType: file.type || "application/octet-stream", size: file.size };
}
