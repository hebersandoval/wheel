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
        <div style={{ marginTop: '40px', textAlign: 'center', width: '300px' }}>
            <h2>Countdown Timer</h2>
            <div style={{ fontSize: '72px', marginBottom: '10px' }}>{formatTime()}</div>

            {/* Row 1: +1 and +5 min */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                <button onClick={() => addMinutes(1)} style={{ padding: '5px 10px', flex: 1, marginRight: '5px' }}>
                    +1 min
                </button>
                <button onClick={() => addMinutes(5)} style={{ padding: '5px 10px', flex: 1, marginLeft: '5px' }}>
                    +5 min
                </button>
            </div>

            {/* Row 2: +10 min and custom */}
            <div
                style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '10px' }}>
                <button onClick={() => addMinutes(10)} style={{ padding: '5px 10px', flex: 1, marginRight: '5px' }}>
                    +10 min
                </button>
                <input
                    type="number"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    placeholder="Custom min"
                    style={{ padding: '5px', flex: 1, marginRight: '5px' }}
                />
                <button onClick={handleCustom} style={{ padding: '5px 10px' }}>
                    Add
                </button>
            </div>

            {/* Start/Pause and Reset */}
            <button
                onClick={() => setRunning(!running)}
                style={{
                    marginBottom: '10px',
                    padding: '10px 20px',
                    background: running ? '#f44336' : '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    width: '100%',
                }}>
                {running ? 'Pause' : 'Start'}
            </button>
            <button
                onClick={() => {
                    setTime(0);
                    setRunning(false);
                }}
                style={{ padding: '10px 20px', background: '#ccc', color: '#000', border: 'none', width: '100%' }}>
                Reset
            </button>
        </div>
    );
};

export default Timer;
