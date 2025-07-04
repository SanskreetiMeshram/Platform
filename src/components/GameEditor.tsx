import React, { useState } from 'react';
import { GameTemplate, GameObject } from '../types/GameTypes';
import { Move, RotateCcw, Scale, Eye, Grid, Layers, Plus, Maximize2, Minimize2 } from 'lucide-react';
import Scene3D from './Scene3D';
import Scene2D from './Scene2D';

interface GameEditorProps {
  selectedTemplate: GameTemplate | null;
  gameObjects: GameObject[];
  selectedObject: string | null;
  onObjectSelect: (id: string) => void;
  onObjectUpdate: (id: string, updates: Partial<GameObject>) => void;
  onAddObject: (object: GameObject) => void;
  isPlaying: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const GameEditor: React.FC<GameEditorProps> = ({ 
  selectedTemplate, 
  gameObjects, 
  selectedObject, 
  onObjectSelect, 
  onObjectUpdate, 
  onAddObject,
  isPlaying,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [selectedTool, setSelectedTool] = useState<string>('move');
  const [is3DView, setIs3DView] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const tools = [
    { id: 'move', label: 'Move', icon: Move },
    { id: 'rotate', label: 'Rotate', icon: RotateCcw },
    { id: 'scale', label: 'Scale', icon: Scale },
  ];

  const handleAddObject = (type: string) => {
    const newObject: GameObject = {
      id: `${type}-${Date.now()}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      components: [],
      type: type as any,
      color: '#888888'
    };
    onAddObject(newObject);
  };

  if (!selectedTemplate) {
    return (
      <div className="flex-1 bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Layers size={32} className="text-gray-400" />
          </div>
          <h3 className="text-white text-lg font-medium mb-2">No Template Selected</h3>
          <p className="text-gray-400 text-sm">Choose a game template or create a new game</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-800 flex flex-col h-full">
      {/* Editor Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-700 rounded p-1">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`
                    flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors
                    ${selectedTool === tool.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                    }
                  `}
                >
                  <tool.icon size={14} />
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIs3DView(!is3DView)}
                className={`
                  flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors
                  ${is3DView ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:text-white'}
                `}
              >
                <Eye size={14} />
                <span>{is3DView ? '3D' : '2D'}</span>
              </button>
              
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`
                  flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors
                  ${showGrid ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:text-white'}
                `}
              >
                <Grid size={14} />
                <span>Grid</span>
              </button>

              <button
                onClick={onToggleFullscreen}
                className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-gray-700 text-gray-300 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{isFullscreen ? 'Exit' : 'Full'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleAddObject('cube')}
                className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Plus size={14} />
                <span>Cube</span>
              </button>
              <button
                onClick={() => handleAddObject('sphere')}
                className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Plus size={14} />
                <span>Sphere</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs">Editing: {selectedTemplate.name}</span>
            <div className={`
              px-2 py-1 rounded text-xs
              ${selectedTemplate.category === '2D' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}
            `}>
              {selectedTemplate.category}
            </div>
            {isPlaying && (
              <div className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                Playing
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        {selectedTemplate.category === '3D' && is3DView ? (
          <Scene3D
            gameObjects={gameObjects}
            selectedObject={selectedObject}
            onObjectSelect={onObjectSelect}
            onObjectUpdate={onObjectUpdate}
            isPlaying={isPlaying}
            showGrid={showGrid}
          />
        ) : (
          <Scene2D
            gameObjects={gameObjects}
            selectedObject={selectedObject}
            onObjectSelect={onObjectSelect}
            onObjectUpdate={onObjectUpdate}
            isPlaying={isPlaying}
            showGrid={showGrid}
          />
        )}

        {/* Controls Hint */}
        {!isPlaying && (
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2">
            <div className="text-white text-xs space-y-1">
              <div>Click: Select object</div>
              <div>Drag: Move object</div>
              <div>{selectedTemplate.category === '3D' ? 'Mouse: Rotate view' : 'Scroll: Zoom'}</div>
              <div>Two fingers: Pan/Zoom</div>
            </div>
          </div>
        )}

        {/* Game Controls (when playing) */}
        {isPlaying && (
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2">
            <div className="text-white text-xs space-y-1">
              <div>WASD / Arrow Keys: Move</div>
              <div>Space: Jump/Action</div>
              <div>Mouse: Look around</div>
              <div>Touch: Mobile controls</div>
            </div>
          </div>
        )}

        {/* Game UI Overlay (when playing) */}
        {isPlaying && (
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
            <div className="text-white text-xs space-y-1">
              <div>Score: 0</div>
              <div>Lives: 3</div>
              <div>Level: 1</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEditor;