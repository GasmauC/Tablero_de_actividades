import React, { useMemo } from 'react';
import { getLocalDateStr } from '../../utils/date';
import './CalendarGrid.css';

const daysNamesMap = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado'
};

const CalendarGrid = ({ currentDate = new Date(), selectedDate, onSelectDate, events = [], tasks = [] }) => {
  
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Obtener en qué día cae el 1, ajustado Lunes = 0, Domingo = 6
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;
    
    const days = [];
    
    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month padding to complete grid (e.g. 35 or 42 cells)
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const calendarCells = useMemo(() => getMonthDays(), [currentDate]);
  const todayStr = getLocalDateStr(new Date());

  const eventsByDate = useMemo(() => {
    const map = {};
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (!map[e.targetDate]) map[e.targetDate] = [];
      map[e.targetDate].push(e);
    }
    return map;
  }, [events]);

  const tasksByDate = useMemo(() => {
    const map = {};
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (!map[t.targetDate]) map[t.targetDate] = [];
      map[t.targetDate].push(t);
    }
    return map;
  }, [tasks]);

  return (
    <div className="calendar-grid-wrapper">
      {/* Nombres cortos de los días para la grilla desktop */}
      <div className="calendar-week-header">
        {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(d => {
          let extraClass = '';
          if (d === 'LUN') extraClass = 'day-lun';
          if (d === 'DOM') extraClass = 'day-dom';
          return <div key={d} className={`week-header-cell ${extraClass}`}>{d}</div>;
        })}
      </div>

      <div className="calendar-grid">
        {calendarCells.map((cell, index) => {
          const date = cell.date;
          // Format targetDate safely using local timezone adjusted to ISO format strings YYYY-MM-DD
          const dateStr = getLocalDateStr(date);
          
          const dayName = daysNamesMap[date.getDay()];
          const isToday = dateStr === todayStr;

          const dayEvents = eventsByDate[dateStr] || [];
          const dayTasks = tasksByDate[dateStr] || [];
          const totalTasks = dayTasks.length;
          const completedTasks = dayTasks.filter(t => t.status === 'completed' || t.status === 'completado').length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <div 
              key={dateStr + index} 
              className={`calendar-grid-cell ${isToday ? 'today' : ''} ${!cell.isCurrentMonth ? 'other-month' : ''} ${selectedDate === dateStr ? 'selected-day' : ''}`}
              onClick={() => onSelectDate && onSelectDate(selectedDate === dateStr ? null : dateStr)}
            >
              <div className="cell-header">
                <span className="day-name mobile-only">{dayName.substring(0, 3)}</span>
                <span className="day-number">{date.getDate()}</span>
              </div>

              <div className="cell-events-indicators">
                {dayEvents.map(event => (
                  <div 
                    key={String(event.id)} 
                    className={`event-indicator priority-${event.priority}`} 
                    title={event.title}
                  />
                ))}
              </div>

              <div className="cell-tasks-summary">
                {totalTasks > 0 && (
                  <>
                    <div className="task-progress-bar">
                      <div 
                        className="task-progress-fill" 
                        style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#00ff00' : '#fff' }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
