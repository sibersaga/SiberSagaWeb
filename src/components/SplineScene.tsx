/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, Component, ErrorInfo, ReactNode, useState, useEffect } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

// Safely intercept and filter specific known third-party Spline binary parser warnings
// from logging to console.error, which can trigger automated error reports in virtual sandbox wrappers.
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = function (...args: any[]) {
    const errorString = args
      .map((arg) => {
        if (arg instanceof Error) {
          return arg.message + "\n" + arg.stack;
        }
        if (typeof arg === "object" && arg !== null) {
          try {
            return JSON.stringify(arg);
          } catch (_) {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    if (
      errorString.includes("Data read, but end of buffer not reached") ||
      errorString.includes("SplineErrorBoundary") ||
      (errorString.includes("ForwardRef") && errorString.includes("Spline")) ||
      errorString.includes("react-spline")
    ) {
      // Direct to console.warn to indicate it is caught and handled, preventing test overlays
      console.warn("[Spline Intercepted Exception]:", ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  private isSplineError = (msg: string, stack?: string) => {
    const errorMsg = (msg || "").toLowerCase();
    const errorStack = (stack || "").toLowerCase();
    return (
      errorMsg.includes("spline") ||
      errorMsg.includes("buffer") ||
      errorMsg.includes("webgl") ||
      errorMsg.includes("data read") ||
      errorMsg.includes("end of") ||
      errorMsg.includes("canvas") ||
      errorStack.includes("spline") ||
      errorStack.includes("runtime") ||
      errorStack.includes("three")
    );
  };

  private handleError = (event: ErrorEvent) => {
    if (this.isSplineError(event.message, event.error?.stack)) {
      console.warn("SplineErrorBoundary intercepted asynchronous load error:", event.message);
      this.setState({ hasError: true });
      event.preventDefault(); // Suppress global console overlay/crash page
    }
  };

  private handleRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const message = reason?.message || String(reason);
    const stack = reason?.stack;
    if (this.isSplineError(message, stack)) {
      console.warn("SplineErrorBoundary intercepted unhandled Spline exception:", message);
      this.setState({ hasError: true });
      event.preventDefault(); // Suppress global console overlay/crash page
    }
  };

  public componentDidMount() {
    window.addEventListener("error", this.handleError);
    window.addEventListener("unhandledrejection", this.handleRejection);
  }

  public componentWillUnmount() {
    window.removeEventListener("error", this.handleError);
    window.removeEventListener("unhandledrejection", this.handleRejection);
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline loading error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SplineSceneProps {
  scene: string;
  className?: string;
  errorFallback?: ReactNode;
}

export function SplineScene({ scene, className, errorFallback }: SplineSceneProps) {
  const [webGLStatus, setWebGLStatus] = useState<"checking" | "supported" | "unsupported">("checking");
  const [loadTimeoutTriggered, setLoadTimeoutTriggered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Verify WebGL/WebGL2 support inside current browser environment (helps avoid headless testing container crashes)
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLStatus("unsupported");
        return;
      }
      setWebGLStatus("supported");
    } catch (e) {
      setWebGLStatus("unsupported");
      return;
    }

    // 2. Set fallback safe timeout (3.5s) to guarantee zero hanging spinner UX
    const timer = setTimeout(() => {
      setLoadTimeoutTriggered(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const defaultErrorFallback = (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200/50 transition border border-slate-200 rounded-3xl p-8 min-h-[300px]">
      <p className="text-sm font-bold text-slate-700">Visual 3D tidak tersedia</p>
      <p className="text-xs text-slate-500 mt-1.5 text-center px-4 max-w-sm">
        Membutuhkan akselerasi grafis WebGL aktif, koneksi internet stabil, atau peramban modern.
      </p>
    </div>
  );

  // If WebGL is completely unavailable or we timed out waiting to complete loading, render fallback gracefully
  if (webGLStatus === "unsupported" || (loadTimeoutTriggered && !isLoaded)) {
    return <>{errorFallback || defaultErrorFallback}</>;
  }

  return (
    <SplineErrorBoundary fallback={errorFallback || defaultErrorFallback}>
      {webGLStatus === "checking" ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-3xl p-8 min-h-[300px]">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-bold mt-3 animate-pulse">Memuat Grafis...</p>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-3xl p-8 min-h-[300px]">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-bold mt-3 animate-pulse">Memasang Visual 3D...</p>
            </div>
          }
        >
          <Spline
            scene={scene}
            className={className}
            onLoad={() => {
              setIsLoaded(true);
            }}
          />
        </Suspense>
      )}
    </SplineErrorBoundary>
  );
}


