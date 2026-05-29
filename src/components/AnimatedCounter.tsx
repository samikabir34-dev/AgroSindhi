import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    start?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    decimals?: number;
}

const AnimatedCounter = ({
    end,
    duration = 2000,
    start = 0,
    prefix = '',
    suffix = '',
    className = '',
    decimals = 0,
}: AnimatedCounterProps) => {
    const [count, setCount] = useState(start);
    const [hasAnimated, setHasAnimated] = useState(false);
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!countRef.current || hasAnimated) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    const startTime = Date.now();
                    const range = end - start;

                    const updateCount = () => {
                        const now = Date.now();
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function (ease-out)
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = start + range * easeOut;

                        setCount(current);

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            setCount(end);
                        }
                    };

                    requestAnimationFrame(updateCount);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(countRef.current);

        return () => observer.disconnect();
    }, [end, start, duration, hasAnimated]);

    return (
        <span ref={countRef} className={className}>
            {prefix}
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
};

export default AnimatedCounter;
