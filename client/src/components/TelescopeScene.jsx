import React, { useRef, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Text, Billboard } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { ThemeContext } from '../contexts/ThemeContext';

// Component for tick marks and numbers on the circles
const CircleAnnotations = ({ radius, isRA }) => {
    const { theme } = useContext(ThemeContext);
    const ticks = [];
    const numbers = isRA ? 24 : 36; // 24 hours for RA, 360/10 degrees for Dec
    const labelInterval = isRA ? 2 : 3; // Label every 2 hours or 30 degrees

    for (let i = 0; i < numbers; i++) {
        const angle = (i / numbers) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isZero = i === 0;
        const tickLength = isZero ? 0.4 : (i % labelInterval === 0 ? 0.2 : 0.1);
        const tickColor = isZero ? theme.text.primary : theme.text.primary;

        // Tick marks - re-oriented and rotated to be radial
        ticks.push(
            <mesh key={`tick-${i}`} position={[x, 0, z]} rotation-y={angle}>
                <boxGeometry args={[0.02, 0.02, tickLength]} />
                <meshBasicMaterial color={tickColor} />
            </mesh>
        );

        // Numbers - rotated to face outwards
        if (i % labelInterval === 0) {
            const label = isRA ? i.toString() : (i * 10).toString();
            ticks.push(
                <Billboard
                    key={`number-${i}`}
                    position={[x * 1.15, 0, z * 1.15]}
                >
                    <Text
                        fontSize={0.3}
                        color={theme.text.primary}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {label}
                    </Text>
                </Billboard>
            );
        }
    }
    return <group rotation-x={Math.PI / 2}>{ticks}</group>;
};


// Updated Telescope Model
const Telescope = ({ rotation }) => {
    const { theme } = useContext(ThemeContext);
    const { rotY, rotX } = useSpring({
        rotY: rotation[0], // RA
        rotX: rotation[1], // Dec
        config: { mass: 5, tension: 120, friction: 40 },
    });

    return (
        <group scale={2.5} position={[0, -2, 0]}>
            {/* RA Setting Mark */}
            <mesh position={[2.5, 0.25, 0]} rotation-z={Math.PI / 2}>
                <coneGeometry args={[0.1, 0.3, 8]} />
                <meshBasicMaterial color={theme.text.primary} />
            </mesh>
            {/* Base and RA Mount */}
            <animated.group rotation-y={rotY}>
                <animated.group position={[0, 0, 0]}>
                    <mesh>
                        <cylinderGeometry args={[2.2, 2.2, 0.5, 64]} />
                        <meshBasicMaterial color={theme.text.primary} wireframe />
                    </mesh>
                    <group rotation-x={-Math.PI / 2}>
                        <CircleAnnotations radius={2.8} isRA={true} />
                    </group>
                    <Billboard >
                        <Text position={[3.5, 0.5, 0]} fontSize={0.4} color={theme.text.primary}>RA</Text>
                    </Billboard>
                </animated.group>

                {/* DEC Setting Mark */}
                <mesh position={[2, 4.4, 0]} rotation-z={Math.PI}>
                    <coneGeometry args={[0.1, 0.3, 8]} />
                    <meshBasicMaterial color={theme.text.primary} />
                </mesh>

                {/* DEC Mount and Telescope */}
                <animated.group position={[2, 2, 0]} rotation-x={rotX}>
                    {/* Fork Mount */}
                    <mesh position={[0, -1, 1.8]}>
                        <boxGeometry args={[0.5, 2, 0.5]} />
                        <meshBasicMaterial color={theme.text.primary} wireframe />
                    </mesh>
                    <mesh position={[0, -1, -1.8]}>
                        <boxGeometry args={[0.5, 2, 0.5]} />
                        <meshBasicMaterial color={theme.text.primary} wireframe />
                    </mesh>

                    {/* DEC Circle */}
                    <group rotation-y={Math.PI / 2}>
                        <mesh>
                            <torusGeometry args={[2, 0.1, 16, 100]} />
                            <meshBasicMaterial color={theme.text.primary} wireframe />
                        </mesh>
                        <CircleAnnotations radius={2.2} isRA={false} />
                        <Billboard>
                            <Text position={[2.6, 0, 0]} fontSize={0.4} color={theme.text.primary} rotation-z={Math.PI/2}>DEC</Text>
                        </Billboard>
                    </group>

                    {/* Telescope Tube */}
                    <mesh position={[-2, 3, -2]}>
                        <cylinderGeometry args={[1, 1, 8, 32]} />
                        <meshBasicMaterial color={theme.text.primary} wireframe />
                    </mesh>
                </animated.group>
            </animated.group>
        </group>
    );
};

// Dome Model
const Dome = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <mesh>
            <sphereGeometry args={[25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial color={theme.text.primary} wireframe side={THREE.DoubleSide} />
        </mesh>
    );
};

// The main 3D scene component
const TelescopeScene = ({ ra, dec, raStr, decStr }) => {
    const { theme } = useContext(ThemeContext);
    const controlsRef = useRef();

    const handleControlsChange = () => {
        if (controlsRef.current) {
            // console.log('zoom', controlsRef.current.getDistance());
        }
    };

    const rotation = [
        ra ? (ra / 24) * Math.PI * 2 : 0,
        dec ? (dec / 360) * Math.PI * 2 : 0,
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Canvas camera={{ position: [-10, 3, -20], fov: 75 }}>
                <OrbitControls ref={controlsRef} onChange={handleControlsChange} minDistance={5} maxDistance={21} target={[0, 6, 0]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />
                <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade />
                <Dome />
                <Telescope rotation={rotation} />
            </Canvas>
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                color: theme.text.primary,
                fontFamily: 'monospace, "Courier New", Courier',
                fontSize: '16px',
                background: theme.ui.overlay,
                padding: '10px',
                borderRadius: '5px'
            }}>
                <div>RA: {raStr}</div>
                <div>Dec: {decStr}</div>
            </div>
        </div>
    );
};

export default TelescopeScene;
