import React from 'react';
import { FileText, Save, FolderOpen, Download, Settings, Copy, Cast as Paste, Undo, Redo, Image, Music, Package, Plus, Trash2, Edit3, Layers, Grid, Camera, Monitor, Smartphone, Tablet, Eye, RotateCcw, Move, Scale } from 'lucide-react';

interface MenuDropdownProps {
  type: 'file' | 'edit' | 'assets' | 'gameObject' | 'component' | 'window';
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ type, isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  const menuItems = {
    file: [
      { id: 'new', label: 'New Project', icon: FileText, shortcut: 'Ctrl+N' },
      { id: 'open', label: 'Open Project', icon: FolderOpen, shortcut: 'Ctrl+O' },
      { id: 'save', label: 'Save Project', icon: Save, shortcut: 'Ctrl+S' },
      { id: 'export', label: 'Export Game', icon: Download, shortcut: 'Ctrl+E' },
      { id: 'settings', label: 'Project Settings', icon: Settings }
    ],
    edit: [
      { id: 'undo', label: 'Undo', icon: Undo, shortcut: 'Ctrl+Z' },
      { id: 'redo', label: 'Redo', icon: Redo, shortcut: 'Ctrl+Y' },
      { id: 'copy', label: 'Copy', icon: Copy, shortcut: 'Ctrl+C' },
      { id: 'paste', label: 'Paste', icon: Paste, shortcut: 'Ctrl+V' },
      { id: 'delete', label: 'Delete', icon: Trash2, shortcut: 'Del' },
      { id: 'duplicate', label: 'Duplicate', icon: Copy, shortcut: 'Ctrl+D' }
    ],
    assets: [
      { id: 'import-sprite', label: 'Import Sprite', icon: Image },
      { id: 'import-model', label: 'Import 3D Model', icon: Package },
      { id: 'import-audio', label: 'Import Audio', icon: Music },
      { id: 'generate-ai', label: 'Generate with AI', icon: Plus },
      { id: 'asset-store', label: 'Asset Store', icon: Package }
    ],
    gameObject: [
      { id: 'create-empty', label: 'Create Empty', icon: Plus },
      { id: 'create-cube', label: 'Create Cube', icon: Package },
      { id: 'create-sphere', label: 'Create Sphere', icon: Package },
      { id: 'create-plane', label: 'Create Plane', icon: Package },
      { id: 'create-light', label: 'Create Light', icon: Plus },
      { id: 'create-camera', label: 'Create Camera', icon: Camera }
    ],
    component: [
      { id: 'add-rigidbody', label: 'Add Rigidbody', icon: Plus },
      { id: 'add-collider', label: 'Add Collider', icon: Plus },
      { id: 'add-script', label: 'Add Script', icon: Edit3 },
      { id: 'add-renderer', label: 'Add Renderer', icon: Plus },
      { id: 'add-audio', label: 'Add Audio Source', icon: Music },
      { id: 'add-animation', label: 'Add Animation', icon: Move }
    ],
    window: [
      { id: 'hierarchy', label: 'Hierarchy', icon: Layers },
      { id: 'inspector', label: 'Inspector', icon: Settings },
      { id: 'scene', label: 'Scene View', icon: Grid },
      { id: 'game', label: 'Game View', icon: Monitor },
      { id: 'console', label: 'Console', icon: FileText },
      { id: 'project', label: 'Project Browser', icon: FolderOpen }
    ]
  };

  const items = menuItems[type] || [];

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-48">
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              onAction(item.id);
              onClose();
            }}
            className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-2">
              <item.icon size={14} />
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-xs text-gray-500">{item.shortcut}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDropdown;