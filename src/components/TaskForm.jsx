import React, { useState, useEffect } from 'react';
import ActionButton from './ui/ActionButton';
import './TaskForm.css';

const TaskForm = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baja');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'baja');
      setTag(initialData.tag || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('baja');
      setTag('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ 
        title: title.trim(), 
        description: description.trim(),
        priority,
        tag: tag || 'Ninguna'
      });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="task-form-input"
        type="text"
        placeholder="¿QUÉ VAS A HACER?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className="task-form-textarea"
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="task-form-meta" style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#fff', fontSize: '1.2rem', gap: '0.5rem' }}>
          Prioridad
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '0.5rem', background: '#222', color: '#fff', border: '2px solid #555', fontFamily: 'inherit', fontSize: '1.1rem' }}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', color: '#fff', fontSize: '1.2rem', gap: '0.5rem' }}>
          Etiqueta
          <select value={tag} onChange={e => setTag(e.target.value)} style={{ padding: '0.5rem', background: '#222', color: '#fff', border: '2px solid #555', fontFamily: 'inherit', fontSize: '1.1rem' }}>
            <option value="">Ninguna</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Estudio">Estudio</option>
            <option value="Personal">Personal</option>
          </select>
        </label>
      </div>
      <div className="task-form-actions">
        <ActionButton onClick={onCancel} variant="secondary">
          Cancelar
        </ActionButton>
        <ActionButton type="submit" variant="primary">
          {initialData ? 'Guardar Cambios' : '+ Añadir Tarea'}
        </ActionButton>
      </div>
    </form>
  );
};

export default TaskForm;

