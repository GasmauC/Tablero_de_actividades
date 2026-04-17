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
      <div className="task-form-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="form-group">
          <label>PRIORIDAD</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="form-group">
          <label>ETIQUETA</label>
          <select value={tag} onChange={e => setTag(e.target.value)}>
            <option value="">Ninguna</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Estudio">Estudio</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-save">
          {initialData ? 'Guardar Cambios' : '+ Añadir Tarea'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

