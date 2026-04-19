import React, { useState } from 'react';
import ActionButton from '../ui/ActionButton';
import CalendarGrid from './CalendarGrid';
import './CalendarView.css';

const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

const CalendarView = ({ 
  events, 
  tasks, 
  onAddEventClick, 
  onEditEventClick, 
  onDeleteEvent 
}) => {
  const [viewType, setViewType] = useState('grid');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const monthName = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="calendar-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>{monthName} {year}</h2>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="view-toggle-btn active" onClick={handlePrevMonth}>{'<'}</button>
              <button className="view-toggle-btn active" onClick={() => setCurrentDate(new Date())}>HOY</button>
              <button className="view-toggle-btn active" onClick={handleNextMonth}>{'>'}</button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button 
              className={`view-toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
              onClick={() => setViewType('grid')}
            >
              📅 MES
            </button>
            <button 
              className={`view-toggle-btn ${viewType === 'list' ? 'active' : ''}`}
              onClick={() => setViewType('list')}
            >
              📜 AGENDA
            </button>
          </div>
        </div>
      </div>

      {viewType === 'grid' ? (
        <CalendarGrid 
          currentDate={currentDate}
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
