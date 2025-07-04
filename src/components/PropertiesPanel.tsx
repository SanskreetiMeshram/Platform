import React, { useState } from 'react';
import { GameTemplate, GameObject } from '../types/GameTypes';
import { Settings, Palette, Music, Zap, Sliders, Gamepad2 } from 'lucide-react';
import AIAssistant from './AIAssistant';

interface PropertiesPanelProps {
  selectedTemplate: GameTemplate | null;
  selectedObject: GameObject | null;
  onObjectUpdate: (id: string, updates: Partial<GameObject>) => void;
  onAddObject: (object: GameObject) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedTemplate, 
  selectedObject, 
  onObjectUpdate, 
  onAddObject 
}) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [difficulty, setDifficulty] = useState(50);
  const [musicVolume, setMusicVolume] = useState(75);
  const [sfxVolume, setSfxVolume] = useState(80);

  const tabs = [
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'styling', label: 'Styling', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'ai', label: 'AI Tools', icon: Zap },
    { id: 'gameplay', label: 'Gameplay', icon: Gamepad2 },
  ];

  const handleObjectPropertyChange = (property: string, value: any) => {
    if (selectedObject) {
      onObjectUpdate(selectedObject.id, { [property]: value });
    }
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedObject) {
      const newPosition = { ...selectedObject.position, [axis]: value };
      onObjectUpdate(selectedObject.id, { position: newPosition });
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedObject) {
      const newRotation = { ...selectedObject.rotation, [axis]: value };
      onObjectUpdate(selectedObject.id, { rotation: newRotation });
    }
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedObject) {
      const newScale = { ...selectedObject.scale, [axis]: value };
      onObjectUpdate(selectedObject.id, { scale: newScale });
    }
  };

  if (!selectedTemplate) {
    return (
      <aside className="bg-gray-800 w-80 border-l border-gray-700 flex items-center justify-center">
        <div className="text-center">
          <Settings size={32} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Select a template to view properties</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-gray-800 w-80 border-l border-gray-700 flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <div className="flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-1 px-3 py-2 text-sm transition-colors
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            {selectedObject ? (
              <>
                <div>
                  <h3 className="text-white font-medium mb-3">Object Properties</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Name</label>
                      <input
                        type="text"
                        value={selectedObject.name}
                        onChange={(e) => handleObjectPropertyChange('name', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Type</label>
                      <select
                        value={selectedObject.type}
                        onChange={(e) => handleObjectPropertyChange('type', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="player">Player</option>
                        <option value="enemy">Enemy</option>
                        <option value="obstacle">Obstacle</option>
                        <option value="collectible">Collectible</option>
                        <option value="platform">Platform</option>
                        <option value="background">Background</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Color</label>
                      <input
                        type="color"
                        value={selectedObject.color || '#888888'}
                        onChange={(e) => handleObjectPropertyChange('color', e.target.value)}
                        className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">Transform</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">X</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedObject.position.x}
                            onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Y</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedObject.position.y}
                            onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Z</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedObject.position.z}
                            onChange={(e) => handlePositionChange('z', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Rotation</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">X</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedObject.rotation.x}
                            onChange={(e) => handleRotationChange('x', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Y</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedObject.rotation.y}
                            onChange={(e) => handleRotationChange('y', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Z</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedObject.rotation.z}
                            onChange={(e) => handleRotationChange('z', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Scale</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">X</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={selectedObject.scale.x}
                            onChange={(e) => handleScaleChange('x', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Y</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={selectedObject.scale.y}
                            onChange={(e) => handleScaleChange('y', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Z</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={selectedObject.scale.z}
                            onChange={(e) => handleScaleChange('z', parseFloat(e.target.value))}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-white font-medium mb-3">Game Properties</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Game Name</label>
                    <input
                      type="text"
                      defaultValue={selectedTemplate.name}
                      className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Description</label>
                    <textarea
                      defaultValue={selectedTemplate.description}
                      className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Category</label>
                    <select className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="2D">2D Game</option>
                      <option value="3D">3D Game</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'styling' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-3">Visual Styling</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Color Scheme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'].map((color) => (
                      <button
                        key={color}
                        className="w-full h-10 rounded-md border-2 border-gray-600 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Background Style</label>
                  <select className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                    <option value="texture">Texture</option>
                    <option value="image">Background Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-gray-700 text-white rounded-md px-3 py-2 text-sm hover:bg-gray-600 transition-colors">
                      Classic
                    </button>
                    <button className="bg-gray-700 text-white rounded-md px-3 py-2 text-sm hover:bg-gray-600 transition-colors">
                      Modern
                    </button>
                    <button className="bg-gray-700 text-white rounded-md px-3 py-2 text-sm hover:bg-gray-600 transition-colors">
                      Retro
                    </button>
                    <button className="bg-gray-700 text-white rounded-md px-3 py-2 text-sm hover:bg-gray-600 transition-colors">
                      Neon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-3">Audio Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Music Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span className="text-white">{musicVolume}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">SFX Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span className="text-white">{sfxVolume}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Background Music</label>
                  <select className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="none">None</option>
                    <option value="upbeat">Upbeat</option>
                    <option value="ambient">Ambient</option>
                    <option value="electronic">Electronic</option>
                    <option value="orchestral">Orchestral</option>
                  </select>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm transition-colors">
                  Generate Music with AI
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <AIAssistant
            onGenerateObject={onAddObject}
            onApplyChanges={() => {}}
          />
        )}

        {activeTab === 'gameplay' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-3">Gameplay Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Easy</span>
                    <span className="text-white">{difficulty}%</span>
                    <span>Hard</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Game Speed</label>
                  <select className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Lives</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    defaultValue="3"
                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="powerups"
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="powerups" className="text-gray-300 text-sm">Enable Power-ups</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="leaderboard"
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="leaderboard" className="text-gray-300 text-sm">Enable Leaderboard</label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-3">Controls</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="keyboard"
                    defaultChecked
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="keyboard" className="text-gray-300 text-sm">Keyboard Controls</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mouse"
                    defaultChecked
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="mouse" className="text-gray-300 text-sm">Mouse Controls</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="touch"
                    defaultChecked
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="touch" className="text-gray-300 text-sm">Touch Controls</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="gamepad"
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="gamepad" className="text-gray-300 text-sm">Gamepad Support</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PropertiesPanel;