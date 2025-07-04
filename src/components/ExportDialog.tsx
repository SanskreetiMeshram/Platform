import React, { useState } from 'react';
import { GameTemplate } from '../types/GameTypes';
import { Download, Settings, Smartphone, Monitor, Package, X } from 'lucide-react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: GameTemplate | null;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, selectedTemplate }) => {
  const [exportFormat, setExportFormat] = useState<'html5' | 'webgl'>('html5');
  const [resolution, setResolution] = useState('1920x1080');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [includeSource, setIncludeSource] = useState(false);
  const [enableMobile, setEnableMobile] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a comprehensive game export
    const gameHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${selectedTemplate?.name || 'My Game'}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        #gameContainer {
            width: ${resolution.split('x')[0]}px;
            height: ${resolution.split('x')[1]}px;
            max-width: 100vw;
            max-height: 100vh;
            background: linear-gradient(to bottom, #87CEEB, #98FB98);
            position: relative;
            overflow: hidden;
        }
        #gameUI {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            font-weight: bold;
            z-index: 100;
        }
        #controls {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            text-align: center;
            font-size: 14px;
        }
        .game-object {
            position: absolute;
            transition: all 0.1s ease;
        }
        .player {
            width: 30px;
            height: 30px;
            background: #FFD700;
            border-radius: 50%;
        }
        .obstacle {
            background: #228B22;
        }
        .platform {
            background: #696969;
        }
        @media (max-width: 768px) {
            #gameContainer {
                width: 100vw;
                height: 100vh;
            }
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <div id="gameUI">
            <div>Score: <span id="score">0</span></div>
            <div>Lives: <span id="lives">3</span></div>
        </div>
        <div id="controls">
            ${enableMobile ? 'Touch to move | ' : ''}WASD or Arrow Keys to move | Space to jump
        </div>
    </div>

    <script>
        class Game {
            constructor() {
                this.container = document.getElementById('gameContainer');
                this.score = 0;
                this.lives = 3;
                this.gameObjects = [];
                this.keys = {};
                this.isRunning = false;
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.createPlayer();
                this.createGameObjects();
                this.start();
            }

            setupEventListeners() {
                document.addEventListener('keydown', (e) => {
                    this.keys[e.key.toLowerCase()] = true;
                });
                document.addEventListener('keyup', (e) => {
                    this.keys[e.key.toLowerCase()] = false;
                });
                
                ${enableMobile ? `
                this.container.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const rect = this.container.getBoundingClientRect();
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;
                    this.handleTouch(x, y);
                });
                ` : ''}
            }

            createPlayer() {
                const player = document.createElement('div');
                player.className = 'game-object player';
                player.id = 'player';
                player.style.left = '50px';
                player.style.top = '50%';
                this.container.appendChild(player);
                
                this.player = {
                    element: player,
                    x: 50,
                    y: this.container.offsetHeight / 2,
                    vx: 0,
                    vy: 0
                };
            }

            createGameObjects() {
                // Create game-specific objects based on template
                const templateId = '${selectedTemplate?.id}';
                
                if (templateId === 'flappy-bird') {
                    this.createPipes();
                } else if (templateId === 'crossy-road') {
                    this.createRoad();
                } else if (templateId === 'minecraft') {
                    this.createBlocks();
                }
            }

            createPipes() {
                for (let i = 0; i < 3; i++) {
                    const pipe = document.createElement('div');
                    pipe.className = 'game-object obstacle';
                    pipe.style.width = '50px';
                    pipe.style.height = '200px';
                    pipe.style.left = (300 + i * 200) + 'px';
                    pipe.style.top = '100px';
                    this.container.appendChild(pipe);
                    
                    this.gameObjects.push({
                        element: pipe,
                        x: 300 + i * 200,
                        y: 100,
                        type: 'pipe'
                    });
                }
            }

            createRoad() {
                const road = document.createElement('div');
                road.className = 'game-object platform';
                road.style.width = '100%';
                road.style.height = '100px';
                road.style.left = '0';
                road.style.bottom = '0';
                this.container.appendChild(road);
            }

            createBlocks() {
                for (let i = 0; i < 5; i++) {
                    const block = document.createElement('div');
                    block.className = 'game-object';
                    block.style.width = '40px';
                    block.style.height = '40px';
                    block.style.background = '#32CD32';
                    block.style.left = (100 + i * 60) + 'px';
                    block.style.bottom = '100px';
                    this.container.appendChild(block);
                }
            }

            handleTouch(x, y) {
                const centerX = this.container.offsetWidth / 2;
                const centerY = this.container.offsetHeight / 2;
                
                if (x < centerX) {
                    this.player.vx = -2;
                } else {
                    this.player.vx = 2;
                }
                
                if (y < centerY) {
                    this.player.vy = -2;
                } else {
                    this.player.vy = 2;
                }
            }

            update() {
                if (!this.isRunning) return;

                // Handle input
                if (this.keys['a'] || this.keys['arrowleft']) {
                    this.player.vx = -3;
                } else if (this.keys['d'] || this.keys['arrowright']) {
                    this.player.vx = 3;
                } else {
                    this.player.vx *= 0.8;
                }

                if (this.keys['w'] || this.keys['arrowup'] || this.keys[' ']) {
                    this.player.vy = -3;
                } else if (this.keys['s'] || this.keys['arrowdown']) {
                    this.player.vy = 3;
                } else {
                    this.player.vy *= 0.8;
                }

                // Update player position
                this.player.x += this.player.vx;
                this.player.y += this.player.vy;

                // Keep player in bounds
                this.player.x = Math.max(0, Math.min(this.container.offsetWidth - 30, this.player.x));
                this.player.y = Math.max(0, Math.min(this.container.offsetHeight - 30, this.player.y));

                // Update player element
                this.player.element.style.left = this.player.x + 'px';
                this.player.element.style.top = this.player.y + 'px';

                // Update game objects
                this.gameObjects.forEach(obj => {
                    if (obj.type === 'pipe') {
                        obj.x -= 2;
                        if (obj.x < -50) {
                            obj.x = this.container.offsetWidth;
                            this.score += 10;
                            this.updateUI();
                        }
                        obj.element.style.left = obj.x + 'px';
                    }
                });

                requestAnimationFrame(() => this.update());
            }

            updateUI() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('lives').textContent = this.lives;
            }

            start() {
                this.isRunning = true;
                this.update();
            }

            stop() {
                this.isRunning = false;
            }
        }

        // Start the game
        window.addEventListener('load', () => {
            new Game();
        });
    </script>
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([gameHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.name || 'game'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">Export Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportFormat('html5')}
                className={`
                  p-3 rounded-lg border-2 transition-colors
                  ${exportFormat === 'html5' 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  }
                `}
              >
                <Package size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">HTML5</div>
                <div className="text-xs opacity-70">Lightweight</div>
              </button>
              <button
                onClick={() => setExportFormat('webgl')}
                className={`
                  p-3 rounded-lg border-2 transition-colors
                  ${exportFormat === 'webgl' 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  }
                `}
              >
                <Monitor size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">WebGL</div>
                <div className="text-xs opacity-70">3D Optimized</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1920x1080">1920x1080 (Full HD)</option>
              <option value="1280x720">1280x720 (HD)</option>
              <option value="960x540">960x540 (QHD)</option>
              <option value="800x600">800x600 (SVGA)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Quality</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`
                    px-3 py-2 rounded-md text-sm transition-colors
                    ${quality === q 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mobile"
                checked={enableMobile}
                onChange={(e) => setEnableMobile(e.target.checked)}
                className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mobile" className="text-gray-300 text-sm flex items-center space-x-2">
                <Smartphone size={16} />
                <span>Enable mobile controls</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="source"
                checked={includeSource}
                onChange={(e) => setIncludeSource(e.target.checked)}
                className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="source" className="text-gray-300 text-sm flex items-center space-x-2">
                <Settings size={16} />
                <span>Include source code</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <h3 className="text-white font-medium mb-2">Export Preview</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Game: {selectedTemplate?.name}</div>
              <div>Format: {exportFormat.toUpperCase()}</div>
              <div>Resolution: {resolution}</div>
              <div>Quality: {quality}</div>
              <div>Mobile: {enableMobile ? 'Enabled' : 'Disabled'}</div>
              <div>Estimated size: ~{quality === 'high' ? '25' : quality === 'medium' ? '15' : '8'} MB</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md px-4 py-2 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-md px-4 py-2 text-sm transition-colors flex items-center justify-center space-x-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Export Game</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;