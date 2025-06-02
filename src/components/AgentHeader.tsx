import React from 'react';
import { AgentType } from '../types';
import { Database, Layers, Search, Brain } from 'lucide-react';

interface AgentHeaderProps {
  agent: AgentType;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ agent }) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Database':
        return <Database className="w-6 h-6" />;
      case 'Layers':
        return <Layers className="w-6 h-6" />;
      case 'Search':
        return <Search className="w-6 h-6" />;
      case 'Brain':
        return <Brain className="w-6 h-6" />;
      default:
        return <Database className="w-6 h-6" />;
    }
  };

  return (
    <div className="text-center pt-8 pb-6">
      <div 
        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3"
        style={{ backgroundColor: agent.color }}
      >
        <div className="text-white">
          {getIconComponent(agent.icon)}
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-neutral-800">{agent.name}</h1>
      <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">{agent.description}</p>
    </div>
  );
};

export default AgentHeader;