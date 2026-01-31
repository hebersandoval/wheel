import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [time, setTime] = useState(0); // Seconds.
    const [running, setRunning] = useState(false);
    const [customMin, setCustomMin] = useState('');

    useEffect(() => {
        let interval;
        if (running && time > 0) {
            interval = setInterval(() => setTime((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [running, time]);

    const addMinutes = (min) => setTime((prev) => prev + min * 60);

    const handleCustom = () => {
        const min = parseInt(customMin, 10);
        if (!isNaN(min)) addMinutes(min);
        setCustomMin('');
    };

    const formatTime = () => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="card timer" style={{ marginTop: '24px' }}>
            <h2 style={{ margin: '6px 0 8px', color: 'var(--muted)' }}>Countdown Timer</h2>
            <div className="timer-display">{formatTime()}</div>

            {/* Row 1: +1 min only */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <button onClick={() => addMinutes(1)} style={{ width: '100%', maxWidth: '160px' }}>
                    +1 min
                </button>
            </div>

            {/* Row 2: Custom minute input and Add */}
            <div className="controls" style={{ marginBottom: '12px' }}>
                <input
                    type="number"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    placeholder="Custom min"
                    style={{ flex: 1 }}
                />
                <button onClick={handleCustom} style={{ padding: '8px 12px' }}>
                    Add
                </button>
            </div>

            {/* Start/Pause and Reset (inline) */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                    onClick={() => setRunning(!running)}
                    style={{ flex: 1, background: running ? '#ef4444' : undefined }}>
                    {running ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={() => {
                        setTime(0);
                        setRunning(false);
                    }}
                    style={{ flex: 1, background: '#e6e9ef', color: '#111827' }}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
