import React, { useState } from 'react';
import { Play, Pause, Download, Save, Settings, HelpCircle, User } from 'lucide-react';
import MenuDropdown from './MenuDropdown';

interface HeaderProps {
  onExport: () => void;
  onSave: () => void;
  onPlay: () => void;
  isPlaying: boolean;
  onMenuAction: (menu: string, action: string) => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onExport, 
  onSave, 
  onPlay, 
  isPlaying, 
  onMenuAction,
  canUndo,
  canRedo
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems = [
    { id: 'file', label: 'File' },
    { id: 'edit', label: 'Edit' },
    { id: 'assets', label: 'Assets' },
    { id: 'gameObject', label: 'GameObject' },
    { id: 'component', label: 'Component' },
    { id: 'window', label: 'Window' }
  ];

  const handleMenuClick = (menuId: string) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const handleMenuAction = (action: string) => {
    if (openMenu) {
      onMenuAction(openMenu, action);
    }
    setOpenMenu(null);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 h-10 flex items-center justify-between px-3 relative z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">EE</span>
          </div>
          <span className="text-white font-semibold text-sm">EpicEnders</span>
        </div>
        
        <nav className="flex items-center space-x-1">
          {menuItems.map((menu) => (
            <div key={menu.id} className="relative">
              <button
                onClick={() => handleMenuClick(menu.id)}
                className={`
                  text-gray-300 hover:text-white text-xs transition-colors px-2 py-1 rounded
                  ${openMenu === menu.id ? 'bg-gray-700 text-white' : ''}
                `}
              >
                {menu.label}
              </button>
              <MenuDropdown
                type={menu.id as any}
                isOpen={openMenu === menu.id}
                onClose={() => setOpenMenu(null)}
                onAction={handleMenuAction}
              />
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onPlay}
          className={`
            flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors
            ${isPlaying 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
          `}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? 'Stop' : 'Play'}</span>
        </button>
        
        <button
          onClick={onSave}
          className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          <Save size={14} />
          <span>Save</span>
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          <Download size={14} />
          <span>Export</span>
        </button>

        <div className="flex items-center space-x-1 ml-2">
          <button className="text-gray-300 hover:text-white p-1 rounded transition-colors">
            <Settings size={16} />
          </button>
          <button className="text-gray-300 hover:text-white p-1 rounded transition-colors">
            <HelpCircle size={16} />
          </button>
          <button className="text-gray-300 hover:text-white p-1 rounded transition-colors">
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;