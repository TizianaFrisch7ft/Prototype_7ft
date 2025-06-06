import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  filename: string;
  onClose: () => void;
}

const PromptEditorBox: React.FC<Props> = ({ filename, onClose }) => {
  const [system, setSystem] = useState('');
  const [template, setTemplate] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/prompts/${filename}`)
      .then(res => {
        const data = res.data as { system?: string; template?: string };
        setSystem(data.system || '');
        setTemplate(data.template || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error cargando prompt:', err);
        setLoading(false);
      });
  }, [filename]);

  const handleSave = async () => {
    try {
      await axios.put(`/api/prompts/${filename}`, {
        system,
        template
      });
      setEditMode(false);
      alert('✅ Prompt actualizado');
    } catch (err) {
      console.error('❌ Error al guardar:', err);
      alert('❌ Error al guardar');
    }
  };

  if (loading) return <div className="p-2 text-sm">Cargando prompt...</div>;

  return (
    <div className="relative bg-white border border-neutral-200 rounded-xl shadow-2xl p-6 w-[640px] max-w-[90vw]">
      {/* ❌ Cerrar */}
      <button
        className="absolute top-3 right-4 text-neutral-400 hover:text-neutral-700 text-xl"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>

      <div className="text-lg font-semibold mb-4">🧠 System Prompt:</div>
      
      {editMode ? (
        <textarea
          value={system}
          onChange={e => setSystem(e.target.value)}
          className="w-full p-2 border border-neutral-300 rounded font-mono text-sm resize-y"
          rows={10}
        />
      ) : (
        <pre className="w-full p-3 bg-white border border-neutral-300 rounded font-mono text-sm whitespace-pre-wrap min-h-[160px]">
          {system}
        </pre>
      )}

      <div className="text-xs italic text-neutral-500 mt-3 mb-4">
        ⚠️ El template no puede ser modificado desde esta interfaz.
      </div>

      <div className="flex justify-end gap-3">
        {editMode ? (
          <>
           <button
            onClick={handleSave}
            className="bg-green-600 text-white !text-white px-4 py-1 rounded hover:bg-green-700"
            >
            Guardar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Modificar
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptEditorBox;
