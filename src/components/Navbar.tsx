import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { agents } from '../data/agents';
import { companies, defaultCompany } from '../data/companies';
import { Company } from '../types';
import { ChevronDown, Home, Settings, Database, Layers, Search, Brain } from 'lucide-react';
import { useBackground } from './BackgroundContext'; 
import Pagina1 from '../images/Pagina1.png';
import Pagina2 from '../images/Pagina2.png';
import Pagina3 from '../images/Pagina3.png';
 import Pagina4 from '../images/Pagina4.png';
 import Pagina5 from '../images/Pagina5.png';

const Navbar: React.FC = () => {
  const [currentCompany, setCurrentCompany] = useState<Company>(defaultCompany);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [openMenuAgentId, setOpenMenuAgentId] = useState<string | null>(null);
  const [showArchAgentId, setShowArchAgentId] = useState<string | null>(null);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
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

  const functionalAgentIds = [
    'agent-bd',
    'agent-documents',
    'agent-vectorize',
    'agent-websearch'
  ];

  const architectures: Record<string, string[]> = {
    'agent-bd': ['MongoDB', 'OpenAI', 'Express', 'TypeScript', 'Node.js'],
    'agent-documents': ['PDF-Parse', 'OpenAI', 'Nodejs', 'TypeScript'],
    'agent-vectorize': ['Weviate', 'OpenAI', 'Express', 'TypeScript'],
    'agent-websearch': ['DuckDuckGo', 'OpenAI', 'Express', 'TypeScript'],
    'agent-expensesauditor': ['MongoDB', 'OpenAI', 'PDF-Parse', 'TypeScript', 'Node.js'],
  };

  const renderAgentMenu = (agentId: string) => {
    // Mostrar solo el box de arquitectura si corresponde
    if (openMenuAgentId === agentId && showArchAgentId === agentId) {
      return (
        <div
          className="absolute right-0 top-7 z-50 bg-white border rounded shadow-lg p-3 min-w-[180px] text-xs"
          style={{ minWidth: 180 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="font-semibold text-primary-700 mb-2">Components</div>
          <ul className="space-y-1">
            {(architectures[agentId] || ['No info']).map((comp, idx) => (
              <li key={idx} className="px-2 py-1 rounded bg-neutral-100 text-neutral-800">{comp}</li>
            ))}
          </ul>
          <button
            className="block w-full text-left px-4 py-1 mt-3 rounded bg-primary-50 hover:bg-primary-100 text-primary-700"
            onClick={e => {
              e.stopPropagation();
              setShowArchAgentId(null);
            }}
          >
            Return
          </button>
        </div>
      );
    }

    // Menú principal solo si no está mostrando arquitectura
    if (openMenuAgentId === agentId && showArchAgentId == null) {
      return (
        <div
          className="absolute right-0 top-7 z-50 bg-white border rounded shadow-md text-xs min-w-[120px] py-1"
          style={{ minWidth: 120 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="block w-full text-left px-4 py-1 hover:bg-neutral-100">Prompt</button>
          <button
            className="block w-full text-left px-4 py-1 hover:bg-neutral-100"
            onClick={e => {
              e.stopPropagation();
              setShowArchAgentId(agentId);
            }}
          >
            Architecture
          </button>
          <button className="block w-full text-left px-4 py-1 hover:bg-neutral-100">Deploy</button>
        </div>
      );
    }

    return null;
  };

  // Lista de backgrounds (puedes agregar url de imagen en el futuro)
 const backgrounds = [
  { name: 'Architecture Components', img: Pagina1 },
  { name: 'Architecture Process', img: Pagina2 },
  { name: 'Unio', img: Pagina3 },
  { name: 'Oracle Main', img: Pagina4 },
  { name: 'Oracle Report', img: Pagina5 }
];


  // Estado para background seleccionado
  const { selectedBackground, setSelectedBackground } = useBackground();

  // Cambia el background del body (o landing page) y oculta el contenido principal si hay imagen/color seleccionado
  useEffect(() => {
    // Solo cambia el background si NO estás en un chat de agente
    const isAgentChat = /^\/agent\//.test(location.pathname);
    if (!isAgentChat && (selectedBackground.img || selectedBackground.color)) {
      document.body.style.background = selectedBackground.img
        ? `url(${selectedBackground.img ?? ''}) 75% center / 65% auto no-repeat`
        : (selectedBackground.color ?? '');
    } else {
      document.body.style.background = '#fff';
    }
    return () => {
      document.body.style.background = '';
    };
  }, [selectedBackground, location.pathname]);

  return (
    <nav className="w-72 h-screen bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-4 border-b border-neutral-200">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-xl font-semibold text-primary-700"
          onClick={() => {
            setSelectedAgent(null);
            setOpenMenuAgentId(null);
            setShowArchAgentId(null);
          }}
        >
          <span className="text-2xl">7FT</span>
          <span className="text-neutral-500 text-sm font-normal">AI Services</span>
        </NavLink>
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-1">
        <NavLink to="/" className={({ isActive }) => 
          `sidebar-item ${isActive ? 'active' : ''}`
        }>
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
        
        {!selectedAgent && (
          <>
            <div className="mt-2 mb-1 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Functional Agents
            </div>
            {agents.filter(agent => functionalAgentIds.includes(agent.id)).map(agent => (
              <div key={agent.id} className="relative">
                <NavLink 
                  to={`/agent/${agent.id}`} 
                  className={({ isActive }) => 
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <div className="w-5 h-5" style={{ color: agent.color }}>
                    {getIconComponent(agent.icon)}
                  </div>
                  <span>{agent.name}</span>
                  <span
                    className="ml-auto pl-2 text-neutral-400 cursor-pointer"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuAgentId(openMenuAgentId === agent.id ? null : agent.id);
                    }}
                  >⋯</span>
                </NavLink>
                {renderAgentMenu(agent.id)}
              </div>
            ))}
            <div className="mt-4 mb-1 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Business Agents
            </div>
            {/* Expenses Auditor primero */}
            {agents.filter(agent => agent.id === 'agent-expensesauditor').map(agent => (
              <div key={agent.id} className="relative">
                <NavLink 
                  to={`/agent/${agent.id}`} 
                  className={({ isActive }) => 
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <div className="w-5 h-5" style={{ color: agent.color }}>
                    {getIconComponent(agent.icon)}
                  </div>
                  <span>{agent.name}</span>
                  <span
                    className="ml-auto pl-2 text-neutral-400 cursor-pointer"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuAgentId(openMenuAgentId === agent.id ? null : agent.id);
                    }}
                  >⋯</span>
                </NavLink>
                {renderAgentMenu(agent.id)}
              </div>
            ))}
            {/* Agentes de negocio adicionales como ítems normales, con puntitos y usando los mismos íconos que los otros */}
            {[
              { id: 'agent-accounting', name: 'Agent - Accounting', icon: 'Brain', color: '#16a34a' },      // emerald-600
              { id: 'agent-bankaccount', name: 'Agent - Bank Account', icon: 'Database', color: '#22c55e' }, // green-500
              { id: 'agent-insurance', name: 'Agent - Insurance', icon: 'Layers', color: '#4ade80' },        // green-400
              { id: 'agent-customerservice', name: 'Agent - Customer Service', icon: 'Search', color: '#10b981' }, // emerald-500
              { id: 'agent-sales', name: 'Agent - Sales', icon: 'Brain', color: '#059669' },                 // emerald-700
              { id: 'agent-procurement', name: 'Agent - Procurement', icon: 'Layers', color: '#65a30d' }     // lime-600
            ].map(agent => (
              <div key={agent.id} className="relative">
                <NavLink 
                  to={`/agent/${agent.id}`}
                  className={({ isActive }) => 
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <div className="w-5 h-5 flex items-center justify-center" style={{ color: agent.color }}>
                    {getIconComponent(agent.icon)}
                  </div>
                  <span>{agent.name}</span>
                  <span
                    className="ml-auto pl-2 text-neutral-400 cursor-pointer"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuAgentId(openMenuAgentId === agent.id ? null : agent.id);
                    }}
                  >⋯</span>
                </NavLink>
                {renderAgentMenu(agent.id)}
              </div>
            ))}
          </>
        )}

        {currentAgent && (
          <>
            <div className="mt-2 mb-1 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Active Agent
            </div>
            <div className="relative">
              <NavLink 
                to={`/agent/${currentAgent.id}`} 
                className="sidebar-item active"
              >
                <div className="w-5 h-5" style={{ color: currentAgent.color }}>
                  {getIconComponent(currentAgent.icon)}
                </div>
                <span>{currentAgent.name}</span>
                <span
                  className="ml-auto pl-2 text-neutral-400 cursor-pointer"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuAgentId(openMenuAgentId === currentAgent.id ? null : currentAgent.id);
                  }}
                >⋯</span>
              </NavLink>
              {renderAgentMenu(currentAgent.id)}
            </div>
          </>
        )}
        

        <div className="mt-auto">
          {/* Backgrounds button */}
          <div className="relative">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-100 text-left"
              onClick={() => setShowBackgroundMenu(v => !v)}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {/* Blanco y negro: SVG simple de imagen */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="#222" strokeWidth="1.5" fill="white"/>
                  <circle cx="6.5" cy="8" r="1.5" fill="#222" />
                  <path d="M2 14l4.5-4.5c.4-.4 1-.4 1.4 0L13 14" stroke="#222" strokeWidth="1.5" fill="none"/>
                  <path d="M11 12l2-2c.4-.4 1-.4 1.4 0L18 14" stroke="#222" strokeWidth="1.5" fill="none"/>
                </svg>
              </span>
              <span className="text-neutral-500">Backgrounds</span>
              <ChevronDown className="w-4 h-4 ml-auto text-neutral-500" />
            </button>
            {showBackgroundMenu && (
              <div className="absolute left-0 right-0 bottom-12 z-50 bg-white border rounded shadow-lg p-2">
                <div className="font-semibold text-xs text-neutral-500 mb-2 px-2">Choose a background</div>
                <ul>
                  {backgrounds.map(bg => (
                    <li
                      key={bg.name}
                      className="px-4 py-2 hover:bg-neutral-100 rounded cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        setSelectedBackground(bg);
                        setShowBackgroundMenu(false);
                      }}
                    >
                      {/* {bg.img && <img src={bg.img} alt={bg.name} className="w-6 h-6 rounded object-cover" />} */}
                      <span>{bg.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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

