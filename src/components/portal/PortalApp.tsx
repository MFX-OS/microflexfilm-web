"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase-client";
import { getPortalData, type PortalData } from "@/app/actions/portal";
import Login from "./Login";
import {
  Overview,
  Quotes,
  Orders,
  Status,
  Messages,
  Documents,
  Account,
  type SectionKey,
} from "./Sections";

/* ============ shell ============ */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-4xl p-5 md:p-8"
      style={{
        border: "1px solid rgba(0,216,242,0.25)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
      }}
    >
      {children}
    </div>
  );
}

/* ============ nav config ============ */

const NAV: { key: SectionKey; label: string; icon: string; badge?: keyof PortalData["badges"] }[] = [
  { key: "overview", label: "Overview", icon: "▦" },
  { key: "quotes", label: "Quotes", icon: "📝", badge: "quotesToReview" },
  { key: "orders", label: "Orders", icon: "📦", badge: "ordersToSign" },
  { key: "status", label: "Status", icon: "📍", badge: "inProduction" },
  { key: "messages", label: "Messages", icon: "💬", badge: "unreadMessages" },
  { key: "documents", label: "Documents", icon: "📁" },
  { key: "account", label: "My Company", icon: "🏢", badge: "profilePending" },
];

/* ============ main app ============ */

export default function PortalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<SectionKey>("overview");
  const [error, setError] = useState<string | null>(null);

  const auth = getFirebaseAuth();

  useEffect(() => {
    if (!auth) { setAuthReady(true); return; }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, [auth]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      setData(await getPortalData(token));
    } catch {
      setError("Could not load your workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) void refresh();
  }, [user, refresh]);

  /* ----- gates ----- */

  if (!isFirebaseConfigured()) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-2xl p-8 text-center" style={{ border: "1px solid rgba(0,216,242,0.2)" }}>
          <h2 className="mb-2 text-xl font-bold text-paper">Client portal coming online</h2>
          <p className="text-sm leading-relaxed text-muted">
            Secure client sign-in is being activated. In the meantime, use the{" "}
            <a href="/#quote-form" className="font-bold text-cyan underline">project form</a>{" "}
            or email <span className="text-paper">info@microflexfilm.com</span>.
          </p>
        </div>
      </Shell>
    );
  }

  if (!authReady) {
    return (
      <Shell>
        <p className="py-10 text-center text-muted">Loading…</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <Login />
      </Shell>
    );
  }

  const badges = data?.badges;

  return (
    <Shell>
      {/* workspace header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="kicker mb-1">Client Workspace</div>
          <h2 className="text-2xl font-black text-paper md:text-3xl">
            Welcome back{user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}.
          </h2>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void refresh()} className="btn btn-secondary" style={loading ? { opacity: 0.6 } : undefined}>
            ↻ {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button type="button" onClick={() => auth && void signOut(auth)} className="btn btn-dark">
            Sign Out
          </button>
        </div>
      </div>

      {/* nav */}
      <div className="mb-8 flex flex-wrap gap-2">
        {NAV.map((item) => {
          const count = item.badge && badges ? badges[item.badge] : 0;
          const activeTab = section === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSection(item.key)}
              className="relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition"
              style={{
                border: `1px solid ${activeTab ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
                background: activeTab
                  ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))"
                  : "rgba(255,255,255,0.03)",
                color: activeTab ? "#34e3f5" : "#a9b9c8",
              }}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
              {count > 0 && (
                <span
                  className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-black"
                  style={{ background: "#00d8f2", color: "#001018" }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {/* sections */}
      {!data && loading ? (
        <p className="py-10 text-center text-muted">Loading your workspace…</p>
      ) : data ? (
        <>
          {section === "overview" && <Overview data={data} go={setSection} />}
          {section === "quotes" && <Quotes data={data} user={user} refresh={() => void refresh()} />}
          {section === "orders" && <Orders data={data} user={user} refresh={() => void refresh()} />}
          {section === "status" && <Status data={data} />}
          {section === "messages" && <Messages data={data} user={user} refresh={() => void refresh()} />}
          {section === "documents" && <Documents data={data} />}
          {section === "account" && <Account data={data} user={user} refresh={() => void refresh()} />}
        </>
      ) : null}
    </Shell>
  );
}
