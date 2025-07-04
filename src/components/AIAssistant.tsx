import React, { useState } from 'react';
import { Sparkles, Send, Loader, CheckCircle } from 'lucide-react';
import { GameObject } from '../types/GameTypes';

interface AIAssistantProps {
  onGenerateObject: (object: GameObject) => void;
  onApplyChanges: (changes: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onGenerateObject, onApplyChanges }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Parse prompt and generate appropriate object
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('cube') || lowerPrompt.includes('box')) {
        const newObject: GameObject = {
          id: `ai-cube-${Date.now()}`,
          name: 'AI Cube',
          position: { x: Math.random() * 4 - 2, y: 1, z: Math.random() * 4 - 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          components: [],
          type: 'collectible',
          color: getColorFromPrompt(prompt)
        };
        onGenerateObject(newObject);
        setLastResult(`Created a ${newObject.color} cube`);
      } else if (lowerPrompt.includes('sphere') || lowerPrompt.includes('ball')) {
        const newObject: GameObject = {
          id: `ai-sphere-${Date.now()}`,
          name: 'AI Sphere',
          position: { x: Math.random() * 4 - 2, y: 1, z: Math.random() * 4 - 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          components: [],
          type: 'player',
          color: getColorFromPrompt(prompt)
        };
        onGenerateObject(newObject);
        setLastResult(`Created a ${newObject.color} sphere`);
      } else if (lowerPrompt.includes('platform') || lowerPrompt.includes('ground')) {
        const newObject: GameObject = {
          id: `ai-platform-${Date.now()}`,
          name: 'AI Platform',
          position: { x: 0, y: -0.5, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 5, y: 0.2, z: 5 },
          components: [],
          type: 'platform',
          color: getColorFromPrompt(prompt)
        };
        onGenerateObject(newObject);
        setLastResult(`Created a ${newObject.color} platform`);
      } else if (lowerPrompt.includes('enemy') || lowerPrompt.includes('monster')) {
        const newObject: GameObject = {
          id: `ai-enemy-${Date.now()}`,
          name: 'AI Enemy',
          position: { x: Math.random() * 4 - 2, y: 0, z: Math.random() * 4 - 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1.2, z: 1.2 },
          components: [],
          type: 'enemy',
          color: '#FF4444'
        };
        onGenerateObject(newObject);
        setLastResult('Created a red enemy');
      } else {
        // Default to creating a generic object
        const newObject: GameObject = {
          id: `ai-object-${Date.now()}`,
          name: 'AI Object',
          position: { x: Math.random() * 4 - 2, y: 0, z: Math.random() * 4 - 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          components: [],
          type: 'collectible',
          color: getColorFromPrompt(prompt)
        };
        onGenerateObject(newObject);
        setLastResult(`Created an object based on: "${prompt}"`);
      }
    } catch (error) {
      setLastResult('Failed to generate object. Please try again.');
    }

    setIsGenerating(false);
    setPrompt('');
  };

  const getColorFromPrompt = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('red')) return '#FF4444';
    if (lowerPrompt.includes('blue')) return '#4444FF';
    if (lowerPrompt.includes('green')) return '#44FF44';
    if (lowerPrompt.includes('yellow')) return '#FFFF44';
    if (lowerPrompt.includes('purple')) return '#FF44FF';
    if (lowerPrompt.includes('orange')) return '#FF8844';
    if (lowerPrompt.includes('pink')) return '#FF88FF';
    if (lowerPrompt.includes('brown')) return '#8B4513';
    if (lowerPrompt.includes('black')) return '#333333';
    if (lowerPrompt.includes('white')) return '#FFFFFF';
    return '#888888';
  };

  const quickPrompts = [
    'Create a red cube',
    'Add a blue sphere',
    'Make a green platform',
    'Generate an enemy',
    'Create a yellow collectible',
    'Add a purple obstacle'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="text-purple-400" size={20} />
        <h3 className="text-white font-medium">AI Object Generator</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Describe what you want to create:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a red cube, Add a blue sphere..."
              className="flex-1 bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-md px-4 py-2 text-sm transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Quick Actions:</label>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((quickPrompt, index) => (
              <button
                key={index}
                onClick={() => setPrompt(quickPrompt)}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-md px-3 py-2 text-xs transition-colors text-left"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>

        {lastResult && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">{lastResult}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;