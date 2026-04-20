import React from 'react';
import { getLocalDateStr } from '../utils/date';
import './DaySelector.css';

const DaySelector = ({ currentDateStr, setCurrentDateStr }) => {
  const parseDate = (d) => {
    const [y, m, day] = d.split('-');
    return new Date(y, m - 1, day);
  };
  
  const current = parseDate(currentDateStr);
  const dayOfWeek = current.getDay(); // 0 is Sunday, 1 is Monday...
  
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayOfThisWeek = new Date(current);
  mondayOfThisWeek.setDate(current.getDate() + diffToMonday);
  
  const days = [];
  const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayOfThisWeek);
    d.setDate(mondayOfThisWeek.getDate() + i);
    const dStr = getLocalDateStr(d);
    days.push({
      dateStr: dStr,
      label: dayNames[i],
      dateNum: d.getDate()
    });
  }

  return (
    <div className="day-selector">
      {days.map(d => (
        <button
          key={d.dateStr}
          className={`day-btn ${currentDateStr === d.dateStr ? 'active' : ''}`}
          onClick={() => setCurrentDateStr(d.dateStr)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{d.label}</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{d.dateNum}</span>
        </button>
      ))}
    </div>
  );
};

export default DaySelector;

