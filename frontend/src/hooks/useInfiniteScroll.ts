import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void // hàm callback được gọi khi ref được thấy
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

  // entries là 1 array chứa các observer, target ở đây là ref đến 1 element nào đó
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      // Nếu ref được thấy và có thêm dữ liệu và không đang loading thì gọi hàm onLoadMore
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

    // 1. Tạo observer để theo dõi ref (ref đến 1 element nào đó)
    // nếu theo dõi được ref thì sẽ gọi hàm handleObserver
    observerRef.current = new IntersectionObserver(handleObserver, options)

    // 2. Tạo biến để lưu ref
    const currentSentinel = sentinelRef.current

    if (currentSentinel) {
      // 3. Bắt đầu theo dõi ref
      observerRef.current.observe(currentSentinel)
    }

    return () => {
      // 4. Dừng theo dõi ref khi component unmount
      if (observerRef.current && currentSentinel) {
        observerRef.current.unobserve(currentSentinel)
      }
    }
  }, [handleObserver, rootMargin, threshold])

  return sentinelRef
}
