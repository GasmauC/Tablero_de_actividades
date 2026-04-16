import React from 'react';
import StatusBadge from '../ui/StatusBadge';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyBoard = ({ tasks }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
      {daysOfWeek.map(day => {
        const dayTasks = tasks.filter(t => t.day === day);
        const completed = dayTasks.filter(t => t.status === 'completed').length;
        const total = dayTasks.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return (
          <div key={day} style={{ border: '4px solid #000', padding: '1rem', background: percent === 100 && total > 0 ? 'var(--color-completed)' : '#222', color: percent === 100 && total > 0 ? '#000' : '#fff' }}>
            <h2 style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.5rem' }}>
              {day}
              {total > 0 && <span style={{ fontSize: '1rem', background: '#000', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{completed}/{total}</span>}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dayTasks.length === 0 ? (
                <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Sin tareas</div>
              ) : (
                dayTasks.map(t => (
                  <div key={t.id} style={{ padding: '0.5rem', background: t.status === 'completed' ? 'rgba(255,255,255,0.2)' : '#000', color: t.status === 'completed' ? 'inherit' : '#fff', textDecoration: t.status === 'completed' ? 'line-through' : 'none', borderLeft: `6px solid ${getPriorityColor(t.priority)}` }}>
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

function getPriorityColor(priority) {
  if (priority === 'alta') return '#ff3333';
  if (priority === 'media') return '#ffaa00';
  return '#444';
}

export default WeeklyBoard;
