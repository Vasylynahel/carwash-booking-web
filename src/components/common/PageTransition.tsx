import type { ReactNode } from 'react';
import { LazyMotion, m, useReducedMotion } from 'motion/react';

// Плавна поява сторінки. Якщо в системі ввімкнено «зменшити рух», анімації немає.
// У layout-ах викликається з key={location.pathname}, тому анімація грає на кожну зміну маршруту.
// LazyMotion + m замість motion: рушій анімацій завантажується окремо й не роздуває основний пакет.
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={() => import('./motionFeatures').then((mod) => mod.default)} strict>
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
