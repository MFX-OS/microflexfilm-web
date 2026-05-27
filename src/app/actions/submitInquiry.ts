"use server";

import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function submitInquiry(formData: FormData) {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    requestType: String(formData.get("requestType") ?? "").trim(),
    packagingType: String(formData.get("packagingType") ?? "").trim(),
    skus: String(formData.get("skus") ?? "").trim(),
    quantity: String(formData.get("quantity") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (!payload.name || !payload.email || !payload.company) {
    redirect("/contact-error?reason=missing-fields");
  }

  try {
    await adminDb.collection("inquiries").add({
      ...payload,
      source: "microflexfilm.com",
      createdAt: FieldValue.serverTimestamp(),
      status: "new",
    });
  } catch (err) {
    console.error("Failed to write inquiry to Firestore:", err);
    redirect("/contact-error?reason=server");
  }

  redirect("/thank-you");
}
