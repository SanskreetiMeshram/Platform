import React, { useRef, useEffect, useState } from 'react';
import { GameObject } from '../types/GameTypes';

interface Scene2DProps {
  gameObjects: GameObject[];
  selectedObject: string | null;
  onObjectSelect: (id: string) => void;
  onObjectUpdate: (id: string, updates: Partial<GameObject>) => void;
  isPlaying: boolean;
  showGrid: boolean;
}

const Scene2D: React.FC<Scene2DProps> = ({ 
  gameObjects, 
  selectedObject, 
  onObjectSelect, 
  onObjectUpdate,
  isPlaying,
  showGrid
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    objectId: string | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    objectId: null,
    offset: { x: 0, y: 0 }
  });
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context for transformations
    ctx.save();

    // Apply camera transformations
    ctx.translate(canvas.width / 2 + camera.x, canvas.height / 2 + camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Draw background
    const gradient = ctx.createLinearGradient(0, -canvas.height / 2, 0, canvas.height / 2);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#444444';
      ctx.lineWidth = 1 / camera.zoom;
      const gridSize = 20;
      const startX = Math.floor((-canvas.width / 2 - camera.x) / gridSize) * gridSize;
      const endX = Math.ceil((canvas.width / 2 - camera.x) / gridSize) * gridSize;
      const startY = Math.floor((-canvas.height / 2 - camera.y) / gridSize) * gridSize;
      const endY = Math.ceil((canvas.height / 2 - camera.y) / gridSize) * gridSize;

      for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
    }

    // Draw game objects
    gameObjects.forEach((obj) => {
      const x = obj.position.x * 40;
      const y = -obj.position.y * 40; // Flip Y axis
      const width = obj.scale.x * 40;
      const height = obj.scale.y * 40;

      ctx.fillStyle = obj.color || '#888888';
      
      // Draw based on object type
      switch (obj.type) {
        case 'player':
          // Draw circle for player
          ctx.beginPath();
          ctx.arc(x, y, width / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'obstacle':
          // Draw rectangle for obstacles
          ctx.fillRect(x - width / 2, y - height / 2, width, height);
          break;
        default:
          // Draw rectangle by default
          ctx.fillRect(x - width / 2, y - height / 2, width, height);
      }

      // Draw selection outline
      if (selectedObject === obj.id) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2 / camera.zoom;
        ctx.strokeRect(x - width / 2 - 2, y - height / 2 - 2, width + 4, height + 4);
      }

      // Draw object name
      ctx.fillStyle = '#ffffff';
      ctx.font = `${12 / camera.zoom}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(obj.name, x, y + height / 2 + 15 / camera.zoom);
    });

    // Restore context
    ctx.restore();
  }, [gameObjects, selectedObject, camera, showGrid]);

  const screenToWorld = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const canvasX = screenX - rect.left;
    const canvasY = screenY - rect.top;

    const worldX = (canvasX - canvas.width / 2 - camera.x) / (40 * camera.zoom);
    const worldY = -(canvasY - canvas.height / 2 - camera.y) / (40 * camera.zoom);

    return { x: worldX, y: worldY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPlaying) return;

    const worldPos = screenToWorld(e.clientX, e.clientY);

    // Find clicked object
    for (const obj of gameObjects) {
      const width = obj.scale.x;
      const height = obj.scale.y;

      if (
        worldPos.x >= obj.position.x - width / 2 &&
        worldPos.x <= obj.position.x + width / 2 &&
        worldPos.y >= obj.position.y - height / 2 &&
        worldPos.y <= obj.position.y + height / 2
      ) {
        onObjectSelect(obj.id);
        setDragState({
          isDragging: true,
          objectId: obj.id,
          offset: { x: worldPos.x - obj.position.x, y: worldPos.y - obj.position.y }
        });
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.objectId || isPlaying) return;

    const worldPos = screenToWorld(e.clientX, e.clientY);
    const newX = worldPos.x - dragState.offset.x;
    const newY = worldPos.y - dragState.offset.y;

    onObjectUpdate(dragState.objectId, {
      position: { x: newX, y: newY, z: 0 }
    });
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      objectId: null,
      offset: { x: 0, y: 0 }
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(5, prev.zoom * zoomFactor))
    }));
  };

  // Touch handling for mobile
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setLastTouch({ x: touch.clientX, y: touch.clientY });
      
      if (!isPlaying) {
        const worldPos = screenToWorld(touch.clientX, touch.clientY);
        
        // Find touched object
        for (const obj of gameObjects) {
          const width = obj.scale.x;
          const height = obj.scale.y;

          if (
            worldPos.x >= obj.position.x - width / 2 &&
            worldPos.x <= obj.position.x + width / 2 &&
            worldPos.y >= obj.position.y - height / 2 &&
            worldPos.y <= obj.position.y + height / 2
          ) {
            onObjectSelect(obj.id);
            setDragState({
              isDragging: true,
              objectId: obj.id,
              offset: { x: worldPos.x - obj.position.x, y: worldPos.y - obj.position.y }
            });
            break;
          }
        }
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && lastTouch) {
      const touch = e.touches[0];
      
      if (dragState.isDragging && dragState.objectId && !isPlaying) {
        const worldPos = screenToWorld(touch.clientX, touch.clientY);
        const newX = worldPos.x - dragState.offset.x;
        const newY = worldPos.y - dragState.offset.y;

        onObjectUpdate(dragState.objectId, {
          position: { x: newX, y: newY, z: 0 }
        });
      } else {
        // Pan camera
        const deltaX = touch.clientX - lastTouch.x;
        const deltaY = touch.clientY - lastTouch.y;
        
        setCamera(prev => ({
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
      }
      
      setLastTouch({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Store initial distance for zoom calculation
      if (!lastTouch) {
        setLastTouch({ x: distance, y: 0 });
      } else {
        const zoomFactor = distance / lastTouch.x;
        setCamera(prev => ({
          ...prev,
          zoom: Math.max(0.1, Math.min(5, prev.zoom * zoomFactor))
        }));
        setLastTouch({ x: distance, y: 0 });
      }
    }
  };

  const handleTouchEnd = () => {
    setLastTouch(null);
    setDragState({
      isDragging: false,
      objectId: null,
      offset: { x: 0, y: 0 }
    });
  };

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ imageRendering: 'pixelated', touchAction: 'none' }}
      />
    </div>
  );
};

export default Scene2D;