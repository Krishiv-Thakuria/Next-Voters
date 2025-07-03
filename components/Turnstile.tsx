'use client';

import { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'compact';
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export default function Turnstile({
  onVerify,
  onError,
  onExpire,
  className = '',
  theme = 'light',
  size = 'normal'
}: TurnstileProps) {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="turnstile"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && turnstileRef.current && window.turnstile && !widgetId) {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      
      if (!siteKey) {
        console.error('Turnstile site key not found');
        return;
      }

      try {
        const id = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onExpire,
          theme,
          size
        });
        setWidgetId(id);
      } catch (error) {
        console.error('Failed to render Turnstile:', error);
      }
    }
  }, [isLoaded, onVerify, onError, onExpire, theme, size, widgetId]);

  // Reset widget
  const reset = () => {
    if (window.turnstile && widgetId) {
      window.turnstile.reset(widgetId);
    }
  };

  // Expose reset function
  useEffect(() => {
    (turnstileRef.current as any)?.reset && ((turnstileRef.current as any).reset = reset);
  }, [widgetId]);

  return (
    <div 
      ref={turnstileRef} 
      className={`turnstile-widget ${className}`}
      data-testid="turnstile-widget"
    />
  );
}
