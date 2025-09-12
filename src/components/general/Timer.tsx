import { forwardRef, useEffect, useState } from 'react'

export const Timer = forwardRef(() => {
    const [time, setTime] = useState<number>(0);
    const [, setCounter] = useState<NodeJS.Timer | null>(null);
    useEffect(() => {
        const interval = startCount();
        return () => {
            clearInterval(interval);
            clearTimer();
        }
        // eslint-disable-next-line
    }, [])
    const clearTimer = () => {
        setTime(0);
        setCounter(null);
    }
    const startCount = () => {
        clearTimer();
        const interval = setInterval(() => {
            setTime((prev) => prev + 0.1);
        }, 100);
        return interval;
    }
    return (
        <>
            {time.toFixed(2)}
        </>
    )
});
