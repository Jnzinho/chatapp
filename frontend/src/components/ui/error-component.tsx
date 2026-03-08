import { useState } from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { Button } from "./button";

export function DefaultErrorComponent({ error, reset }: ErrorComponentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="glass-panel animate-slide-up w-full max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,84,84,0.1)]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--error)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="font-display mb-1 text-xl font-bold text-ink">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-ink-muted">{message}</p>

        <div className="flex justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              reset();
              router.invalidate();
            }}
          >
            Try again
          </Button>
          <Button variant="ghost" onClick={() => setShowDetails((v) => !v)}>
            {showDetails ? "Hide details" : "Details"}
          </Button>
        </div>

        {showDetails && error instanceof Error && error.stack && (
          <pre className="mt-5 max-h-48 overflow-auto rounded-lg bg-[rgba(27,36,50,0.06)] p-3 text-left text-[11px] leading-relaxed text-ink-soft">
            {error.stack}
          </pre>
        )}
      </div>
    </div>
  );
}
