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
  
  // Default selected date to today (local timezone safe)
  const [selectedDate, setSelectedDate] = useState(() => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
  });

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
      <div className="calendar-header-compact">
        <div className="calendar-nav-bar">
          <button className="nav-arrow-btn" onClick={handlePrevMonth}>※</button>
          <div className="nav-current-month">{monthName} {year}</div>
          <button className="nav-arrow-btn" onClick={handleNextMonth}>⁜</button>
          <button className="nav-today-btn" onClick={() => setCurrentDate(new Date())}>HOY</button>
        </div>
      </div>

      {viewType === 'grid' ? (
        <div className="calendar-split-layout">
          <div className="calendar-main-col">
            <CalendarGrid 
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              events={events} 
              tasks={tasks} 
            />
          </div>
          
          <div className="calendar-side-panel">
            <div className="side-panel-header">
              <div>
                <h3 className="side-panel-dayname">DOMINGO</h3>
                <span className="side-panel-date">
                  <span className="date-number">{selectedDate.split('-')[2]}</span> ABRIL 2026
                </span>
              </div>
              <button 
                className="side-panel-header-add"
                onClick={() => onAddEventClick(selectedDate)}
              >
                + AGREGAR
              </button>
            </div>
            
            <div className="side-panel-content">
              {(() => {
                const dayEvents = events.filter(e => e.targetDate === selectedDate);
                
                return (
                  <>
                    <h4 className="side-panel-subtitle">📋 ACTIVIDADES DEL DÍA ({dayEvents.length})</h4>
                    
                    {dayEvents.length === 0 ? (
                      <div className="side-panel-empty">
                        <p>Toca un día del calendario para ver sus actividades</p>
                      </div>
                    ) : (
                      <div className="side-panel-events-list">
                        {dayEvents.map(event => {
                          const isCompleted = event.status === 'completado';
                          return (
                            <div key={event.id} className={`side-event-strip priority-${event.priority} ${isCompleted ? 'completed' : ''}`}>
                              
                              <div className="strip-time">
                                {event.targetTime || '12:00 PM'}
                              </div>
                              
                              <div className="strip-content">
                                <h5>{event.title}</h5>
                                {event.description && <p>{event.description}</p>}
                              </div>
                              
                              <div className="strip-priority">
                                {event.priority === 'alta' ? 'ALTA' : (event.priority === 'media' ? 'MEDIA' : 'BAJA')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
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
