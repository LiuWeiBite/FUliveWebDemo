import { useLayoutEffect, useRef, type ReactNode } from "react";

type FitLabelProps = {
  children: ReactNode;
  className?: string;
  minScale?: number;
};

export function FitLabel({
  children,
  className,
  minScale = 0.65,
}: FitLabelProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const maxSize = parseFloat(getComputedStyle(el).fontSize) || 14;
      const minSize = maxSize * minScale;
      el.style.fontSize = "";
      let size = maxSize;
      el.style.fontSize = `${size}px`;
      while (el.scrollWidth > el.clientWidth && size > minSize) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }
    return () => observer.disconnect();
  }, [children, minScale]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
