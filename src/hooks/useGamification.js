import { useState, useEffect, useCallback } from 'react';
import { getLocalDateStr } from '../utils/date';

export const useGamification = (tasks = []) => {
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('tablero-streak') || '0', 10);
  });
  const [lastCompletedDate, setLastCompletedDate] = useState(() => {
    return localStorage.getItem('tablero-lastCompletedDate') || null;
  });
  const [achievementShown, setAchievementShown] = useState(() => {
    const today = getLocalDateStr();
    return localStorage.getItem('tablero-achievement-date') === today;
  });

  const checkStreak = useCallback(() => {
    if (!lastCompletedDate) return;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const todayStr = getLocalDateStr(today);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateStr(yesterday);

    if (lastCompletedDate !== todayStr && lastCompletedDate !== yesterdayStr) {
      setStreak(0);
      localStorage.setItem('tablero-streak', '0');
    }
  }, [lastCompletedDate]);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  // Calcular progreso
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed' || t.status === 'completado').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Actualizar Streak cuando se completa la primera tarea del día
  useEffect(() => {
    if (percentage === 100 && total > 0) {
      const today = getLocalDateStr();
      if (lastCompletedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateStr(yesterday);
        
        const newStreak = lastCompletedDate === yesterdayStr ? streak + 1 : 1;
        
        setStreak(newStreak);
        setLastCompletedDate(today);
        localStorage.setItem('tablero-streak', newStreak.toString());
        localStorage.setItem('tablero-lastCompletedDate', today);
      }
    }
  }, [percentage, total, lastCompletedDate, streak]);

  const setAchievementAsShown = () => {
    const today = getLocalDateStr();
    setAchievementShown(true);
    localStorage.setItem('tablero-achievement-date', today);
  };

  // Mensaje dinámico
  let message = "Modo zombie 🧟";
  if (percentage >= 100 && total > 0) message = "DÍA DOMINADO ⚡";
  else if (percentage >= 70) message = "¡Ya casi lo tienes! 🚀";
  else if (percentage >= 40) message = "Vas muy bien 🔥";
  else if (percentage > 0) message = "Buen comienzo ✨";

  return {
    streak,
    percentage,
    completed,
    total,
    message,
    achievementShown,
    setAchievementAsShown
  };
};
