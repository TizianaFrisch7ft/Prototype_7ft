import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import { Send, Database, Upload } from 'lucide-react';

interface ChatInterfaceProps {
  agentId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ agentId }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([{
    id: '1',
    content: `Bienvenido al  ${agentId} chat. Como te puedo ayudar hoy?`,
    isUser: false,
    timestamp: new Date()
  }]);

  const [inputValue, setInputValue] = useState('');
  const [showDbForm, setShowDbForm] = useState(false);
  const [dbType, setDbType] = useState('');
  const [dbUser, setDbUser] = useState('tizianafrisch');
  const [dbPassword, setDbPassword] = useState('tizi7ft');
  const [dbConnected, setDbConnected] = useState(false);
  const [cluster, setCluster] = useState('cluster0.deduats.mongodb.net');
  const [dbName, setDbName] = useState('agent_mongo');
  const [docId, setDocId] = useState<string | null>(null); // será rulesId para auditor
  const [sources, setSources] = useState<string[]>([]);
  const [showSources, setShowSources] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      let res;

      if (agentId === 'agent-documents') {
        if (!docId) {
          throw new Error("Primero tenés que subir un PDF.");
        }

        res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/pdf/ask-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docId, question: inputValue })
        });

      } else if (agentId === 'agent-bd') {
        res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/mongo/ask-db`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: inputValue })
        });

      } else if (agentId === 'agent-expensesauditor') {
        if (!docId) throw new Error("Primero tenés que subir un PDF de reglas.");
        if (!dbConnected) throw new Error("Primero tenés que conectarte a la base de datos.");

        res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/audit/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rulesId: docId,
            question: inputValue
          })
        });

      } else if (agentId === 'agent-websearch') {
        res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/web/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: inputValue })
        });
      } else if (agentId === 'agent-vectorize') {
        res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/vector/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: inputValue })
        });
      } else {
        throw new Error("Agente desconocido.");
      }

      const data = await res.json();

      if (agentId === 'agent-websearch' && data.sources) {
        setSources(data.sources);
        setShowSources(false); // mostrar botón, pero NO mostrar fuentes aún
      }

      const agentMessage: ChatMessageType = {
        id: Date.now().toString(),
        content: data.answer || "🤖 No se pudo generar una respuesta.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `❌ Error: ${err instanceof Error ? err.message : "Error desconocido"}`,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  };

    
    const handleDbConnect = async () => {
      setShowDbForm(false);
      try {
        let res;
        if (agentId === 'agent-bd') {
          res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/mongo/connect-db`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dbType,
              dbUser,
              dbPassword,
              dbName,
              cluster
            })
          });
        } else {
          res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/audit/connect-db`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dbUser,
              dbPassword,
              dbName,
              cluster
            })
          });
        }

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error del servidor: ${res.status} - ${errorText}`);
        }

        const data = await res.json();

        if (data.success) {
          setDbConnected(true);

          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: `✅ Connected to DB as ${dbUser}. You can now ask questions about this database.`,
            isUser: false,
            timestamp: new Date()
          }]);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        setDbConnected(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: `❌ Connection error: ${error}`,
          isUser: false,
          timestamp: new Date()
        }]);
      }
    };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);

      try {
        let res, data;
        if (agentId === 'agent-expensesauditor') {
          res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/audit/upload-rules`, {
            method: "POST",
            body: formData
          });
          data = await res.json();
          if (res.ok) {
            setDocId(data.rulesId);
            setMessages(prev => [
              ...prev,
              {
                id: Date.now().toString(),
                content: `📄 Archivo de reglas "${file.name}" cargado correctamente. Ahora podés hacer preguntas.`,
                isUser: false,
                timestamp: new Date()
              }
            ]);
          } else {
            throw new Error(data.error || "Error desconocido al subir PDF de reglas");
          }
        } else {
          res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/pdf/upload-pdf`, {
            method: "POST",
            body: formData
          });
          data = await res.json();
          if (res.ok) {
            setDocId(data.docId);
            setMessages(prev => [
              ...prev,
              {
                id: Date.now().toString(),
                content: `📄 Archivo "${file.name}" cargado correctamente. Ahora podés hacer preguntas.`,
                isUser: false,
                timestamp: new Date()
              }
            ]);
          } else {
            throw new Error(data.error || "Error desconocido al subir PDF");
          }
        }
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            content: `❌ Error al subir el archivo: ${err instanceof Error ? err.message : "desconocido"}`,
            isUser: false,
            timestamp: new Date()
          }
        ]);
      }
    }
  };



    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-neutral-200 p-4 bg-white">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2">
            {(agentId === 'agent-bd' || agentId === 'agent-expensesauditor') && showDbForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-neutral-100 p-4 rounded-xl border border-neutral-200 shadow-sm">
                {agentId === 'agent-bd' && (
                  <select
                    className="border border-neutral-300 rounded px-3 py-2 w-full"
                    value={dbType}
                    onChange={e => setDbType(e.target.value)}
                  >
                    <option value="" disabled>Choose DB</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="postgres">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="sqlite">SQLite</option>
                    <option value="azure">Azure SQL</option>
                  </select>
                )}

                <input
                  type="text"
                  placeholder="User"
                  className="border border-neutral-300 rounded px-3 py-2 w-full"
                  value={dbUser}
                  onChange={e => setDbUser(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border border-neutral-300 rounded px-3 py-2 w-full"
                  value={dbPassword}
                  onChange={e => setDbPassword(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Cluster (e.g. cluster0.mongodb.net)"
                  className="border border-neutral-300 rounded px-3 py-2 w-full"
                  value={cluster}
                  onChange={e => setCluster(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="DB Name"
                  className="border border-neutral-300 rounded px-3 py-2 w-full"
                  value={dbName}
                  onChange={e => setDbName(e.target.value)}
                />

                <button
                  type="button"
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 w-full"
                  onClick={handleDbConnect}
                >
                  Connect
                </button>
              </div>
            )}

            {(agentId === 'agent-bd' || agentId === 'agent-expensesauditor') && dbConnected && (
              <div className="text-green-700 text-sm mb-2">
                Connected to <b>{dbName}</b> as <b>{dbUser}</b>
              </div>
            )}

            <div className="relative flex gap-2 items-center">
              {(agentId === 'agent-bd' || agentId === 'agent-expensesauditor') && (
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
                  onClick={() => setShowDbForm(v => !v)}
                  tabIndex={-1}
                >
                  <Database className="w-5 h-5 text-primary-700" />
                </button>
              )}
              {(agentId === 'agent-documents' || agentId === 'agent-expensesauditor') && (
                <>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    tabIndex={-1}
                  >
                    <Upload className="w-5 h-5 text-primary-700" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </>
              )}
              {agentId === 'agent-websearch' && sources.length > 0 && (
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
                    onClick={() => setShowSources(prev => !prev)}
                    title="Ver fuentes"
                  >
                    📚
                  </button>
                  {showSources && (
                    <div
                      className="absolute bottom-12 left-1/2 z-50 w-[340px] max-w-[98vw] p-3 border rounded bg-neutral-50 text-xs text-neutral-700 shadow-lg overflow-x-auto overflow-y-hidden"
                      style={{
                        transform: 'translateX(-50%)',
                        maxHeight: '90px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }}
                    >
                      <p className="font-semibold mb-1">Fuentes:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {sources.map((source, idx) => (
                          <li key={idx} className="truncate">{source}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="input-field flex-1"
                disabled={
                  (agentId === 'agent-bd' && !dbConnected) ||
                  (agentId === 'agent-expensesauditor' && (!dbConnected || !docId))
                }
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                disabled={inputValue.trim() === '' || (agentId === 'agent-bd' && !dbConnected) || (agentId === 'agent-expensesauditor' && (!dbConnected || !docId))}
              >
                <Send className="w-4 h-4 text-primary-700" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default ChatInterface;
