import React, { useState } from 'react';
import ActionButton from '../ui/ActionButton';
import CalendarGrid from './CalendarGrid';
import './CalendarView.css';

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CalendarView = ({ 
  events, 
  tasks, 
  onAddEventClick, 
  onEditEventClick, 
  onDeleteEvent 
}) => {
  const [viewType, setViewType] = useState('grid'); // 'list' o 'grid'

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 className="calendar-title">PLANIFICADOR SEMANAL</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`view-toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
              onClick={() => setViewType('grid')}
            >
              📅 REJILLA
            </button>
            <button 
              className={`view-toggle-btn ${viewType === 'list' ? 'active' : ''}`}
              onClick={() => setViewType('list')}
            >
              📜 LISTA
            </button>
          </div>
        </div>
      </div>

      {viewType === 'grid' ? (
        <CalendarGrid 
          events={events} 
          tasks={tasks} 
          onAddEventClick={onAddEventClick}
          onEditEventClick={onEditEventClick}
          onDeleteEvent={onDeleteEvent}
        />
      ) : (
        <div className="events-list">
          {events.length === 0 ? (
            <div className="event-empty-state">
              <p>EL CALENDARIO ESTÁ DESPEJADO.</p>
              <p style={{ fontSize: '1rem', opacity: 0.7 }}>Añade tus exámenes o entregas importantes aquí.</p>
            </div>
          ) : (
            events.map(event => {
              const [year, monthIdx, day] = event.targetDate.split('-');
              const dateObj = new Date(`${event.targetDate}T00:00:00`);
              const today = new Date();
              today.setHours(0,0,0,0);
              
              const isPast = dateObj < today;
              const isCompleted = event.status === 'completado';
              
              const handleDeleteClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm('¿ELIMINAR ESTE EVENTO? Esta acción no se puede deshacer.')) {
                  onDeleteEvent(event.id);
                }
              };

              return (
                <div 
                  key={String(event.id)} 
                  className={`event-card priority-${event.priority} ${isCompleted ? 'completed' : ''}`}
                  style={{ opacity: isPast && !isCompleted ? 0.6 : 1 }}
                >
                  <button 
                    className="event-btn btn-delete-top" 
                    title="Eliminar evento"
                    onClick={handleDeleteClick}
                  >
                    <span className="btn-delete-label">ELIMINAR</span>
                    <span className="btn-delete-icon">🗑️</span>
                  </button>
                  
                  <div className="event-date-box">
                    <span className="event-date-month">{months[parseInt(monthIdx, 10) - 1]}</span>
                    <span className="event-date-day">{day}</span>
                    <span className="event-date-year">{year}</span>
                  </div>
                  
                  <div className="event-content">
                    <div className="event-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <h3 className="event-title">{event.title}</h3>
                          <span className="event-status-label">
                            {event.status}
                          </span>
                        </div>
                        <div className="event-details">
                          {event.targetTime && <span>⏰ {event.targetTime}</span>}
                          <span>🔔 {event.reminder?.enabled ? 'ACTIVO' : 'SILENCIADO'}</span>
                          {isPast && !isCompleted && <span style={{ color: 'var(--color-priority-high)', fontWeight: '900' }}>[VENCIDO]</span>}
                        </div>
                      </div>
                      
                      <div className="event-actions">
                        <button 
                          className="event-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEventClick(event);
                          }} 
                          title="Editar"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                    
                    {event.description && (
                      <div className="event-desc">{event.description}</div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
