import React from 'react';
import ActionButton from '../ui/ActionButton';
import './Header.css';

const Header = ({ 
  title, 
  onNewTaskClick, 
  tasks = [], 
  isWeeklyView, 
  toggleWeeklyView,
  onHistoryClick
}) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
      <div style={{ flex: 1, minWidth: '250px' }}>
        <h1 className="day-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: 0 }}>
          {title}
          {total > 0 && !isWeeklyView && (
            <span style={{ fontSize: '1.2rem', padding: '0.2rem 0.5rem', background: percentage === 100 ? 'var(--color-completed)' : '#222', color: percentage === 100 ? '#000' : '#fff', border: '2px solid #000' }}>
              {completed}/{total}
            </span>
          )}
        </h1>
        {total > 0 && !isWeeklyView && (
          <div style={{ height: '12px', background: '#222', width: '100%', maxWidth: '300px', marginTop: '0.8rem', border: '2px solid #000' }}>
            <div style={{ height: '100%', width: `${percentage}%`, background: percentage === 100 ? 'var(--color-completed)' : '#fff', transition: 'width 0.3s ease' }}></div>
          </div>
        )}
      </div>
      
      <div className="header-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <ActionButton onClick={toggleWeeklyView} variant="secondary">
          {isWeeklyView ? '📅 VISTA DÍA' : '🗂️ VISTA SEMANA'}
        </ActionButton>
        <ActionButton onClick={onHistoryClick} variant="secondary">
          🕒 HISTORIAL
        </ActionButton>
        {!isWeeklyView && (
          <ActionButton onClick={onNewTaskClick} variant="primary" className="new-task-btn">
            + NUEVA TAREA
          </ActionButton>
        )}
      </div>
    </header>
  );
};

export default Header;
