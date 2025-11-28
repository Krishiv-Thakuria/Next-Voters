"use client";
import { ReactNode, Component, Suspense } from "react";
import dynamic from "next/dynamic";

interface AuthProviderProps {
  children: ReactNode;
}

// Dynamically import KindeProvider to handle initialization errors
const KindeProvider = dynamic(
  () => import("@kinde-oss/kinde-auth-nextjs").then((mod) => mod.KindeProvider),
  { 
    ssr: false,
    loading: () => null // Don't show loading, just render children
  }
);

interface ErrorBoundaryState {
  hasError: boolean;
}

class KindeErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log error but don't crash the app
    console.warn("KindeProvider error (likely missing env vars):", error.message);
  }

  render() {
    if (this.state.hasError) {
      // If Kinde fails, just render children without auth
      return <>{this.props.children}</>;
    }

    return this.props.children;
  }
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  // Check if Kinde env vars are available (client-side only checks NEXT_PUBLIC_ vars)
  const hasKindeConfig = typeof window !== 'undefined' && 
    (process.env.NEXT_PUBLIC_KINDE_SITE_URL || process.env.NEXT_PUBLIC_KINDE_ISSUER_URL);

  // If no Kinde config, skip the provider
  if (!hasKindeConfig) {
    return <>{children}</>;
  }

  return (
    <KindeErrorBoundary>
      <Suspense fallback={<>{children}</>}>
        <KindeProvider>{children}</KindeProvider>
      </Suspense>
    </KindeErrorBoundary>
  );
};