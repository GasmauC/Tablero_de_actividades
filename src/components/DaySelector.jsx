import React from 'react';
import './DaySelector.css';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DaySelector = ({ currentDay, setCurrentDay }) => {
  return (
    <div className="day-selector">
      {days.map(day => (
        <button
          key={day}
          className={`day-btn ${currentDay === day ? 'active' : ''}`}
          onClick={() => setCurrentDay(day)}
        >
          {day.substring(0, 3).toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;
