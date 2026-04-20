import React, { useState, useEffect, useRef } from 'react';
import { getLocalDateStr } from '../utils/date';
import './TaskForm.css'; // Reusing TaskForm styles as much as possible

const EventForm = ({ onSave, onCancel, initialData, preselectedDate }) => {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [status, setStatus] = useState('pendiente');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [repeatDaily, setRepeatDaily] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTargetDate(initialData.targetDate || '');
      setTargetTime(initialData.targetTime || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'media');
      setStatus(initialData.status || 'pendiente');
      setRemindersEnabled(initialData.reminder?.enabled ?? true);
      setRepeatDaily(initialData.reminder?.repeatDaily ?? true);
    } else {
      const defaultDate = preselectedDate || getLocalDateStr();
      setTargetDate(defaultDate);
    }
  }, [initialData, preselectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) {
      alert('TÍTULO Y FECHA SON OBLIGATORIOS');
      return;
    }

    setIsSaving(true);

    // Pequeño delay artificial para feedback visual de "procesando"
    timeoutRef.current = setTimeout(() => {
      onSave({
        title: title.trim(),
        targetDate,
        targetTime,
        description: description.trim(),
        priority,
        status,
        reminder: {
          enabled: remindersEnabled,
          repeatDaily: repeatDaily,
          daysBefore: 7
        }
      });
      setShowSuccess(true);
      setIsSaving(false);
    }, 600);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <header className="form-header" style={{ marginBottom: '1.5rem' }}>
        <h2 className="form-title" style={{ margin: 0 }}>
          {initialData ? '✎ Editar actividad' : '✦ Nuevo Evento'}
        </h2>
      </header>
      
      <section className="form-section">
        <div className="form-group">
          <label>NOMBRE DEL EVENTO</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Qué está pasando?"
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>FECHA LÍMITE</label>
            <input 
              type="date" 
              value={targetDate} 
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>HORA EXACTA</label>
            <input 
              type="time" 
              value={targetTime} 
              onChange={(e) => setTargetTime(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="form-group">
        <label>NOTAS Y DETALLES</label>
        <textarea 
          className="task-form-textarea"
          style={{ marginTop: 0 }}
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Añade contexto o requisitos..."
          rows="3"
        />
      </div>
      
      {initialData && (
        <div className="form-group">
          <label>ESTADO ACTUAL</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
      )}

      <div className="form-group">
        <label>NIVEL DE URGENCIA</label>
        <div className="priority-selectors" style={{ gap: '0.8rem' }}>
          <button 
            type="button"
            className={`priority-btn baja ${priority === 'baja' ? 'selected' : ''}`}
            onClick={() => setPriority('baja')}
          >
            BAJA
          </button>
          <button 
            type="button"
            className={`priority-btn media ${priority === 'media' ? 'selected' : ''}`}
            onClick={() => setPriority('media')}
          >
            MEDIA
          </button>
          <button 
            type="button"
            className={`priority-btn alta ${priority === 'alta' ? 'selected' : ''}`}
            onClick={() => setPriority('alta')}
          >
            ALTA
          </button>
        </div>
      </div>

      <div className="form-group" style={{ 
        marginTop: '1.5rem', 
        border: '1px solid rgba(255, 255, 255, 0.05)', 
        borderRadius: 'var(--radius-md)',
        padding: '1.2rem', 
        background: 'rgba(255, 255, 255, 0.01)', 
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontWeight: '800', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
          <input 
            type="checkbox" 
            className="neo-checkbox"
            checked={remindersEnabled} 
            onChange={(e) => setRemindersEnabled(e.target.checked)} 
          />
          SISTEMA DE ALERTA (ZUMBIDO)
        </label>
        
        {remindersEnabled && (
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            cursor: 'pointer', 
            marginTop: '1.25rem', 
            fontSize: '0.85rem',
            paddingLeft: '2.5rem',
            opacity: 0.8,
            fontWeight: '500',
            margin: '1.25rem 0 0 0'
          }}>
            <input 
              type="checkbox" 
              className="neo-checkbox"
              checked={repeatDaily} 
              onChange={(e) => setRepeatDaily(e.target.checked)} 
            />
            REPETIR AVISO DIARIAMENTE (7 DÍAS ANTES)
          </label>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn-cancel" 
          onClick={onCancel}
          disabled={isSaving}
        >
          {showSuccess ? 'CERRAR' : 'CANCELAR'}
        </button>
        <button 
          type="submit" 
          className="btn-save"
          disabled={isSaving || showSuccess}
          style={{ 
            backgroundColor: showSuccess ? 'var(--color-completed)' : (isSaving ? '#666' : 'var(--color-completed)'),
            opacity: isSaving ? 0.7 : 1
          }}
        >
          {showSuccess ? '✓ GUARDADO' : (isSaving ? 'GUARDANDO...' : (initialData ? 'GUARDAR CAMBIOS' : 'CREAR EVENTO'))}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
