import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, GameObject, Vector3, GameTemplate } from '../types/GameTypes';

export const useGameEngine = (template: GameTemplate | null) => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    lives: 3,
    level: 1,
    gameObjects: [],
    playerPosition: { x: 0, y: 0, z: 0 },
    gameSpeed: 1
  });

  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  const [undoStack, setUndoStack] = useState<GameState[]>([]);
  const [redoStack, setRedoStack] = useState<GameState[]>([]);

  // Initialize game objects based on template
  const initializeGame = useCallback(() => {
    if (!template) return;

    let initialObjects: GameObject[] = [];

    switch (template.id) {
      case 'new-game':
        initialObjects = [
          {
            id: 'ground',
            name: 'Ground',
            position: { x: 0, y: -1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 10, y: 0.2, z: 10 },
            components: [],
            type: 'platform',
            color: '#228B22'
          }
        ];
        break;

      case 'flappy-bird':
        initialObjects = [
          {
            id: 'player',
            name: 'Bird',
            position: { x: -2, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            components: [],
            type: 'player',
            color: '#FFD700'
          },
          {
            id: 'pipe1',
            name: 'Pipe',
            position: { x: 3, y: 1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.5, y: 3, z: 0.5 },
            components: [],
            type: 'obstacle',
            color: '#228B22'
          },
          {
            id: 'pipe2',
            name: 'Pipe Bottom',
            position: { x: 3, y: -2, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.5, y: 3, z: 0.5 },
            components: [],
            type: 'obstacle',
            color: '#228B22'
          }
        ];
        break;

      case 'crossy-road':
        initialObjects = [
          {
            id: 'player',
            name: 'Character',
            position: { x: 0, y: 0, z: -3 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            components: [],
            type: 'player',
            color: '#4169E1'
          },
          {
            id: 'road',
            name: 'Road',
            position: { x: 0, y: -0.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 10, y: 0.1, z: 2 },
            components: [],
            type: 'platform',
            color: '#696969'
          },
          {
            id: 'car1',
            name: 'Car',
            position: { x: 5, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 2, y: 1, z: 1 },
            components: [],
            type: 'enemy',
            color: '#FF4444'
          }
        ];
        break;

      case 'minecraft':
        initialObjects = [
          {
            id: 'ground',
            name: 'Ground',
            position: { x: 0, y: -1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 10, y: 0.2, z: 10 },
            components: [],
            type: 'platform',
            color: '#228B22'
          },
          {
            id: 'block1',
            name: 'Grass Block',
            position: { x: 1, y: 0, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            components: [],
            type: 'collectible',
            color: '#32CD32'
          },
          {
            id: 'block2',
            name: 'Stone Block',
            position: { x: -1, y: 0, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            components: [],
            type: 'obstacle',
            color: '#696969'
          }
        ];
        break;

      case 'match-3':
        initialObjects = [];
        // Create a 6x6 grid of colored blocks
        for (let x = 0; x < 6; x++) {
          for (let y = 0; y < 6; y++) {
            const colors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF'];
            initialObjects.push({
              id: `gem-${x}-${y}`,
              name: `Gem ${x},${y}`,
              position: { x: x - 2.5, y: y - 2.5, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 0.8, y: 0.8, z: 0.8 },
              components: [],
              type: 'collectible',
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          }
        }
        break;

      default:
        initialObjects = [
          {
            id: 'player',
            name: 'Player',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            components: [],
            type: 'player',
            color: '#FF6B6B'
          }
        ];
    }

    setGameState(prev => ({
      ...prev,
      gameObjects: initialObjects,
      playerPosition: initialObjects.find(obj => obj.type === 'player')?.position || { x: 0, y: 0, z: 0 }
    }));
  }, [template]);

  // Save state for undo/redo
  const saveState = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-9), { ...gameState }]);
    setRedoStack([]);
  }, [gameState]);

  // Undo function
  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [gameState, ...prev.slice(0, 9)]);
      setUndoStack(prev => prev.slice(0, -1));
      setGameState(previousState);
    }
  }, [undoStack, gameState]);

  // Redo function
  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack(prev => [...prev, gameState]);
      setRedoStack(prev => prev.slice(1));
      setGameState(nextState);
    }
  }, [redoStack, gameState]);

  // Game loop with enhanced physics and controls
  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying) return;

    setGameState(prev => {
      const newState = { ...prev };
      const player = newState.gameObjects.find(obj => obj.type === 'player');
      
      if (player && template) {
        const moveSpeed = 0.15 * gameState.gameSpeed;
        
        // Handle keyboard input
        if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w') || keysPressed.current.has('W')) {
          if (template.category === '2D') {
            player.position.y += moveSpeed;
          } else {
            player.position.z -= moveSpeed;
          }
        }
        if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s') || keysPressed.current.has('S')) {
          if (template.category === '2D') {
            player.position.y -= moveSpeed;
          } else {
            player.position.z += moveSpeed;
          }
        }
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || keysPressed.current.has('A')) {
          player.position.x -= moveSpeed;
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d') || keysPressed.current.has('D')) {
          player.position.x += moveSpeed;
        }
        if (keysPressed.current.has(' ')) {
          if (template.id === 'flappy-bird') {
            player.position.y += 0.3;
          } else if (template.category === '3D') {
            player.position.y += moveSpeed;
          }
        }

        // Game-specific logic
        switch (template.id) {
          case 'flappy-bird':
            // Gravity
            player.position.y -= 0.08;
            // Keep bird in bounds
            if (player.position.y < -3) {
              player.position.y = -3;
              newState.lives -= 1;
            }
            if (player.position.y > 3) {
              player.position.y = 3;
            }
            
            // Move pipes and check collisions
            newState.gameObjects.forEach(obj => {
              if (obj.type === 'obstacle') {
                obj.position.x -= 0.08 * gameState.gameSpeed;
                if (obj.position.x < -5) {
                  obj.position.x = 5;
                  newState.score += 10;
                }
                
                // Simple collision detection
                const distance = Math.sqrt(
                  Math.pow(player.position.x - obj.position.x, 2) +
                  Math.pow(player.position.y - obj.position.y, 2)
                );
                if (distance < 1) {
                  newState.lives -= 1;
                  player.position.x = -2;
                  player.position.y = 0;
                }
              }
            });
            break;

          case 'crossy-road':
            // Move traffic
            newState.gameObjects.forEach(obj => {
              if (obj.type === 'enemy') {
                obj.position.x -= 0.12 * gameState.gameSpeed;
                if (obj.position.x < -10) {
                  obj.position.x = 10;
                }
                
                // Collision detection
                const distance = Math.sqrt(
                  Math.pow(player.position.x - obj.position.x, 2) +
                  Math.pow(player.position.z - obj.position.z, 2)
                );
                if (distance < 1.5) {
                  newState.lives -= 1;
                  player.position.x = 0;
                  player.position.z = -3;
                }
              }
            });
            
            // Score for moving forward
            if (player.position.z > newState.level * 2) {
              newState.score += 50;
              newState.level += 1;
            }
            break;

          case 'match-3':
            // Simple match-3 logic - auto-score when playing
            if (Math.random() < 0.01) {
              newState.score += 100;
            }
            break;

          case 'minecraft':
            // Keep player above ground
            if (player.position.y < -0.5) {
              player.position.y = -0.5;
            }
            
            // Collect blocks
            newState.gameObjects.forEach(obj => {
              if (obj.type === 'collectible') {
                const distance = Math.sqrt(
                  Math.pow(player.position.x - obj.position.x, 2) +
                  Math.pow(player.position.y - obj.position.y, 2) +
                  Math.pow(player.position.z - obj.position.z, 2)
                );
                if (distance < 1.2) {
                  newState.score += 20;
                  obj.position.x = Math.random() * 8 - 4;
                  obj.position.z = Math.random() * 8 - 4;
                }
              }
            });
            break;
        }

        // Update player position
        newState.playerPosition = { ...player.position };
        
        // Game over condition
        if (newState.lives <= 0) {
          newState.isPlaying = false;
        }
      }

      return newState;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.gameSpeed, template]);

  // Enhanced keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      
      // Handle menu shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [undo, redo]);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart || !gameState.isPlaying) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const threshold = 50;

    const player = gameState.gameObjects.find(obj => obj.type === 'player');
    if (!player) return;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > threshold) {
        // Swipe right
        player.position.x += 1;
      } else if (deltaX < -threshold) {
        // Swipe left
        player.position.x -= 1;
      }
    } else {
      // Vertical swipe
      if (deltaY > threshold) {
        // Swipe down
        if (template?.category === '3D') {
          player.position.z += 1;
        } else {
          player.position.y -= 1;
        }
      } else if (deltaY < -threshold) {
        // Swipe up
        if (template?.id === 'flappy-bird') {
          player.position.y += 0.5;
        } else if (template?.category === '3D') {
          player.position.z -= 1;
        } else {
          player.position.y += 1;
        }
      }
    }

    setTouchStart(null);
  }, [touchStart, gameState.isPlaying, gameState.gameObjects, template]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  // Start/stop game
  const togglePlay = useCallback(() => {
    setGameState(prev => {
      const newPlaying = !prev.isPlaying;
      if (newPlaying) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      } else if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return { ...prev, isPlaying: newPlaying };
    });
  }, [gameLoop]);

  // Reset game
  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    setGameState({
      isPlaying: false,
      score: 0,
      lives: 3,
      level: 1,
      gameObjects: [],
      playerPosition: { x: 0, y: 0, z: 0 },
      gameSpeed: 1
    });
    initializeGame();
  }, [initializeGame]);

  // Add object to scene
  const addObject = useCallback((object: GameObject) => {
    saveState();
    setGameState(prev => ({
      ...prev,
      gameObjects: [...prev.gameObjects, object]
    }));
  }, [saveState]);

  // Update object
  const updateObject = useCallback((id: string, updates: Partial<GameObject>) => {
    setGameState(prev => ({
      ...prev,
      gameObjects: prev.gameObjects.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      )
    }));
  }, []);

  // Remove object
  const removeObject = useCallback((id: string) => {
    saveState();
    setGameState(prev => ({
      ...prev,
      gameObjects: prev.gameObjects.filter(obj => obj.id !== id)
    }));
  }, [saveState]);

  // Copy object
  const copyObject = useCallback((id: string) => {
    const obj = gameState.gameObjects.find(o => o.id === id);
    if (obj) {
      const newObj = {
        ...obj,
        id: `${obj.name.toLowerCase()}-${Date.now()}`,
        name: `${obj.name} Copy`,
        position: { ...obj.position, x: obj.position.x + 1 }
      };
      addObject(newObj);
    }
  }, [gameState.gameObjects, addObject]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return {
    gameState,
    togglePlay,
    resetGame,
    addObject,
    updateObject,
    removeObject,
    copyObject,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    setGameState
  };
};