'use client'

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error)
    }
  }, [error])

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border p-8 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">
        {process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-4">
        <Button onClick={resetErrorBoundary}>Try again</Button>
        <Button 
          variant="outline" 
          onClick={() => {
            try {
              window.location.href = '/'
            } catch (e) {
              // Fallback if navigation fails
              window.location.reload()
            }
          }}
        >
          Go to home
        </Button>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
  fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
}

export function ErrorBoundary({ 
  children, 
  onReset,
  fallback: FallbackComponent = ErrorFallback
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onReset={() => {
        try {
          if (onReset) {
            onReset()
          } else {
            window.location.reload()
          }
        } catch (error) {
          console.error('Error during reset:', error)
          // Fallback to page reload
          window.location.reload()
        }
      }}
      onError={(error, errorInfo) => {
        // Enhanced error logging
        console.error('Error caught by boundary:', error)
        console.error('Error info:', errorInfo)
        
        // You could send this to your error tracking service here
        // Example: Sentry.captureException(error, { extra: errorInfo })
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
} 