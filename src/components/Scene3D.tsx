import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Plane } from '@react-three/drei';
import { GameObject } from '../types/GameTypes';
import * as THREE from 'three';

interface Scene3DProps {
  gameObjects: GameObject[];
  selectedObject: string | null;
  onObjectSelect: (id: string) => void;
  onObjectUpdate: (id: string, updates: Partial<GameObject>) => void;
  isPlaying: boolean;
  showGrid: boolean;
}

const GameObject3D: React.FC<{
  object: GameObject;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<GameObject>) => void;
  isPlaying: boolean;
}> = ({ object, isSelected, onSelect, onUpdate, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(object.position.x, object.position.y, object.position.z);
      meshRef.current.rotation.set(object.rotation.x, object.rotation.y, object.rotation.z);
      meshRef.current.scale.set(object.scale.x, object.scale.y, object.scale.z);
    }
  });

  const handlePointerDown = (e: any) => {
    if (!isPlaying) {
      e.stopPropagation();
      onSelect();
      setIsDragging(true);
    }
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && !isPlaying) {
      const newPosition = {
        x: e.point.x,
        y: e.point.y,
        z: e.point.z
      };
      onUpdate({ position: newPosition });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const renderGeometry = () => {
    switch (object.name.toLowerCase()) {
      case 'sphere':
      case 'ball':
      case 'bird':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'plane':
      case 'ground':
      case 'platform':
      case 'road':
        return <planeGeometry args={[object.scale.x, object.scale.z]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
    >
      {renderGeometry()}
      <meshStandardMaterial 
        color={object.color || '#888888'} 
        wireframe={isSelected}
        transparent={isSelected}
        opacity={isSelected ? 0.8 : 1}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color="#00ff00" />
        </lineSegments>
      )}
    </mesh>
  );
};

const Scene3D: React.FC<Scene3DProps> = ({ 
  gameObjects, 
  selectedObject, 
  onObjectSelect, 
  onObjectUpdate,
  isPlaying,
  showGrid
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Grid */}
        {showGrid && <gridHelper args={[20, 20, '#444444', '#444444']} />}
        
        {/* Game Objects */}
        {gameObjects.map((obj) => (
          <GameObject3D
            key={obj.id}
            object={obj}
            isSelected={selectedObject === obj.id}
            onSelect={() => onObjectSelect(obj.id)}
            onUpdate={(updates) => onObjectUpdate(obj.id, updates)}
            isPlaying={isPlaying}
          />
        ))}
        
        {/* Camera Controls */}
        <OrbitControls 
          enabled={!isPlaying}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={50}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;