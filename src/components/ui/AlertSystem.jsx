import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../../utils/audio';
import './AlertSystem.css';

const AlertSystem = ({ events, onDismiss }) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [dismissedIds, setDismissedIds] = useState([]);

  useEffect(() => {
    const checkAlerts = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      let eventToAlert = null;
      let daysRemaining = 0;

      for (const event of events) {
        if (dismissedIds.includes(event.id)) continue;
        if (!event.reminder?.enabled || event.status !== 'pendiente') continue;
        if (event.alertHistory?.[todayStr]?.dismissed) continue;

        const targetDate = new Date(`${event.targetDate}T00:00:00`);
        const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && diffDays >= 0) {
          eventToAlert = event;
          daysRemaining = diffDays;
          break;
        }
      }

      if (eventToAlert) {
        setActiveAlert({ event: eventToAlert, days: daysRemaining });
      } else {
        setActiveAlert(null);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [events, dismissedIds]);

  // Manejo de Efectos Sensoriales
  useEffect(() => {
    if (!activeAlert) return;

    const isCritical = activeAlert.event.priority === 'alta';
    let soundInterval;

    const triggerNudge = () => {
      // 1. Sonido (con fallback)
      audio.playBuzzWithFallback();
      
      // 2. Sacudida visual
      document.body.classList.add('shake');
      setTimeout(() => {
        document.body.classList.remove('shake');
      }, 400);
    };

    if (isCritical) {
      triggerNudge();
      // Repetir cada 4 segundos
      soundInterval = setInterval(triggerNudge, 4000);
    } else {
      triggerNudge();
    }

    return () => {
      if (soundInterval) {
        clearInterval(soundInterval);
      }
      document.body.classList.remove('shake');
    };
  }, [activeAlert]);

  const handleDone = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!activeAlert) return;
    const eventId = activeAlert.event.id;

    // 1. Veto local inmediato para que no vuelva a abrirse
    setDismissedIds(prev => [...prev, eventId]);
    
    // 2. Cierre de UI
    setActiveAlert(null);
    
    // 3. Persistencia en base de datos
    if (onDismiss) {
      onDismiss(eventId);
    }
  };

  if (!activeAlert) return null;

  const { event, days } = activeAlert;
  const isCritical = event.priority === 'alta';

  return (
    <div className={`alert-overlay ${isCritical ? 'intensity-critical-overlay' : ''}`}>
      <div className={`alert-box ${isCritical ? 'intensity-critical-box' : ''}`}>
        {isCritical && <div className="critical-label">⚠️ NIVEL: CRÍTICO</div>}
        
        <h1 className="alert-title">
          {isCritical ? 'RECORDATORIO CRÍTICO' : 'RECORDATORIO IMPORTANTE'}
        </h1>
        
        <div className="alert-subtitle">
          {days === 0 ? '¡EL MOMENTO ES HOY!' : `QUEDAN ${days} DÍAS PARA:`}
        </div>

        <div className="alert-event-name">
          {event.title}
        </div>

        <div className="alert-details">
          {event.targetTime && <div style={{ fontSize: '2rem', color: '#00ff88' }}>⏰ HORA: {event.targetTime}</div>}
          {event.description && <div style={{ fontSize: '1.2rem', marginTop: '2rem', color: '#fff', opacity: 0.8 }}>{event.description}</div>}
        </div>

        <button 
          className="alert-btn" 
          onClick={handleDone}
        >
          {isCritical ? 'ENTENDIDO, LO VI' : 'OK, CERRAR'}
        </button>
      </div>
    </div>
  );
};

export default AlertSystem;
