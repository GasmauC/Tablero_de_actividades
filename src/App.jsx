import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import DaySelector from './components/DaySelector';
import Board from './components/layout/Board';
import WeeklyBoard from './components/layout/WeeklyBoard';
import HistoryModal from './components/layout/HistoryModal';
import Modal from './components/ui/Modal';
import AchievementModal from './components/ui/AchievementModal';
import TaskForm from './components/TaskForm';
import CalendarView from './components/layout/CalendarView';
import AlertSystem from './components/ui/AlertSystem';
import EventForm from './components/EventForm';
import './App.css'; 
import { getLocalDateStr } from './utils/date';

import { useDataStore } from './hooks/useDataStore';
import { useGamification } from './hooks/useGamification';

function App() {
  const [currentDateStr, setCurrentDateStr] = useState(() => {
    const saved = localStorage.getItem('tablero-currentDateStr');
    if (saved && saved.match(/^\d{4}-\d{2}-\d{2}$/)) return saved;
    return getLocalDateStr();
  });
  
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('tablero-currentView');
    if (savedView) return savedView;
    return localStorage.getItem('tablero-weeklyView') === 'true' ? 'week' : 'day';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [preselectedDate, setPreselectedDate] = useState(null);

  // Unificando la fecha seleccionada para compartir entre Header y CalendarView
  // We can just use currentDateStr everywhere so clicking around the calendar changes the day view.
  const [globalSelectedDate, setGlobalSelectedDate] = useState(() => {
    return currentDateStr;
  });

  // Keep globalSelectedDate and currentDateStr in sync if desirable, 
  // or let globalSelectedDate represent the calendar selection and currentDateStr represent the day view.
  // We'll keep them separate to not snap the day view every time they explore the calendar.

  useEffect(() => {
    localStorage.setItem('tablero-currentDateStr', currentDateStr);
  }, [currentDateStr]);

  useEffect(() => {
    localStorage.setItem('tablero-currentView', currentView);
  }, [currentView]);

  const {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    changeActivityStatus,
    reorderTasks,
    dismissAlertToday
  } = useDataStore();

  const allTasks = activities.filter(a => a.type === 'tarea');
  const allEvents = activities.filter(a => a.type === 'evento');
  const currentTasks = allTasks.filter(t => t.targetDate === currentDateStr).sort((a, b) => (a.order || 0) - (b.order || 0));

  const { percentage, total, achievementShown, setAchievementAsShown } = useGamification(currentTasks);

  // Trigger Logro Final
  useEffect(() => {
    if (percentage === 100 && total > 0 && !achievementShown && currentView === 'day') {
      setIsAchievementOpen(true);
      setAchievementAsShown();
    }
  }, [percentage, total, achievementShown, currentView, setAchievementAsShown]);

  // Colores Reactivos (Inject variables)
  useEffect(() => {
    const intensity = percentage / 100;
    const body = document.body;
    
    // Cambiar la saturación del fondo y brillo de los bordes según progreso
    body.style.setProperty('--intensity-glow', `${intensity * 20}px`);
    body.style.setProperty('--intensity-opacity', `${0.04 + (intensity * 0.06)}`);
    
    if (percentage === 100) {
      body.classList.add('day-completed-theme');
    } else {
      body.classList.remove('day-completed-theme');
    }
  }, [percentage]);

  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      updateActivity(taskToEdit.id, taskData);
    } else {
      addActivity({ ...taskData, type: 'tarea', status: 'pending', targetDate: currentDateStr });
    }
    closeModal();
  };

  const handleSaveEvent = (eventData) => {
    if (eventToEdit) {
      updateActivity(eventToEdit.id, eventData);
    } else {
      addActivity({ ...eventData, type: 'evento' });
    }
    closeEventModal();
  };

  const openNewTaskModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openNewEventModal = (date = null) => {
    setEventToEdit(null);
    setPreselectedDate(typeof date === 'string' ? date : null);
    setIsEventModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const openEditEventModal = (event) => {
    setEventToEdit(event);
    setPreselectedDate(null);
    setIsEventModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setEventToEdit(null);
    setPreselectedDate(null);
  };

  useEffect(() => {
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      unlocked = true;
      console.log('🚀 SISTEMA DE AUDIO DESBLOQUEADO');
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  const getFormattedHeaderTitle = () => {
    if (currentView === 'week') return "RESUMEN SEMANAL";
    if (currentView === 'calendar') return "CALENDARIO";
    try {
      const parts = currentDateStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
      return `${dayNames[d.getDay()]} ${d.getDate()}`;
    } catch {
      return "DÍA";
    }
  };

  return (
    <div className="app-container" id="vibration-root">
      <AlertSystem events={allEvents} onDismiss={dismissAlertToday} />
      
      <Header 
        title={getFormattedHeaderTitle()} 
        onNewTaskClick={openNewTaskModal} 
        onAddEventClick={() => openNewEventModal(globalSelectedDate || currentDateStr)}
        tasks={currentView === 'week' ? allTasks : currentTasks}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onHistoryClick={() => setIsHistoryModalOpen(true)}
      />
      
      <main className="main-content">
        {currentView === 'day' && (
          <>
            <DaySelector currentDateStr={currentDateStr} setCurrentDateStr={setCurrentDateStr} />
            <Board 
              tasks={currentTasks} 
              onMoveTask={changeActivityStatus} 
              onDeleteTask={deleteActivity} 
              onEditTask={openEditTaskModal}
              onReorderTask={reorderTasks}
              events={allEvents}
              currentDateStr={currentDateStr}
            />
          </>
        )}
        
        {currentView === 'week' && (
          <WeeklyBoard tasks={allTasks} currentDateStr={currentDateStr} />
        )}
        
        {currentView === 'calendar' && (
          <CalendarView 
            events={allEvents} 
            tasks={allTasks}
            selectedDate={globalSelectedDate}
            setSelectedDate={setGlobalSelectedDate}
            onAddEventClick={openNewEventModal}
            onEditEventClick={openEditEventModal}
            onDeleteEvent={deleteActivity} 
          />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <TaskForm 
          onSave={handleSaveTask} 
          onCancel={closeModal} 
          initialData={taskToEdit} 
        />
      </Modal>

      <Modal isOpen={isEventModalOpen} onClose={closeEventModal}>
        <EventForm 
          onSave={handleSaveEvent} 
          onCancel={closeEventModal} 
          initialData={eventToEdit} 
          preselectedDate={preselectedDate}
        />
      </Modal>

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        tasks={allTasks}
      />

      <AchievementModal 
        isOpen={isAchievementOpen} 
        onClose={() => setIsAchievementOpen(false)} 
      />

      <footer className="app-footer" style={{ marginTop: '4rem', padding: '2rem', textAlign: 'center', borderTop: '2px solid #222', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <button 
          onClick={() => setIsHistoryModalOpen(true)} 
          className="secondary-action-btn"
          style={{ 
            background: 'none', 
            border: '2px solid #555', 
            color: '#888', 
            padding: '0.5rem 1.5rem', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}
        >
          🕒 VER HISTORIAL DE TAREAS
        </button>

        <div style={{
          fontSize: '0.85rem',
          fontWeight: '900',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          letterSpacing: '2px',
          opacity: 0.7,
        }}>
          © Gaston Mauricio Cane
        </div>
      </footer>
    </div>
  );
}

export default App;

