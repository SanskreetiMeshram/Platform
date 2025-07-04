import React, { useState } from 'react';
import { GameTemplate, GameState } from '../types/GameTypes';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Smartphone, Monitor, Tablet } from 'lucide-react';

interface PreviewPanelProps {
  selectedTemplate: GameTemplate | null;
  gameState: GameState;
  onTogglePlay: () => void;
  onResetGame: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
  selectedTemplate, 
  gameState, 
  onTogglePlay, 
  onResetGame,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const devices = [
    { id: 'desktop', label: 'Desktop', icon: Monitor },
    { id: 'tablet', label: 'Tablet', icon: Tablet },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
  ];

  const getDeviceClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-80 h-96';
      case 'tablet':
        return 'w-96 h-72';
      default:
        return 'w-full h-full';
    }
  };

  if (!selectedTemplate) {
    return (
      <div className="bg-gray-800 border-t border-gray-700 h-64 flex items-center justify-center">
        <div className="text-center">
          <Play size={32} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Select a template to preview your game</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700 h-64 flex flex-col">
      {/* Preview Controls */}
      <div className="bg-gray-900 border-b border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onTogglePlay}
              className={`
                flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors
                ${gameState.isPlaying 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }
              `}
            >
              {gameState.isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{gameState.isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            <button 
              onClick={onResetGame}
              className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              <RotateCcw size={14} />
              <span>Restart</span>
            </button>
            
            <button
              onClick={onToggleFullscreen}
              className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isFullscreen ? 'Exit' : 'Full'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-white text-xs space-x-3">
              <span>Score: {gameState.score}</span>
              <span>Lives: {gameState.lives}</span>
              <span>Level: {gameState.level}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">Device:</span>
              <div className="flex items-center space-x-1 bg-gray-700 rounded p-1">
                {devices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setPreviewDevice(device.id as any)}
                    className={`
                      flex items-center space-x-1 px-1 py-0.5 rounded text-xs transition-colors
                      ${previewDevice === device.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                      }
                    `}
                  >
                    <device.icon size={12} />
                    <span>{device.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-2 flex items-center justify-center">
        <div className={`
          bg-gray-900 rounded border border-gray-600 flex items-center justify-center
          ${getDeviceClass()}
        `}>
          <div className="relative w-full h-full rounded overflow-hidden">
            {/* Game Preview based on template */}
            {selectedTemplate.id === 'flappy-bird' && (
              <div className="w-full h-full bg-gradient-to-b from-blue-400 to-green-400 relative">
                <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
                  <div className={`
                    w-6 h-6 bg-yellow-400 rounded-full transition-all duration-300
                    ${gameState.isPlaying ? 'animate-bounce' : ''}
                  `} />
                </div>
                <div className="absolute top-0 right-1/3 w-3 h-20 bg-green-600 rounded-b" />
                <div className="absolute bottom-0 right-1/3 w-3 h-16 bg-green-600 rounded-t" />
                <div className="absolute top-2 left-2 text-white font-bold text-sm">
                  {gameState.isPlaying ? `Score: ${gameState.score}` : 'Tap to Play'}
                </div>
              </div>
            )}
            
            {selectedTemplate.id === 'match-3' && (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 p-2 flex items-center justify-center">
                <div className="grid grid-cols-6 gap-0.5 max-w-32">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`
                        w-4 h-4 rounded transition-all duration-300
                        ${i % 5 === 0 ? 'bg-red-500' :
                          i % 5 === 1 ? 'bg-blue-500' :
                          i % 5 === 2 ? 'bg-green-500' :
                          i % 5 === 3 ? 'bg-yellow-500' :
                          'bg-purple-500'}
                        ${gameState.isPlaying ? 'animate-pulse' : ''}
                      `}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {selectedTemplate.id === 'crossy-road' && (
              <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600 relative">
                <div className="absolute inset-0 bg-gray-600 opacity-30" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)'
                }} />
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
                <div className={`
                  absolute top-1/3 right-2 w-6 h-3 bg-red-500 rounded transition-all duration-500
                  ${gameState.isPlaying ? 'translate-x-[-100px]' : ''}
                `} />
              </div>
            )}
            
            {selectedTemplate.id === 'whack-a-mole' && (
              <div className="w-full h-full bg-green-400 p-2 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-brown-600 rounded-full relative overflow-hidden"
                    >
                      {(gameState.isPlaying && i === 2) && (
                        <div className="absolute bottom-0 w-full h-6 bg-brown-800 rounded-full animate-bounce" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTemplate.id === 'speed-runner' && (
              <div className="w-full h-full bg-gradient-to-b from-blue-300 to-blue-500 relative">
                <div className="absolute bottom-1/4 left-0 right-0 h-6 bg-gray-600" />
                <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full" />
                <div className="absolute bottom-1/2 left-1/2 w-4 h-4 bg-gray-800 rounded" />
                <div className="absolute top-2 left-2 text-white font-bold text-xs">
                  {gameState.isPlaying ? 'Time: 1:23' : 'Ready?'}
                </div>
              </div>
            )}
            
            {(selectedTemplate.id === 'minecraft' || selectedTemplate.id === 'free-fire' || selectedTemplate.id === 'gta-v') && (
              <div className="w-full h-full bg-gradient-to-b from-blue-400 to-green-400 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-20" />
                <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-brown-600 rounded" />
                <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-gray-600 rounded" />
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-600 rounded" />
                <div className="absolute top-2 left-2 text-white font-bold text-xs">
                  {gameState.isPlaying ? '3D View Active' : 'Click to Explore'}
                </div>
              </div>
            )}
            
            {selectedTemplate.id === 'new-game' && (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 relative flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">+</span>
                  </div>
                  <p className="text-white text-xs">New Game</p>
                  <p className="text-gray-400 text-xs">Start from scratch</p>
                </div>
              </div>
            )}
            
            {!gameState.isPlaying && selectedTemplate.id !== 'new-game' && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <Play size={32} className="text-white mx-auto mb-2 opacity-80" />
                  <p className="text-white text-sm font-medium">Click Play</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;