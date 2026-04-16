import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import DaySelector from './components/DaySelector';
import Board from './components/layout/Board';
import WeeklyBoard from './components/layout/WeeklyBoard';
import HistoryModal from './components/layout/HistoryModal';
import Modal from './components/ui/Modal';
import TaskForm from './components/TaskForm';
import './App.css'; 

import { useTasks } from './hooks/useTasks';

function App() {
  const [currentDay, setCurrentDay] = useState(() => {
    return localStorage.getItem('tablero-currentDay') || 'Lunes';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isWeeklyView, setIsWeeklyView] = useState(() => {
    return localStorage.getItem('tablero-weeklyView') === 'true';
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tablero-currentDay', currentDay);
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('tablero-weeklyView', isWeeklyView);
  }, [isWeeklyView]);

  const {
    tasks,
    currentTasks,
    addTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    reorderTasks
  } = useTasks(currentDay);

  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask({ ...taskData, day: currentDay });
    }
    closeModal();
  };

  const openNewTaskModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="app-container">
      <Header 
        title={isWeeklyView ? "RESUMEN SEMANAL" : currentDay} 
        onNewTaskClick={openNewTaskModal} 
        tasks={isWeeklyView ? tasks : currentTasks}
        isWeeklyView={isWeeklyView}
        toggleWeeklyView={() => setIsWeeklyView(!isWeeklyView)}
        onHistoryClick={() => setIsHistoryModalOpen(true)}
      />
      
      {!isWeeklyView && (
        <DaySelector currentDay={currentDay} setCurrentDay={setCurrentDay} />
      )}
      
      {isWeeklyView ? (
        <WeeklyBoard tasks={tasks} />
      ) : (
        <Board 
          tasks={currentTasks} 
          onMoveTask={changeTaskStatus} 
          onDeleteTask={deleteTask} 
          onEditTask={openEditTaskModal}
          onReorderTask={reorderTasks}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <TaskForm 
          onSave={handleSaveTask} 
          onCancel={closeModal} 
          initialData={taskToEdit} 
        />
      </Modal>

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        tasks={tasks}
      />
    </div>
  );
}

export default App;
