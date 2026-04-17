import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'tablero-events';

const getInitialEvents = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    // Normalizar IDs al cargar
    return parsed.map(event => ({
      ...event,
      id: String(event.id)
    }));
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const useEvents = () => {
  const [events, setEvents] = useState(getInitialEvents);
  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado tras el primer render para evitar wipes accidentales
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const persistEvents = (updatedEvents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const addEvent = useCallback((eventData) => {
    const newId = String((typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    const newEvent = {
      id: newId,
      title: eventData.title || '',
      description: eventData.description || '',
      targetDate: eventData.targetDate || new Date().toISOString().split('T')[0],
      targetTime: eventData.targetTime || '',
      priority: eventData.priority || 'media',
      status: 'pendiente',
      reminder: {
        enabled: eventData.reminder?.enabled ?? true,
        repeatDaily: eventData.reminder?.repeatDaily ?? true,
        daysBefore: eventData.reminder?.daysBefore ?? 7,
      },
      alertHistory: {},
      createdAt: new Date().toISOString(),
    };

    setEvents(prev => {
      const updated = [...prev, newEvent];
      persistEvents(updated);
      return updated;
    });

    return newEvent;
  }, []);

  const updateEvent = useCallback((id, updates) => {
    const normalizedId = String(id);
    setEvents(prev => {
      const updated = prev.map(event => 
        String(event.id) === normalizedId ? { ...event, ...updates } : event
      );
      persistEvents(updated);
      return updated;
    });
  }, []);

  const deleteEvent = useCallback((id) => {
    const normalizedId = String(id);
    // Acción inmediata para mejorar reactividad
    setEvents(prev => {
      const updated = prev.filter(event => String(event.id) !== normalizedId);
      // Persistencia atómica
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const dismissAlertToday = useCallback((id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const normalizedId = String(id);
    setEvents(prev => {
      const updated = prev.map(event => 
        String(event.id) === normalizedId ? { 
          ...event, 
          alertHistory: { 
            ...(event.alertHistory || {}), 
            [todayStr]: { notified: true, dismissed: true } 
          } 
        } : event
      );
      persistEvents(updated);
      return updated;
    });
  }, []);

  const getUpcomingEvents = useCallback(() => {
    return [...events]
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  }, [events]);

  return {
    events,
    isHydrated,
    getUpcomingEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    dismissAlertToday
  };
};
