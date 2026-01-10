"use client";

import { ResourceProvider } from "@sanity/sdk-react";
import { projectId, dataset } from "@/sanity/env";
import type { ReactNode } from "react";

interface SanitySdkProviderProps {
  children: ReactNode;
}

/**
 * Provides Sanity SDK context for client-side hooks like useQuery
 * This enables live data fetching in client components
 */
export function SanitySdkProvider({ children }: SanitySdkProviderProps) {
  return (
    <ResourceProvider 
      projectId={projectId} 
      dataset={dataset}
      fallback={null}
    >
      {children}
    </ResourceProvider>
  );
}
