import { useState, useEffect } from 'react';

export const useGamification = (tasks = []) => {
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('tablero-streak') || '0');
  });
  const [lastDate, setLastDate] = useState(() => {
    return localStorage.getItem('tablero-last-date') || '';
  });
  const [achievementShown, setAchievementShown] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return localStorage.getItem('tablero-achievement-today') === today;
  });

  // Calcular progreso
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Actualizar Streak cuando se completa la primera tarea del día
  useEffect(() => {
    if (completed > 0) {
      const today = new Date().toISOString().split('T')[0];
      
      if (lastDate === '') {
        // Primera vez
        updateStreak(1, today);
      } else if (lastDate !== today) {
        const last = new Date(lastDate);
        const current = new Date(today);
        const diffTime = Math.abs(current - last);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Día consecutivo
          updateStreak(streak + 1, today);
        } else if (diffDays > 1) {
          // Racha perdida
          updateStreak(1, today);
        }
      }
    }
  }, [completed, lastDate, streak]);

  const updateStreak = (val, date) => {
    setStreak(val);
    setLastDate(date);
    localStorage.setItem('tablero-streak', val.toString());
    localStorage.setItem('tablero-last-date', date);
  };

  const setAchievementAsShown = () => {
    const today = new Date().toISOString().split('T')[0];
    setAchievementShown(true);
    localStorage.setItem('tablero-achievement-today', today);
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
