import React from 'react';
import { useParams } from 'react-router-dom';
import { getAgentById } from '../data/agents';
import AgentHeader from '../components/AgentHeader';
import ChatInterface from '../components/ChatInterface';

const AgentPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const agent = getAgentById(agentId || '');

  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Agent Not Found</h2>
          <p className="text-neutral-600">The agent you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: agent.color + '05' }}>
      <AgentHeader agent={agent} />
      <div className="flex-1 overflow-hidden">
        <ChatInterface agentId={agent.id} />
      </div>
    </div>
  );
};

export default AgentPage;