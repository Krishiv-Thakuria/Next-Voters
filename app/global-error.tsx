'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
              <CardDescription>
                We've encountered an unexpected error. Our team has been notified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* You could display error.message or error.digest here if needed, but be careful about exposing sensitive details to users */}
              {/* <p className="text-sm text-muted-foreground">Error details: {error?.message}</p> */}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => reset()}>Try again</Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  );
} 