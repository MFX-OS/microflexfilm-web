"use client";

// Augment the Window type so TypeScript knows about Tidio's runtime API.
declare global {
  interface Window {
    tidioChatApi?: {
      open?: () => void;
      show?: () => void;
    };
  }
}

interface ChatButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
}

/**
 * Renders a button that opens the Tidio chat widget on click.
 *
 * Tidio loads asynchronously (via next/script with strategy="afterInteractive"),
 * so on first render the API may not be ready yet. If it isn't, we listen for
 * the "tidioChat-ready" event and open as soon as Tidio finishes loading.
 *
 * Fallback if Tidio is blocked or not loaded: do nothing visible (no error).
 * Real-world hit rate is essentially 100% once the page has had a few hundred
 * ms to finish hydrating.
 */
export default function ChatButton({
  className,
  style,
  children,
  ariaLabel = "Open live chat",
}: ChatButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    const api = window.tidioChatApi;
    if (api?.open) {
      // Show first in case the widget is hidden, then open the panel.
      api.show?.();
      api.open();
      return;
    }

    // Tidio not loaded yet — wait for it.
    const onReady = () => {
      window.tidioChatApi?.show?.();
      window.tidioChatApi?.open?.();
      document.removeEventListener("tidioChat-ready", onReady);
    };
    document.addEventListener("tidioChat-ready", onReady);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
