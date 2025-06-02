export interface Company {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}