import React, { useState } from 'react';
import Wheel from './Wheel';
import Timer from './Timer';

// Simple clapping sound URL (free from pacdv.com - crowd clapping).
const CLAP_SOUND_URL = 'https://www.pacdv.com/sounds/applause-sound/app-6.mp3';

const App = () => {
    const [names, setNames] = useState([]);
    const [namesInput, setNamesInput] = useState('');
    const [winner, setWinner] = useState(null);
    const [spinning, setSpinning] = useState(false);

    // Parse textarea input (one name per line).
    const handleNamesChange = (e) => {
        setNamesInput(e.target.value);
        const newNames = e.target.value.split('\n').filter((name) => name.trim());
        setNames(newNames);
    };

    // Callback from Wheel when spin ends.
    const handleSpinEnd = (selectedWinner) => {
        setWinner(selectedWinner);
        setSpinning(false);
        // Play clap sound.
        const audio = new Audio(CLAP_SOUND_URL);
        audio.play();
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
            }}>
            {/* Left Column: Wheel */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Wheel names={names} onSpinEnd={handleSpinEnd} spinning={spinning} setSpinning={setSpinning} />
            </div>

            {/* Right Column: Names Input, Winner, Timer */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ marginBottom: '20px' }}>Wheel of Names</h1>

                {/* Name Input */}
                <textarea
                    value={namesInput}
                    onChange={handleNamesChange}
                    placeholder="Enter names, one per line..."
                    style={{
                        width: '300px',
                        height: '100px',
                        marginBottom: '20px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />

                {/* Winner Display - Bigger font */}
                {winner && <h2 style={{ marginBottom: '20px', color: 'green', fontSize: '60px' }}>Winner: {winner}</h2>}

                {/* Timer */}
                <Timer />
            </div>
        </div>
    );
};

export default App;
