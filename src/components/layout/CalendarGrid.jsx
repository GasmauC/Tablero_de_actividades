import React from 'react';
import './CalendarGrid.css';

const daysNamesMap = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado'
};

const CalendarGrid = ({ events = [], tasks = [], onAddEventClick, onEditEventClick, onDeleteEvent }) => {
  // Obtener los días de la semana actual (empezando por Lunes)
  const getWeekDays = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que empiece en Lunes
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.setDate(diff + i));
      week.push(date);
    }
    return week;
  };

  const weekDays = getWeekDays();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="calendar-grid-wrapper">
      <div className="calendar-grid">
        {weekDays.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayName = daysNamesMap[date.getDay()];
          const isToday = dateStr === todayStr;

          // Filtrar eventos para este día
          const dayEvents = events.filter(e => e.targetDate === dateStr);

          // Filtrar tareas para este día de la semana (Lunes, Martes...)
          const dayTasks = tasks.filter(t => t.day === dayName);
          const totalTasks = dayTasks.length;
          const completedTasks = dayTasks.filter(t => t.status === 'completada').length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <div 
              key={dateStr} 
              className={`calendar-grid-cell ${isToday ? 'today' : ''}`}
              onClick={() => onAddEventClick(dateStr)}
            >
              <div className="cell-header">
                <span className="day-name">{dayName.substring(0, 3)}</span>
                <span className="day-number">{date.getDate()}</span>
              </div>

              <div className="cell-events">
                {dayEvents.map(event => {
                  const handleDeleteMiniEvent = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.confirm('¿Eliminar evento?')) {
                      onDeleteEvent(event.id);
                    }
                  };

                  return (
                    <div 
                      key={String(event.id)} 
                      className={`mini-event-card priority-${event.priority}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEventClick(event);
                      }}
                      title={event.title}
                    >
                      <span className="mini-event-title">{event.title}</span>
                      <button 
                        className="mini-event-delete-btn"
                        title="Eliminar evento"
                        onClick={handleDeleteMiniEvent}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="cell-tasks-summary">
                <div className="task-progress-bar">
                  <div 
                    className="task-progress-fill" 
                    style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#00ff00' : '#fff' }}
                  ></div>
                </div>
                <div className="task-count-text">
                  {completedTasks}/{totalTasks} TAREAS
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
