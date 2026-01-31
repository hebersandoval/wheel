import React, { useState } from 'react';
import Wheel from './Wheel';
import Timer from './Timer';

// Simple clapping sound URL (free from pacdv.com - crowd clapping).
const CLAP_SOUND_URL = 'https://www.pacdv.com/sounds/applause-sound/app-6.mp3';

const App = () => {
    const [names, setNames] = useState([]);
    const [namesInput, setNamesInput] = useState('');
    const [winner, setWinner] = useState(null);
    const [winnerKey, setWinnerKey] = useState(0);
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
        setWinnerKey((k) => k + 1);
        setSpinning(false);
        // Play clap sound.
        const audio = new Audio(CLAP_SOUND_URL);
        audio.play();
    };

    return (
        <div className="app-container">
            <div className="app-layout">
                <div className="left-col">
                    <Wheel names={names} onSpinEnd={handleSpinEnd} spinning={spinning} setSpinning={setSpinning} />
                </div>

                <div className="right-col">
                    <h1 style={{ marginBottom: '18px' }}>Spin the Recora Wheel</h1>

                    <textarea
                        className="names-textarea"
                        value={namesInput}
                        onChange={handleNamesChange}
                        placeholder="Enter names, one per line..."
                    />

                    {winner && (
                        <div style={{ width: '100%', marginTop: '2px' }}>
                            <h2 className="winner" style={{ fontSize: '24px' }}>
                                Your turn to score:
                            </h2>
                            <h2
                                style={{
                                    textAlign: 'center',
                                }}>
                                <span key={winnerKey} className="winner-name">
                                    {winner}
                                </span>
                            </h2>
                        </div>
                    )}

                    <Timer />
                </div>
            </div>
        </div>
    );
};

export default App;
