import React from 'react';
import './WeeklyBoard.css';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyBoard = ({ tasks }) => {
  const getPriorityColor = (priority) => {
    if (priority === 'alta') return 'var(--color-priority-high)';
    if (priority === 'media') return 'var(--color-priority-medium)';
    return 'var(--color-priority-low)';
  };

  return (
    <div className="weekly-board-container">
      {daysOfWeek.map(day => {
        const dayTasks = tasks.filter(t => t.day === day);
        const completedCount = dayTasks.filter(t => t.status === 'completed').length;
        const totalCount = dayTasks.length;
        const isAllCompleted = totalCount > 0 && completedCount === totalCount;
        
        return (
          <div 
            key={day} 
            className={`weekly-day-column ${isAllCompleted ? 'completed' : ''}`}
          >
            <div className="weekly-day-header">
              <span>{day}</span>
              {totalCount > 0 && (
                <span className="day-stats-badge">
                  {completedCount}/{totalCount}
                </span>
              )}
            </div>
            
            <div className="weekly-tasks-list">
              {dayTasks.length === 0 ? (
                <div style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8rem' }}>Sin tareas</div>
              ) : (
                dayTasks.map(t => (
                  <div 
                    key={t.id} 
                    className={`weekly-task-item ${t.status === 'completed' ? 'completed' : ''}`}
                    style={{ borderLeftColor: getPriorityColor(t.priority) }}
                  >
                    {t.title}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyBoard;
