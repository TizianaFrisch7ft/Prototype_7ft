import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import { Send, Database, Upload, Link as LinkIcon } from 'lucide-react';

interface ChatInterfaceProps {
  agentId: string;
  open?: boolean;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps & { style?: React.CSSProperties }> = ({ agentId, open = true, onClose, style }) => {
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
  const [dbName, setDbName] = useState(agentId === 'agent-expensesauditor' ? 'expenses' : 'agent_mongo');
  const [docId, setDocId] = useState<string | null>(null); // será rulesId para auditor
  const [sources, setSources] = useState<string[]>([]);
  const [showSources, setShowSources] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [storedUrl, setStoredUrl] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

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

  // Nuevo: para el input de URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    if (agentId === 'agent-web' && (urlValue.trim() === '' && !storedUrl)) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: agentId === 'agent-web'
        ? `URL: ${storedUrl || urlValue}\nPregunta: ${inputValue}`
        : inputValue,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    if (agentId === 'agent-web' && !storedUrl) setUrlValue('');

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
      } else if (agentId === 'agent-web') {
        const currentUrl = storedUrl || urlValue;
        res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/webpage/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentUrl, question: inputValue })
        });
        if (!storedUrl) {
          setStoredUrl(urlValue); // guardo la URL para siguientes preguntas
        }
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

  // Nuevo: enviar la URL por separado
  const handleSendUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlValue.trim()) return;
    setStoredUrl(urlValue);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: `🌐 URL cargada: ${urlValue}`,
        isUser: true,
        timestamp: new Date()
      }
    ]);
    setUrlValue('');
    setShowUrlInput(false);
  };

  if (!open) return null;

  return (
    <div
      // Cambia maxWidth y height para que nunca sea "grande"
      className="fixed bottom-6 z-50 shadow-2xl bg-white border border-neutral-200 flex flex-col rounded-2xl"
      style={{
        width: '420px',
        maxWidth: '98vw',
        height: '520px',
        maxHeight: '90vh',
        minWidth: '320px',
        minHeight: '320px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        right: 24,
        ...style
      }}
    >
      {/* Header con botón de cerrar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 rounded-t-2xl bg-neutral-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
            {agentId[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm text-primary-800">{agentId.replace(/^agent-/, '').replace(/^\w/, c => c.toUpperCase())}</div>
            <div className="text-xs text-neutral-500">AI Agent</div>
          </div>
        </div>
        {onClose && (
          <button
            className="ml-2 p-2 rounded-full hover:bg-neutral-200"
            onClick={onClose}
            title="Cerrar chat"
          >
            ✖
          </button>
        )}
      </div>

      <div className="flex-1 bg-white overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-neutral-200 p-4 bg-white rounded-b-2xl">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2 relative">
          <div className="flex gap-2 items-center">
            {agentId === 'agent-web' && (
              <button
                type="button"
                className={`p-2 rounded-full hover:bg-neutral-200 transition-colors ${showUrlInput ? 'bg-primary-100' : ''}`}
                onClick={() => setShowUrlInput(v => !v)}
                title="Cargar URL"
                tabIndex={-1}
              >
                <LinkIcon className="w-5 h-5 text-primary-700" />
              </button>
            )}
            {(agentId === 'agent-bd' || agentId === 'agent-expensesauditor') && (
              <>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
                  onClick={() => setShowDbForm(v => !v)}
                  tabIndex={-1}
                >
                  <Database className="w-5 h-5 text-primary-700" />
                </button>
                {showDbForm && (
                  <div className="absolute bottom-28 right-0 left-0 mx-auto w-[90%] max-w-[380px] z-50 bg-white border border-primary-200 rounded-xl shadow-lg p-4 flex flex-col gap-2">
                    <label className="text-xs font-semibold text-primary-700 mb-1">Conectar a la base de datos</label>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleDbConnect();
                      }}
                      className="flex flex-col gap-2"
                    >
                      {agentId === 'agent-bd' && (
                        <input
                          type="text"
                          value={dbType}
                          onChange={e => setDbType(e.target.value)}
                          placeholder="Tipo de base de datos"
                          className="input-field"
                        />
                      )}
                      <input
                        type="text"
                        value={dbUser}
                        onChange={e => setDbUser(e.target.value)}
                        placeholder="Usuario"
                        className="input-field"
                      />
                      <input
                        type="password"
                        value={dbPassword}
                        onChange={e => setDbPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={dbName}
                        onChange={e => setDbName(e.target.value)}
                        placeholder="Nombre de la base de datos"
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={cluster}
                        onChange={e => setCluster(e.target.value)}
                        placeholder="Cluster"
                        className="input-field"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          className="text-xs text-neutral-500 hover:underline"
                          onClick={() => setShowDbForm(false)}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                        >
                          Conectar
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
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
            {/* Elimina el botón de modal de URL para agent-web */}
            {/* Input de mensaje */}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="input-field flex-1"
              disabled={
                (agentId === 'agent-bd' && !dbConnected) ||
                (agentId === 'agent-expensesauditor' && (!dbConnected || !docId)) ||
                (agentId === 'agent-web' && !storedUrl)
              }
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              disabled={
                inputValue.trim() === '' ||
                (agentId === 'agent-bd' && !dbConnected) ||
                (agentId === 'agent-expensesauditor' && (!dbConnected || !docId)) ||
                (agentId === 'agent-web' && !storedUrl)
              }
            >
              <Send className="w-4 h-4" color="white" />
            </button>
          </div>
          {/* Modal de URL solo si showUrlInput */}
          {agentId === 'agent-web' && showUrlInput && (
            <div className="absolute bottom-28 right-0 left-0 mx-auto w-[90%] max-w-[380px] z-50 bg-white border border-primary-200 rounded-xl shadow-lg p-4 flex flex-col gap-2">
              <label className="text-xs font-semibold text-primary-700 mb-1">Cargar URL para analizar</label>
              <form onSubmit={handleSendUrl} className="flex gap-2">
                <input
                  type="text"
                  value={urlValue}
                  onChange={handleUrlChange}
                  placeholder="Ingrese la URL (ej: https://...)"
                  className="input-field flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  disabled={!urlValue.trim()}
                  title="Enviar URL"
                >
                  <Send className="w-4 h-4" color="white" />
                </button>
              </form>
              <button
                type="button"
                className="text-xs text-neutral-500 hover:underline mt-1 self-end"
                onClick={() => setShowUrlInput(false)}
              >
                Cancelar
              </button>
            </div>
          )}
          {/* Connected debajo del input de mensaje */}
          {agentId === 'agent-web' && storedUrl && (
            <div className="text-green-700 text-xs mb-2 ml-1">Connected</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
