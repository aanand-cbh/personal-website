"use client"

import { Mail, Share2 } from "lucide-react"
import { useEffect, useState } from "react"

import { FacebookIcon, LinkedinIcon, RedditIcon, TwitterIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
}

export function ShareButtons({ url, title, description = "" }: ShareButtonsProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [webShareSupported, setWebShareSupported] = useState(false)

  // Prevent hydration issues and check Web Share API support
  useEffect(() => {
    setIsMounted(true)
    setWebShareSupported(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  // Don't render during SSR
  if (!isMounted) {
    return null
  }

  // Handle native sharing via the Web Share API
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: description,
        url
      })
    } catch (error) {
      // AbortError is thrown when user cancels the share dialog
      // This is an expected behavior, not an actual error
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Share canceled by user')
      } else {
        // Only log real errors
        console.error('Error sharing:', error)
      }
    }
  }

  // Prepare social sharing URLs
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2">
        {webShareSupported && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9"
                onClick={handleNativeShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share via App</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share via App</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => window.open(twitterShareUrl, "_blank")}
            >
              <TwitterIcon className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Twitter</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => window.open(facebookShareUrl, "_blank")}
            >
              <FacebookIcon className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Facebook</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => window.open(linkedinShareUrl, "_blank")}
            >
              <LinkedinIcon className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => window.open(redditShareUrl, "_blank")}
            >
              <RedditIcon className="h-4 w-4" />
              <span className="sr-only">Share on Reddit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Reddit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => window.open(mailtoUrl, "_blank")}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Share via Email</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share via Email</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
} 