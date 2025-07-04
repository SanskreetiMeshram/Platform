import React, { useState } from 'react';
import { gameTemplates } from '../data/GameTemplates';
import { GameTemplate } from '../types/GameTypes';
import * as LucideIcons from 'lucide-react';
import { Plus } from 'lucide-react';

interface SidebarProps {
  selectedTemplate: GameTemplate | null;
  onTemplateSelect: (template: GameTemplate) => void;
  onCreateNew: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedTemplate, onTemplateSelect, onCreateNew }) => {
  const [filter, setFilter] = useState<'all' | '2D' | '3D'>('all');

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={16} /> : <LucideIcons.GamepadIcon size={16} />;
  };

  const filteredTemplates = gameTemplates.filter(template => 
    filter === 'all' || template.category === filter
  );

  return (
    <aside className="bg-gray-800 w-72 border-r border-gray-700 flex flex-col h-full">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-white font-semibold text-sm mb-2">Game Templates</h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-1 mb-3">
          {(['all', '2D', '3D'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`
                px-2 py-1 text-xs rounded transition-colors
                ${filter === filterType 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {filterType === 'all' ? 'All' : filterType}
            </button>
          ))}
        </div>

        {/* Create New Button */}
        <button
          onClick={onCreateNew}
          className="w-full flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors text-sm"
        >
          <Plus size={16} />
          <span>Create New Game</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 gap-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              className={`
                cursor-pointer rounded-lg border transition-all duration-200 p-3
                ${selectedTemplate?.id === template.id 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                }
              `}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  {getIcon(template.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-xs truncate">{template.name}</h3>
                  <div className="flex items-center space-x-1">
                    <span className={`
                      px-1 py-0.5 text-xs rounded
                      ${template.category === '2D' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}
                    `}>
                      {template.category}
                    </span>
                    <span className={`
                      px-1 py-0.5 text-xs rounded
                      ${template.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                        template.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'}
                    `}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {template.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="px-1 py-0.5 bg-gray-600/50 text-gray-300 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {template.features.length > 2 && (
                  <span className="px-1 py-0.5 bg-gray-600/50 text-gray-300 text-xs rounded">
                    +{template.features.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;