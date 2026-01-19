"use client";

import { useState, useEffect } from "react";
import { SanityApp } from "@sanity/sdk-react";
import { dataset, projectId } from "@/sanity/env";

function SanityAppProvider({ children }: { children: React.ReactNode }) {
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Set callback URL only on client side to avoid hydration mismatch
    setCallbackUrl(`${window.location.origin}/admin`);
  }, []);

  return (
    <SanityApp
      config={[
        {
          projectId,
          dataset,
          auth: {
            callbackUrl,
          },
        },
      ]}
      // We handle the loading state in the Providers component by showing a loading indicator via the dynamic import
      fallback={<div />}
    >
      {children}
    </SanityApp>
  );
}

export default SanityAppProvider;
