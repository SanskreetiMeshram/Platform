import React, { useState } from 'react';
import { GameTemplate, GameObject } from './types/GameTypes';
import { useGameEngine } from './hooks/useGameEngine';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GameEditor from './components/GameEditor';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewPanel from './components/PreviewPanel';
import ExportDialog from './components/ExportDialog';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    gameState,
    togglePlay,
    resetGame,
    addObject,
    updateObject,
    removeObject,
    copyObject,
    undo,
    redo,
    canUndo,
    canRedo
  } = useGameEngine(selectedTemplate);

  const handleTemplateSelect = (template: GameTemplate) => {
    setSelectedTemplate(template);
    setSelectedObject(null);
    resetGame();
  };

  const handleCreateNew = () => {
    const newGameTemplate: GameTemplate = {
      id: 'new-game',
      name: 'New Game',
      description: 'Custom game created from scratch',
      category: '3D',
      difficulty: 'Easy',
      icon: 'Plus',
      preview: '',
      features: ['Custom Design', 'Full Control'],
      estimatedTime: '60+ minutes'
    };
    handleTemplateSelect(newGameTemplate);
  };

  const handleObjectSelect = (id: string) => {
    setSelectedObject(id);
  };

  const handleObjectUpdate = (id: string, updates: Partial<GameObject>) => {
    updateObject(id, updates);
  };

  const handleAddObject = (object: GameObject) => {
    addObject(object);
  };

  const handleExport = () => {
    setIsExportDialogOpen(true);
  };

  const handleSave = () => {
    const saveData = {
      template: selectedTemplate,
      gameObjects: gameState.gameObjects,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('epicenders-save', JSON.stringify(saveData));
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Game saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleMenuAction = (menu: string, action: string) => {
    console.log(`Menu action: ${menu} -> ${action}`);
    
    switch (action) {
      case 'new':
        if (confirm('Create new project? Unsaved changes will be lost.')) {
          handleCreateNew();
        }
        break;
      case 'save':
        handleSave();
        break;
      case 'export':
        handleExport();
        break;
      case 'open':
        const saved = localStorage.getItem('epicenders-save');
        if (saved) {
          try {
            const saveData = JSON.parse(saved);
            setSelectedTemplate(saveData.template);
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = 'Project loaded successfully!';
            document.body.appendChild(notification);
            setTimeout(() => document.body.removeChild(notification), 3000);
          } catch (e) {
            alert('Failed to load project');
          }
        } else {
          alert('No saved project found');
        }
        break;
      case 'undo':
        undo();
        break;
      case 'redo':
        redo();
        break;
      case 'copy':
        if (selectedObject) {
          copyObject(selectedObject);
        }
        break;
      case 'delete':
        if (selectedObject) {
          removeObject(selectedObject);
          setSelectedObject(null);
        }
        break;
      case 'create-empty':
        const empty: GameObject = {
          id: `empty-${Date.now()}`,
          name: 'Empty Object',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          components: [],
          type: 'collectible',
          color: '#888888'
        };
        addObject(empty);
        break;
      case 'create-cube':
        const cube: GameObject = {
          id: `cube-${Date.now()}`,
          name: 'Cube',
          position: { x: 0, y: 1, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          components: [],
          type: 'collectible',
          color: '#888888'
        };
        addObject(cube);
        break;
      case 'create-sphere':
        const sphere: GameObject = {
          id: `sphere-${Date.now()}`,
          name: 'Sphere',
          position: { x: 0, y: 1, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          components: [],
          type: 'player',
          color: '#FF6B6B'
        };
        addObject(sphere);
        break;
      case 'create-plane':
        const plane: GameObject = {
          id: `plane-${Date.now()}`,
          name: 'Plane',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 5, y: 0.1, z: 5 },
          components: [],
          type: 'platform',
          color: '#32CD32'
        };
        addObject(plane);
        break;
      case 'create-light':
        const light: GameObject = {
          id: `light-${Date.now()}`,
          name: 'Light',
          position: { x: 0, y: 3, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.5, y: 0.5, z: 0.5 },
          components: [],
          type: 'collectible',
          color: '#FFFF00'
        };
        addObject(light);
        break;
      case 'add-rigidbody':
      case 'add-collider':
      case 'add-script':
      case 'add-renderer':
      case 'add-audio':
      case 'add-animation':
        if (selectedObject) {
          const obj = gameState.gameObjects.find(o => o.id === selectedObject);
          if (obj) {
            const component = {
              type: action.replace('add-', ''),
              properties: {}
            };
            updateObject(selectedObject, {
              components: [...obj.components, component]
            });
            
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = `${component.type} component added!`;
            document.body.appendChild(notification);
            setTimeout(() => document.body.removeChild(notification), 2000);
          }
        }
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  const selectedGameObject = selectedObject 
    ? gameState.gameObjects.find(obj => obj.id === selectedObject) 
    : null;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-900 flex flex-col overflow-hidden`}>
      <Header 
        onExport={handleExport} 
        onSave={handleSave} 
        onPlay={togglePlay}
        isPlaying={gameState.isPlaying}
        onMenuAction={handleMenuAction}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {!isFullscreen && (
          <Sidebar
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onCreateNew={handleCreateNew}
          />
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <GameEditor 
              selectedTemplate={selectedTemplate}
              gameObjects={gameState.gameObjects}
              selectedObject={selectedObject}
              onObjectSelect={handleObjectSelect}
              onObjectUpdate={handleObjectUpdate}
              onAddObject={handleAddObject}
              isPlaying={gameState.isPlaying}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
            {!isFullscreen && (
              <PropertiesPanel 
                selectedTemplate={selectedTemplate}
                selectedObject={selectedGameObject}
                onObjectUpdate={handleObjectUpdate}
                onAddObject={handleAddObject}
              />
            )}
          </div>
          
          {!isFullscreen && (
            <PreviewPanel 
              selectedTemplate={selectedTemplate}
              gameState={gameState}
              onTogglePlay={togglePlay}
              onResetGame={resetGame}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          )}
        </div>
      </div>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
}

export default App;