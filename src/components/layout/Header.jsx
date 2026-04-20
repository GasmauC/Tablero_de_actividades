import React from 'react';
import ActionButton from '../ui/ActionButton';
import { useGamification } from '../../hooks/useGamification';
import './Header.css';

const Header = ({ 
  title, 
  onNewTaskClick, 
  tasks = [], 
  currentView, 
  setCurrentView,
  onHistoryClick
}) => {
  const { streak, percentage, completed, total, message } = useGamification(tasks);

  return (
    <header className="app-header">
      <div className="header-info-container">
        <div className="header-title-section">
          <h1 className="day-title" style={currentView === 'calendar' ? { color: '#00ffff' } : {}}>
            {title}
          </h1>
          {currentView === 'day' && total > 0 && (
            <div className="gamification-status">
              <span className="streak-badge">RACHA: {streak} DÍAS 🔥</span>
              <span className="progress-message">{message}</span>
            </div>
          )}
        </div>

        {currentView === 'day' && total > 0 && (
          <div className="progress-container-global">
            <div className="progress-text">
              PROGRESO DEL DÍA: {completed}/{total} ({percentage}%)
            </div>
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${percentage}%`,
                  background: percentage === 100 ? 'var(--color-completed)' : (percentage > 50 ? 'var(--color-progress)' : 'white')
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="header-actions">
        <ActionButton 
          onClick={() => setCurrentView('day')} 
          variant={currentView === 'day' ? 'primary' : 'secondary'}
          className={currentView === 'calendar' ? 'btn-calendar-toggle btn-inactive' : ''}
        >
          ☀️ DÍA
        </ActionButton>
        <ActionButton 
          onClick={() => setCurrentView('week')} 
          variant={currentView === 'week' ? 'primary' : 'secondary'}
          className={currentView === 'calendar' ? 'btn-calendar-toggle btn-inactive' : ''}
        >
          🗓️ SEMANA
        </ActionButton>
        <ActionButton 
          onClick={() => setCurrentView('calendar')} 
          variant={currentView === 'calendar' ? 'primary' : 'secondary'}
          className={currentView === 'calendar' ? 'btn-calendar-toggle btn-active-magenta' : ''}
        >
          📅 MES
        </ActionButton>
        {(currentView === 'day' || currentView === 'calendar') && (
          <ActionButton 
            onClick={currentView === 'calendar' ? () => setCurrentView('calendar_new') : onNewTaskClick} 
            variant="primary" 
            className={`header-main-btn ${currentView === 'calendar' ? 'btn-main-event' : ''}`}
          >
            {currentView === 'calendar' ? '+ NUEVO EVENTO' : '+ NUEVA TAREA'}
          </ActionButton>
        )}
      </div>
    </header>
  );
};

export default Header;
