import { useState, useContext } from 'react';
import TelescopeScene from './components/TelescopeScene';
import ThemeSwitcher from './components/ThemeSwitcher';
import { resolve, diffangle } from './lib/circlesetter';
import { ThemeContext } from './contexts/ThemeContext';
import './App.css';

function App() {
    const { theme } = useContext(ThemeContext);
    const [navObject, setNavObject] = useState('Arcturus');
    const [targetObject, setTargetObject] = useState('M51');
    const [coords, setCoords] = useState({ ra: 0, dec: 0, raStr: '', decStr: '' });
    const [displayText, setDisplayText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = async (targetName) => {
        const currentTarget = targetName || targetObject;
        if (!currentTarget) return;

        setIsLoading(true);
        setDisplayText('');

        const nav = await resolve(navObject);
        const target = await resolve(currentTarget);

        if (nav && target) {
            const diff = diffangle(nav, target);
            setDisplayText(`RA: ${diff.ra}, Dec: ${diff.dec}`);
            
            // Simple parsing for animation - this can be improved
            const raHours = parseFloat(diff.ra.match(/-?\d+(\.\d+)?/)[0]);
            const decDegrees = parseFloat(diff.dec.match(/-?\d+(\.\d+)?/)[0]);

            setCoords({ ra: raHours, dec: decDegrees, raStr: diff.ra, decStr: diff.dec });
        } else {
            setDisplayText('Could not resolve one or both objects.');
        }
        setIsLoading(false);
    };

    const handlePresetClick = (objectName) => {
        setTargetObject(objectName);
        handleCalculate(objectName);
    };

    return (
        <div className="App" style={{ background: theme.background, color: theme.text.primary }}>
            <div className="scene-container">
                <ThemeSwitcher />
                <TelescopeScene ra={coords.ra} dec={coords.dec} raStr={coords.raStr} decStr={coords.decStr} />
                <div className="presets">
                    <button onClick={() => handlePresetClick('Jupiter')} style={{ backgroundColor: 'transparent', border: `1px solid ${theme.text.primary}`, color: theme.text.primary, padding: '0.5em', fontFamily: 'inherit', fontSize: '1em', cursor: 'pointer' }}>Jupiter</button>
                    <button onClick={() => handlePresetClick('Saturn')} style={{ backgroundColor: 'transparent', border: `1px solid ${theme.text.primary}`, color: theme.text.primary, padding: '0.5em', fontFamily: 'inherit', fontSize: '1em', cursor: 'pointer' }}>Saturn</button>
                    <button onClick={() => handlePresetClick('Moon')} style={{ backgroundColor: 'transparent', border: `1px solid ${theme.text.primary}`, color: theme.text.primary, padding: '0.5em', fontFamily: 'inherit', fontSize: '1em', cursor: 'pointer' }}>Moon</button>
                    <button onClick={() => handlePresetClick('Mars')} style={{ backgroundColor: 'transparent', border: `1px solid ${theme.text.primary}`, color: theme.text.primary, padding: '0.5em', fontFamily: 'inherit', fontSize: '1em', cursor: 'pointer' }}>Mars</button>
                </div>
            </div>
            <div className="controls" style={{ backgroundColor: theme.ui.overlay, borderLeft: `1px solid ${theme.text.primary}` }}>
                <h1 style={{fontSize: "1.6rem"}}>Loomis-Michael Telescope Setting Circles</h1>
                <div className="input-group">
                    <label>Navigation Object</label>
                    <input
                        type="text"
                        value={navObject}
                        onChange={(e) => setNavObject(e.target.value)}
                        style={{ border: `1px solid ${theme.text.primary}`, color: theme.text.primary }}
                    />
                </div>
                <div className="input-group">
                    <label>Target Object</label>
                    <input
                        type="text"
                        value={targetObject}
                        onChange={(e) => setTargetObject(e.target.value)}
                        style={{ border: `1px solid ${theme.text.primary}`, color: theme.text.primary }}
                    />
                </div>
                <button
                    onClick={() => handleCalculate()}
                    disabled={isLoading}
                    style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.text.primary}`,
                        color: theme.text.primary,
                        padding: '0.5em',
                        fontFamily: 'inherit',
                        fontSize: '1em',
                        cursor: 'pointer'
                    }}
                >
                    {isLoading ? 'Calculating...' : 'Calculate'}
                </button>
                <div className="results" style={{ border: `1px dashed ${theme.text.primary}` }}>
                    <p>{displayText}</p>
                </div>
                <div className="footer" style={{ color: theme.text.secondary }}>
                    <p>Based on Circlesetters.py by Casey Murray ’25</p>
                    <p>
                        <a href="https://sites.harvard.edu/stahr/" target="_blank" rel="noopener noreferrer" style={{ color: theme.text.secondary }}>[STAHR]</a>
                        <a href="https://sites.harvard.edu/stahr/resources/lmo-sop/" target="_blank" rel="noopener noreferrer" style={{ color: theme.text.secondary }}>[About]</a>
                        <a href="https://github.com/lukehollis/stahr-circlesetters" target="_blank" rel="noopener noreferrer" style={{ color: theme.text.secondary }}>[Github]</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
