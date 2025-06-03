import { AgentType } from '../types';

export const agents: AgentType[] = [
  {
    id: 'agent-bd',
    name: 'Agent-DB',
    description: 'Database intelligent agent for structured data analysis',
    icon: 'Database',
    color: '#10B981'
  },
  {
    id: 'agent-documents',
    name: 'Agent-Documents',
    description: 'Document processing and analysis capabilities',
    icon: 'Brain',
    color: '#065F46'
  },
  {
    id: 'agent-vectorize',
    name: 'Agent-RAG',
    description: 'Advanced vector processing for complex data representation',
    icon: 'Layers',
    color: '#059669'
  },
  {
    id: 'agent-websearch',
    name: 'Agent-WebSearch',
    description: 'Intelligent web search capabilities for information retrieval',
    icon: 'Search',
    color: '#047857'
  }, 
  {
    id: 'agent-expensesauditor',
    name: 'Agent-ExpenseAuditor',
    description: 'Expense auditing and financial data analysis',
    icon: 'Brain',
    color: '#047857'
 }
];

export const getAgentById = (id: string): AgentType | undefined => {
  return agents.find(agent => agent.id === id);
};
