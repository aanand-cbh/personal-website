'use client'

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error)
    }
  }, [error])

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
          onClick={() => window.location.href = '/'}
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
}

export function ErrorBoundary({ 
  children, 
  onReset 
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        if (onReset) {
          onReset()
        } else {
          window.location.reload()
        }
      }}
      onError={(error) => {
        // You could send this to your error tracking service
        console.error('Error caught by boundary:', error)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
} 