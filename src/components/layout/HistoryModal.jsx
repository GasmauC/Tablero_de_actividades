import React from 'react';
import Modal from '../ui/Modal';
import ActionButton from '../ui/ActionButton';

const HistoryModal = ({ isOpen, onClose, tasks }) => {
  // get completed tasks that have a completedAt date
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt);
  
  // Group by date
  const grouped = completedTasks.reduce((acc, t) => {
    const dateStr = new Date(t.completedAt).toLocaleDateString();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(t);
    return acc;
  }, {});
  
  const sortedDates = Object.keys(grouped).sort((a, b) => {
     return new Date(grouped[b][0].completedAt) - new Date(grouped[a][0].completedAt);
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ position: 'relative', color: '#fff', padding: '1rem', maxHeight: '75vh', overflowY: 'auto' }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: '3rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '0.5rem',
            fontWeight: '900',
            transition: 'color 0.2s ease, transform 0.2s ease'
          }}
          onMouseEnter={e => {
            e.target.style.color = '#fff';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.target.style.color = '#888';
            e.target.style.transform = 'scale(1)';
          }}
          title="Cerrar (ESC)"
        >
          &times;
        </button>

        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '4px solid #fff', paddingBottom: '0.5rem', marginTop: 0 }}>HISTORIAL</h2>
        {sortedDates.length === 0 ? (
          <p style={{ fontSize: '1.2rem', color: '#888' }}>Aún no has completado ninguna tarea.</p>
        ) : (
          sortedDates.map(date => (
            <div key={date} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-completed)', marginBottom: '1rem' }}>{date}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {grouped[date].map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#222', padding: '1rem', border: '2px solid #555' }}>
                    <div>
                      <strong style={{ fontSize: '1.2rem' }}>{t.title}</strong>
                      <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.4rem' }}>{t.tag && t.tag !== 'Ninguna' && `[${t.tag}]`} Día original: {t.day}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #333' }}>
          <ActionButton onClick={onClose} variant="secondary">
            Cerrar
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryModal;
