import React, { useState } from 'react';

const TaskModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="¿QUÉ VAS A HACER?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="modal-actions" style={{ marginTop: '3rem' }}>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-btn">+ Añadir Tarea</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
