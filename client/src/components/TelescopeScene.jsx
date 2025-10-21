import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

// Telescope Model
const Telescope = ({ rotation }) => {
    const { rotY, rotX } = useSpring({
        rotY: rotation[0], // RA
        rotX: rotation[1], // Dec
        config: { mass: 5, tension: 120, friction: 40 },
    });

    return (
        <animated.group rotation-y={rotY}>
            <animated.group rotation-x={rotX}>
                {/* Telescope Tube */}
                <mesh position={[0, 0, 2]}>
                    <cylinderGeometry args={[0.5, 0.5, 4, 32]} />
                    <meshBasicMaterial color="white" wireframe />
                </mesh>
                {/* RA Setting Circle */}
                <mesh rotation-x={Math.PI / 2}>
                    <torusGeometry args={[2, 0.1, 16, 100]} />
                    <meshBasicMaterial color="white" wireframe />
                </mesh>
                {/* Dec Setting Circle */}
                <mesh rotation-y={Math.PI / 2}>
                    <torusGeometry args={[1.5, 0.1, 16, 100]} />
                    <meshBasicMaterial color="white" wireframe />
                </mesh>
            </animated.group>
        </animated.group>
    );
};

// Dome Model
const Dome = () => {
    return (
        <mesh>
            <sphereGeometry args={[15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial color="white" wireframe side={THREE.DoubleSide} />
        </mesh>
    );
};

// The main 3D scene component
const TelescopeScene = ({ ra, dec }) => {
    // Convert RA (hours) and Dec (degrees) to radians for rotation
    const rotation = [
        ra ? (ra / 24) * Math.PI * 2 : 0,
        dec ? (dec / 360) * Math.PI * 2 : 0,
    ];

    return (
        <Canvas camera={{ position: [0, 5, 20], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
            <Dome />
            <Telescope rotation={rotation} />
        </Canvas>
    );
};

export default TelescopeScene;
