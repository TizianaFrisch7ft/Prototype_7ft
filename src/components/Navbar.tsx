import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { agents } from '../data/agents';
import { companies, defaultCompany } from '../data/companies';
import { Company } from '../types';
import { ChevronDown, Home, Settings, Database, Layers, Search, Brain } from 'lucide-react';

const Navbar: React.FC = () => {
  const [currentCompany, setCurrentCompany] = useState<Company>(defaultCompany);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const agentPath = location.pathname.match(/\/agent\/([\w-]+)/);
    setSelectedAgent(agentPath ? agentPath[1] : null);
  }, [location]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const toggleCompanyMenu = () => {
    setIsCompanyMenuOpen(!isCompanyMenuOpen);
  };

  const changeCompany = (company: Company) => {
    setCurrentCompany(company);
    setIsCompanyMenuOpen(false);
  };

  const currentAgent = agents.find(agent => agent.id === selectedAgent);

  return (
    <nav className="w-64 h-screen bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-4 border-b border-neutral-200">
        <NavLink to="/" className="flex items-center gap-2 text-xl font-semibold text-primary-700">
          <span className="text-2xl">7FT</span>
          <span className="text-neutral-500 text-sm font-normal">AI Services</span>
        </NavLink>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
        <NavLink to="/" className={({ isActive }) => 
          `sidebar-item ${isActive ? 'active' : ''}`
        }>
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
        
        {!selectedAgent && (
          <>
            <div className="mt-2 mb-1 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Agents
            </div>
            {agents.map(agent => (
              <NavLink 
                key={agent.id}
                to={`/agent/${agent.id}`} 
                className={({ isActive }) => 
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <div className="w-5 h-5" style={{ color: agent.color }}>
                  {getIconComponent(agent.icon)}
                </div>
                <span>{agent.name}</span>
              </NavLink>
            ))}
          </>
        )}

        {currentAgent && (
          <>
            <div className="mt-2 mb-1 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Active Agent
            </div>
            <NavLink 
              to={`/agent/${currentAgent.id}`} 
              className="sidebar-item active"
            >
              <div className="w-5 h-5" style={{ color: currentAgent.color }}>
                {getIconComponent(currentAgent.icon)}
              </div>
              <span>{currentAgent.name}</span>
            </NavLink>
          </>
        )}
        

        <div className="mt-auto">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-200 relative">
        <button 
          onClick={toggleCompanyMenu}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {currentCompany.name.charAt(0)}
            </div>
            <div className="text-sm">
              <div className="font-medium">{currentCompany.name}</div>
              <div className="text-xs text-neutral-500">Company</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        </button>
        
        {isCompanyMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden z-10">
            {companies.map(company => (
              <button
                key={company.id}
                onClick={() => changeCompany(company)}
                className={`w-full text-left p-3 hover:bg-neutral-100 flex items-center gap-2 ${
                  company.id === currentCompany.id ? 'bg-neutral-100' : ''
                }`}
              >
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {company.name.charAt(0)}
                </div>
                <span className="text-sm">{company.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;