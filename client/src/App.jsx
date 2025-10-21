import { useState } from 'react';
import TelescopeScene from './components/TelescopeScene';
import { resolve, diffangle } from './lib/circlesetter';
import './App.css';

function App() {
    const [navObject, setNavObject] = useState('Arcturus');
    const [targetObject, setTargetObject] = useState('M51');
    const [coords, setCoords] = useState({ ra: 0, dec: 0 });
    const [displayText, setDisplayText] = useState('');

    const handleCalculate = async () => {
        const nav = await resolve(navObject);
        const target = await resolve(targetObject);

        if (nav && target) {
            const diff = diffangle(nav, target);
            setDisplayText(`RA: ${diff.ra}, Dec: ${diff.dec}`);
            
            // Simple parsing for animation - this can be improved
            const raHours = parseFloat(diff.ra.match(/-?\d+(\.\d+)?/)[0]);
            const decDegrees = parseFloat(diff.dec.match(/-?\d+(\.\d+)?/)[0]);

            setCoords({ ra: raHours, dec: decDegrees });
        } else {
            setDisplayText('Could not resolve one or both objects.');
        }
    };

    return (
        <div className="App">
            <div className="scene-container">
                <TelescopeScene ra={coords.ra} dec={coords.dec} />
            </div>
            <div className="controls">
                <h1>Setting Circles</h1>
                <div className="input-group">
                    <label>Navigation Object</label>
                    <input
                        type="text"
                        value={navObject}
                        onChange={(e) => setNavObject(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Target Object</label>
                    <input
                        type="text"
                        value={targetObject}
                        onChange={(e) => setTargetObject(e.target.value)}
                    />
                </div>
                <button onClick={handleCalculate}>Calculate</button>
                <div className="results">
                    <p>{displayText}</p>
                </div>
            </div>
        </div>
    );
}

export default App;
