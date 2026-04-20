import React from 'react';
import { getLocalDateStr } from '../../utils/date';
import './WeeklyBoard.css';

const WeeklyBoard = ({ tasks, currentDateStr }) => {
  const getPriorityColor = (priority) => {
    if (priority === 'alta') return 'var(--color-priority-high)';
    if (priority === 'media') return 'var(--color-priority-medium)';
    return 'var(--color-priority-low)';
  };

  const parseDate = (d) => {
    const [y, m, day] = d.split('-');
    return new Date(y, m - 1, day);
  };
  
  const current = parseDate(currentDateStr);
  const dayOfWeek = current.getDay(); 
  
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayOfThisWeek = new Date(current);
  mondayOfThisWeek.setDate(current.getDate() + diffToMonday);
  
  const weekDays = [];
  const dayNames = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayOfThisWeek);
    d.setDate(mondayOfThisWeek.getDate() + i);
    const dStr = getLocalDateStr(d);
    weekDays.push({
      dateStr: dStr,
      label: dayNames[i]
    });
  }

  return (
    <div className="weekly-board-container">
      {weekDays.map(dayObj => {
        const dayTasks = tasks.filter(t => t.targetDate === dayObj.dateStr);
        const completedCount = dayTasks.filter(t => t.status === 'completed' || t.status === 'completado').length;
        const totalCount = dayTasks.length;
        const isAllCompleted = totalCount > 0 && completedCount === totalCount;
        
        return (
          <div 
            key={dayObj.dateStr} 
            className={`weekly-day-column ${isAllCompleted ? 'completed' : ''}`}
          >
            <div className="weekly-day-header">
              <span>{dayObj.label}</span>
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
                    className={`weekly-task-item ${t.status === 'completed' || t.status === 'completado' ? 'completed' : ''}`}
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
