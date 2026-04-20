import React from 'react';
import { getLocalDateStr } from '../../utils/date';

const AgendaBanner = ({ events, currentDateStr }) => {
  const todayStr = getLocalDateStr(new Date());
  
  // Only show the banner if the active view is literally TODAY.
  // The user wants clear tracking.
  if (currentDateStr !== todayStr) return null;

  const todaysEvents = events.filter(e => e.targetDate === todayStr && e.status !== 'completado' && e.status !== 'completed');

  if (todaysEvents.length === 0) return null;

  return (
    <div style={{
      background: 'var(--color-priority-high)',
      border: '4px solid #000',
      padding: '1rem',
      marginBottom: '2rem',
      boxShadow: '8px 8px 0px #000',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📢</span>
        <h3 style={{ margin: 0, fontWeight: '900', textTransform: 'uppercase', fontSize: '1.2rem' }}>
          HITOS PARA HOY
        </h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {todaysEvents.map(event => (
          <div key={event.id} style={{ 
            background: '#fff', 
            padding: '0.5rem 1rem', 
            border: '2px solid #000',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: event.priority === 'alta' ? '#ff0000' : event.priority === 'media' ? '#ffff00' : '#00ff00',
              border: '1px solid #000'
            }}></span>
            {event.title} {event.targetTime && `(${event.targetTime})`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaBanner;
