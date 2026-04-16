import { useState, useEffect } from 'react';

const getInitialTasks = () => {
  const saved = localStorage.getItem('tablero-tasks');
  if (saved) return JSON.parse(saved);
  return [];
};

export const useTasks = (currentDay) => {
  const [tasks, setTasks] = useState(getInitialTasks);

  useEffect(() => {
    localStorage.setItem('tablero-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData) => {
    const { title, description, day, priority, tag } = taskData;
    const sameColumnTasks = tasks.filter(t => t.day === day && t.status === 'pending');
    const newOrder = sameColumnTasks.length > 0 ? Math.max(...sameColumnTasks.map(t => t.order || 0)) + 1 : 0;
    
    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      priority: priority || 'baja',
      tag: tag || 'Ninguna',
      status: 'pending',
      day,
      order: newOrder,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const changeTaskStatus = (id, newStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const sameColumnTasks = tasks.filter(t => t.day === task.day && t.status === newStatus);
    const newOrder = sameColumnTasks.length > 0 ? Math.max(...sameColumnTasks.map(t => t.order || 0)) + 1 : 0;
    
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: newStatus, 
          order: newOrder,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : (t.status === 'completed' ? null : t.completedAt)
        };
      }
      return t;
    }));
  };

  const reorderTasks = (id, direction) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const columnTasks = tasks
      .filter(t => t.day === task.day && t.status === task.status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const currentIndex = columnTasks.findIndex(t => t.id === id);
    if (currentIndex === -1) return;

    let newTasks = [...tasks];

    if (direction === 'up' && currentIndex > 0) {
      const prevTask = columnTasks[currentIndex - 1];
      newTasks = newTasks.map(t => {
        if (t.id === task.id) return { ...t, order: prevTask.order || (currentIndex - 1) };
        if (t.id === prevTask.id) return { ...t, order: task.order || currentIndex };
        return t;
      });
    } else if (direction === 'down' && currentIndex < columnTasks.length - 1) {
      const nextTask = columnTasks[currentIndex + 1];
      newTasks = newTasks.map(t => {
        if (t.id === task.id) return { ...t, order: nextTask.order || (currentIndex + 1) };
        if (t.id === nextTask.id) return { ...t, order: task.order || currentIndex };
        return t;
      });
    }
    setTasks(newTasks);
  };

  const currentTasks = tasks
    .filter(t => t.day === currentDay)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return {
    tasks,
    currentTasks,
    addTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    reorderTasks
  };
};
