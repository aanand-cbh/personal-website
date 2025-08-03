'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface ImageProps extends NextImageProps {
  wrapperClassName?: string
}

export function Image({ wrapperClassName, className, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn('overflow-hidden', wrapperClassName)}>
      <NextImage
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        alt={alt}
        priority={props.priority || false}
        loading={props.loading || 'lazy'}
        sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        quality={props.quality || 85}
        {...props}
      />
    </div>
  )
} 