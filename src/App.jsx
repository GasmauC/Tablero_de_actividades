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

import { useTasks } from './hooks/useTasks';
import { useEvents } from './hooks/useEvents';
import { useGamification } from './hooks/useGamification';

function App() {
  const [currentDay, setCurrentDay] = useState(() => {
    return localStorage.getItem('tablero-currentDay') || 'Lunes';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('tablero-currentView');
    if (savedView) return savedView;
    return localStorage.getItem('tablero-weeklyView') === 'true' ? 'week' : 'day';
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tablero-currentDay', currentDay);
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('tablero-currentView', currentView);
  }, [currentView]);

  const {
    tasks,
    currentTasks,
    addTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    reorderTasks
  } = useTasks(currentDay);

  const { events, addEvent, updateEvent, deleteEvent, dismissAlertToday } = useEvents();
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

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [preselectedDate, setPreselectedDate] = useState(null);

  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask({ ...taskData, day: currentDay });
    }
    closeModal();
  };

  const handleSaveEvent = (eventData) => {
    if (eventToEdit) {
      updateEvent(eventToEdit.id, eventData);
    } else {
      addEvent(eventData);
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
    if (currentView === 'calendar_new') {
      openNewEventModal();
      setCurrentView('calendar');
    }
  }, [currentView]);

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

  return (
    <div className="app-container" id="vibration-root">
      <AlertSystem events={events} onDismiss={dismissAlertToday} />
      
      <Header 
        title={currentView === 'week' ? "RESUMEN SEMANAL" : currentView === 'calendar' ? "CALENDARIO" : currentDay} 
        onNewTaskClick={openNewTaskModal} 
        tasks={currentView === 'week' ? tasks : currentTasks}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onHistoryClick={() => setIsHistoryModalOpen(true)}
      />
      
      <main className="main-content">
        {currentView === 'day' && (
          <>
            <DaySelector currentDay={currentDay} setCurrentDay={setCurrentDay} />
            <Board 
              tasks={currentTasks} 
              onMoveTask={changeTaskStatus} 
              onDeleteTask={deleteTask} 
              onEditTask={openEditTaskModal}
              onReorderTask={reorderTasks}
              events={events}
              currentDay={currentDay}
            />
          </>
        )}
        
        {currentView === 'week' && (
          <WeeklyBoard tasks={tasks} />
        )}
        
        {currentView === 'calendar' && (
          <CalendarView 
            events={events} 
            tasks={tasks}
            onAddEventClick={openNewEventModal}
            onEditEventClick={openEditEventModal}
            onDeleteEvent={deleteEvent} 
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
        tasks={tasks}
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
};

export default App;
