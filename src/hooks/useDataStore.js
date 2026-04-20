import { useState, useCallback, useEffect } from 'react';
import { getLocalDateStr } from '../utils/date';

const STORAGE_KEY = 'tablero-unified-activities';

// Parse old generic 'day' string into a reasonable targetDate
const calculateDateForWeekDay = (dayName) => {
  const daysMap = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0};
  const today = new Date();
  const currentDayNum = today.getDay();
  const targetDayNum = daysMap[dayName] !== undefined ? daysMap[dayName] : 1;
  const diff = targetDayNum - currentDayNum + (targetDayNum === 0 && currentDayNum !== 0 ? 7 : (currentDayNum === 0 && targetDayNum !== 0 ? -7 : 0));
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  return getLocalDateStr(targetDate);
};

const getInitialData = () => {
  try {
    const unified = localStorage.getItem(STORAGE_KEY);
    if (unified) return JSON.parse(unified);
    
    // Migration from old logic array if they exist
    const oldTasksStr = localStorage.getItem('tablero-tasks');
    const oldEventsStr = localStorage.getItem('tablero-events');
    const oldTasks = oldTasksStr ? JSON.parse(oldTasksStr) : [];
    const oldEvents = oldEventsStr ? JSON.parse(oldEventsStr) : [];
    
    let merged = [];
    
    if (oldEvents.length > 0) {
      merged = [...merged, ...oldEvents.map(e => ({
        ...e,
        id: String(e.id),
        type: 'evento', 
        targetDate: e.targetDate,
        status: e.status || 'pendiente'
      }))];
    }
    
    if (oldTasks.length > 0) {
      merged = [...merged, ...oldTasks.map(t => ({
        ...t,
        id: String(t.id),
        type: 'tarea',
        targetDate: t.day ? calculateDateForWeekDay(t.day) : getLocalDateStr(),
        status: t.status || 'pending'
      }))];
    }

    if (merged.length > 0) {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
       return merged;
    }
    
    return [];
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

export const useDataStore = () => {
  const [activities, setActivities] = useState(getInitialData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const persistData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addActivity = useCallback((data) => {
    const newId = String((typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    const newActivity = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setActivities(prev => {
      // Find order logic for tasks
      if (newActivity.type === 'tarea') {
        const sameCol = prev.filter(a => a.targetDate === newActivity.targetDate && a.status === newActivity.status && a.type === 'tarea');
        newActivity.order = sameCol.length > 0 ? Math.max(...sameCol.map(a => a.order || 0)) + 1 : 0;
      }

      const updated = [...prev, newActivity];
      persistData(updated);
      return updated;
    });

    return newActivity;
  }, []);

  const updateActivity = useCallback((id, updates) => {
    const normalizedId = String(id);
    setActivities(prev => {
      const oldAct = prev.find(a => String(a.id) === normalizedId);
      if (!oldAct) return prev;

      let newOrder = oldAct.order;

      // FIX: If a task changed its targetDate explicitly through editing, append it to the end of that day to prevent visual clipping/duplicate orders.
      if (oldAct.type === 'tarea' && updates.targetDate && updates.targetDate !== oldAct.targetDate) {
         const targetStatus = updates.status || oldAct.status;
         const sameCol = prev.filter(a => a.targetDate === updates.targetDate && a.status === targetStatus && a.type === 'tarea' && String(a.id) !== normalizedId);
         newOrder = sameCol.length > 0 ? Math.max(...sameCol.map(a => a.order || 0)) + 1 : 0;
      }

      const updated = prev.map(act => 
        String(act.id) === normalizedId ? { ...act, ...updates, order: newOrder } : act
      );
      persistData(updated);
      return updated;
    });
  }, []);

  const deleteActivity = useCallback((id) => {
    const normalizedId = String(id);
    setActivities(prev => {
      const updated = prev.filter(act => String(act.id) !== normalizedId);
      persistData(updated);
      return updated;
    });
  }, []);

  const changeActivityStatus = useCallback((id, newStatus) => {
    setActivities(prev => {
      const act = prev.find(a => String(a.id) === String(id));
      if (!act) return prev;
      
      let newOrder = act.order || 0;
      if (act.type === 'tarea') {
        const sameCol = prev.filter(a => a.targetDate === act.targetDate && a.status === newStatus && a.type === 'tarea');
        newOrder = sameCol.length > 0 ? Math.max(...sameCol.map(a => a.order || 0)) + 1 : 0;
      }
      
      const updated = prev.map(a => {
        if (String(a.id) === String(id)) {
          return {
            ...a,
            status: newStatus,
            order: newOrder,
            completedAt: newStatus === 'completed' || newStatus === 'completado' ? new Date().toISOString() : null
          };
        }
        return a;
      });
      persistData(updated);
      return updated;
    });
  }, []);

  const reorderTasks = useCallback((id, direction) => {
    setActivities(prev => {
      const task = prev.find(t => String(t.id) === String(id));
      if (!task || task.type !== 'tarea') return prev;

      const columnTasks = prev
        .filter(t => t.targetDate === task.targetDate && t.status === task.status && t.type === 'tarea')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const currentIndex = columnTasks.findIndex(t => String(t.id) === String(id));
      if (currentIndex === -1) return prev;

      let newTasks = [...prev];

      if (direction === 'up' && currentIndex > 0) {
        const prevTask = columnTasks[currentIndex - 1];
        newTasks = newTasks.map(t => {
          if (String(t.id) === String(task.id)) return { ...t, order: prevTask.order || (currentIndex - 1) };
          if (String(t.id) === String(prevTask.id)) return { ...t, order: task.order || currentIndex };
          return t;
        });
      } else if (direction === 'down' && currentIndex < columnTasks.length - 1) {
        const nextTask = columnTasks[currentIndex + 1];
        newTasks = newTasks.map(t => {
          if (String(t.id) === String(task.id)) return { ...t, order: nextTask.order || (currentIndex + 1) };
          if (String(t.id) === String(nextTask.id)) return { ...t, order: task.order || currentIndex };
          return t;
        });
      }
      persistData(newTasks);
      return newTasks;
    });
  }, []);

  const dismissAlertToday = useCallback((id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const normalizedId = String(id);
    setActivities(prev => {
      const updated = prev.map(event => 
        String(event.id) === normalizedId ? { 
          ...event, 
          alertHistory: { 
            ...(event.alertHistory || {}), 
            [todayStr]: { notified: true, dismissed: true } 
          } 
        } : event
      );
      persistData(updated);
      return updated;
    });
  }, []);

  return {
    activities,
    isHydrated,
    addActivity,
    updateActivity,
    deleteActivity,
    changeActivityStatus,
    reorderTasks,
    dismissAlertToday
  };
};
