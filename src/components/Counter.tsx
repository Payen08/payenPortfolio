import { useEffect, useRef } from 'react';
import { useInView, animate } from 'motion/react';

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function Counter({ from = 0, to, duration = 2, suffix = '', prefix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          if (ref.current) {
            ref.current.textContent = `${prefix}${Math.round(value)}${suffix}`;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration, prefix, suffix]);

  return <span ref={ref}>{prefix}{from}{suffix}</span>;
}
