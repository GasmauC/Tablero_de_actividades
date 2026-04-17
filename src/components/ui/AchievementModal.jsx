import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../utils/audio';

const AchievementModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      audio.playFanfare();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '2rem'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            style={{
              backgroundColor: 'var(--color-completed)',
              border: '10px solid black',
              boxShadow: '20px 20px 0px black',
              padding: '4rem 2rem',
              textAlign: 'center',
              maxWidth: '600px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: '6rem' }}
            >
              🏆
            </motion.div>
            
            <h1 style={{ color: 'black', fontSize: '3rem', margin: 0, lineHeight: 1 }}>
              DÍA DOMINADO
            </h1>
            
            <p style={{ color: 'black', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
              Todas las tareas completadas
            </p>

            <div style={{ 
              backgroundColor: 'black', 
              color: 'var(--color-completed)', 
              padding: '1rem', 
              fontSize: '1.2rem', 
              fontWeight: 900,
              marginTop: '1rem'
            }}>
              NIVEL DESBLOQUEADO: PRODUCTIVIDAD SUPREMA ⚡
            </div>

            <button 
              onClick={onClose}
              style={{
                marginTop: '2rem',
                backgroundColor: 'white',
                border: '4px solid black',
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '6px 6px 0px black'
              }}
            >
              CONTINUAR MI LEYENDA
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;
