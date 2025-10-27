// circlesetter.js - STAHR Setting Circles Helper Script in JavaScript
// Based on circlesetter.py by Casey Murray '25

const HORIZONS_BASE_URL = import.meta.env.PROD ? 'https://ssd.jpl.nasa.gov/api/horizons.api' : '/api/horizons';
const HEASARC_BASE_URL = import.meta.env.PROD ? 'https://heasarc.gsfc.nasa.gov/cgi-bin/Tools/convcoord/convcoord.pl' : '/api/heasarc';

// Helper function to get current UTC time in the required format
const getCurrentUTCTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
};

// Checks that a time is validly formatted by querying JPL Horizons.
export const timecheck = async (testTime) => {
    const url = `${HORIZONS_BASE_URL}?format=text&COMMAND='301'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&TLIST='${testTime}'&QUANTITIES='1'&REF_SYSTEM='B1950'`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        return text.includes('$$SOE');
    } catch (error) {
        console.error("Error in timecheck:", error);
        return false;
    }
};

// Main object resolution function using HEASARC (SIMBAD) and JPL Horizons.
export const resolve = async (objectName, time = getCurrentUTCTime()) => {
    let ra, dec;

    // First attempt: HEASARC Coordinate Converter (SIMBAD)
    const heasarc_url = `${HEASARC_BASE_URL}?CoordVal=${objectName}&CoordType=B1950&Resolver=GRB%2FSIMBAD%2BSesame%2FNED&NoCache=on&Epoch=`;
    console.log("Requesting HEASARC URL:", heasarc_url);
    try {
        const response = await fetch(heasarc_url);
        const text = await response.text();
        console.log("HEASARC Response:", text);
        if (!text.includes('Unable to resolve object/parse coordinates')) {
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('<th> Lat</th>')) {
                    const raParts = lines[i + 4].split('<td>')[1].split('&nbsp;');
                    const decParts = lines[i + 5].split('<td>')[1].split('&nbsp;');
                    ra = `${raParts[0].trim()}:${raParts[1]}:${raParts[2].split('</td>')[0].trim()}`;
                    dec = `${decParts[0].trim()}:${decParts[1]}:${decParts[2].split('</td>')[0].trim()}`;
                    if (!dec.startsWith('-')) {
                        dec = '+' + dec;
                    }
                    return { name: objectName, ra, dec };
                }
            }
        }
    } catch (error) {
        console.error("Error resolving with HEASARC:", error);
    }

    // Second attempt: JPL Horizons for planets, asteroids, etc.
    let url = `${HORIZONS_BASE_URL}?format=text&COMMAND=${encodeURIComponent(objectName)}&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&TLIST='${time}'&QUANTITIES='1'&REF_SYSTEM='B1950'`;
    console.log("Requesting Horizons URL (initial):", url);
    try {
        let response = await fetch(url);
        let text = await response.text();
        console.log("Horizons Initial Response:", text);
        let lines = text.split('\n');

        // Handle multiple matches from Horizons, inspired by the original Python script
        if (text.includes('Multiple major-bodies match string')) {
            console.log("DEBUG: 'Multiple major-bodies match string' text found.");
            let bestMatch = { id: null, name: 'a'.repeat(100) }; // A very long string
            const lowerObjectName = objectName.toLowerCase();
            console.log(`DEBUG: Searching for best match for "${lowerObjectName}"`);
            console.log("DEBUG: Lines to search:", lines);

            for (const line of lines) {
                console.log(`DEBUG: Processing line: "${line}"`);
                const isCandidate = line.trim().match(/^\d/);
                console.log(`DEBUG: Is candidate? ${isCandidate ? 'Yes' : 'No'}`);

                if (isCandidate) {
                    const nameInLine = line.substring(11, 45).trim().toLowerCase();
                    console.log(`DEBUG: Extracted name: "${nameInLine}"`);

                    const includesName = nameInLine.includes(lowerObjectName);
                    console.log(`DEBUG: Includes search term? ${includesName ? 'Yes' : 'No'}`);

                    if (includesName) {
                        const isShorter = nameInLine.length < bestMatch.name.length;
                        console.log(`DEBUG: Is shorter than best match? ${isShorter ? 'Yes' : 'No'}`);
                        if (isShorter) {
                            bestMatch.id = line.substring(0, 10).trim();
                            bestMatch.name = nameInLine;
                            console.log(`DEBUG: New best match found: ID=${bestMatch.id}, Name=${bestMatch.name}`);
                        }
                    }
                }
            }

            const objId = bestMatch.id;
            console.log(`DEBUG: Final best match ID: ${objId}`);
            if (objId) {
                console.log(`Final selected ID: ${objId}`);
                url = `${HORIZONS_BASE_URL}?format=text&COMMAND=${objId}&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&TLIST='${time}'&QUANTITIES='1'&REF_SYSTEM='B1950'`;
                console.log("Requesting Horizons URL (specific ID):", url);
                response = await fetch(url);
                text = await response.text();
                console.log("Horizons Specific ID Response:", text);
                lines = text.split('\n');
            } else {
                console.log("Could not find a suitable match.");
            }
        }

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('$$SOE')) {
                const ephemeris = lines[i + 1].substring(30, 53).split(/\s+/).filter(Boolean);
                if (ephemeris.length >= 6) {
                    ra = `${ephemeris[0]}:${ephemeris[1]}:${ephemeris[2]}`;
                    dec = `${ephemeris[3]}:${ephemeris[4]}:${ephemeris[5]}`;
                    return { name: objectName, ra, dec };
                }
            }
        }
    } catch (error) {
        console.error("Error resolving with Horizons:", error);
    }

    console.error(`Object not resolved: ${objectName}`);
    return null;
};

// Translates RA/Dec from sexagesimal to decimal degrees
const toDecimal = (raStr, decStr) => {
    const [raH, raM, raS] = raStr.split(':').map(parseFloat);
    const [decD, decM, decS] = decStr.replace('+', '').split(':').map(parseFloat);

    const ra = (raH + raM / 60 + raS / 3600) * 15; // RA in degrees
    let dec = Math.abs(decD) + decM / 60 + decS / 3600;
    if (decStr.startsWith('-')) {
        dec = -dec;
    }
    return { ra, dec };
};


// Calculate the difference in angle between a navigation object and a target
export const diffangle = (navobj, target) => {
    const navCoords = toDecimal(navobj.ra, navobj.dec);
    const tarCoords = toDecimal(target.ra, target.dec);

    let delra = tarCoords.ra - navCoords.ra;
    const deldec = tarCoords.dec - navCoords.dec;

    // Get the smaller RA slew
    if (delra > 180.0) {
        delra -= 360.0;
    } else if (delra < -180.0) {
        delra += 360.0;
    }
    
    // Convert back to hms and dms for display
    const raHours = delra / 15;
    const raSign = raHours >= 0 ? '+' : '-';
    const absRaHours = Math.abs(raHours);
    const raH = Math.floor(absRaHours);
    const raM = Math.round((absRaHours - raH) * 60 * 10) / 10;

    const decSign = deldec >= 0 ? '+' : '-';
    const absDec = Math.abs(deldec);
    const decD = Math.floor(absDec);
    const decM = Math.round((absDec - decD) * 60);

    return {
        ra: `${raSign}${raH}h${raM}m`,
        dec: `${decSign}${decD}°${decM}'`
    };
};
