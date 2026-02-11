import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  rootMargin?: string
  threshold?: number
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = '100px',
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [hasMore, loading, onLoadMore],
  )

  useEffect(() => {
    const options = {
      root: null,
      rootMargin,
      threshold,
    }

    observerRef.current = new IntersectionObserver(handleObserver, options)

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observerRef.current.observe(currentSentinel)
    }

    return () => {
      if (observerRef.current && currentSentinel) {
        observerRef.current.unobserve(currentSentinel)
      }
    }
  }, [handleObserver, rootMargin, threshold])

  return sentinelRef
}
