"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 720);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loading-screen" role="status" aria-label="Loading Leah Paws">
      <div className="loading-mark">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <ellipse className="paw-pad paw-pad-main" cx="60" cy="74" rx="25" ry="21" />
          <ellipse className="paw-pad paw-toe paw-toe-one" cx="31" cy="49" rx="10" ry="14" />
          <ellipse className="paw-pad paw-toe paw-toe-two" cx="52" cy="31" rx="10" ry="14" />
          <ellipse className="paw-pad paw-toe paw-toe-three" cx="78" cy="31" rx="10" ry="14" />
          <ellipse className="paw-pad paw-toe paw-toe-four" cx="89" cy="52" rx="10" ry="14" />
        </svg>
        <span>Leah Paws</span>
      </div>
    </div>
  );
}
