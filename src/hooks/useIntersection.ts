import { useEffect, useRef } from 'react';

// Викликає onVisible, коли елемент-«сторож» з'являється у вікні перегляду.
// Для нескінченного прокручування: сторож стоїть у кінці списку.
export function useIntersection<T extends Element>(onVisible: () => void, enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onVisible();
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onVisible, enabled]);

  return ref;
}
