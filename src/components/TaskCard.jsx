import React, { useState } from 'react';
import ActionButton from './ui/ActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import Sparkles from './ui/Sparkles';
import { audio } from '../utils/audio';
import './TaskCard.css';

const TaskCard = ({ task, onMove, onDelete, onEdit, onReorder }) => {
  const [showSparkles, setShowSparkles] = useState(false);
  
  const isPending = task.status === 'pending';
  const isInProgress = task.status === 'in-progress';
  const isCompleted = task.status === 'completed';

  const handleMove = (id, status) => {
    audio.playClick();
    if (status === 'completed') {
      audio.playSuccess();
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
    }
    onMove(id, status);
  };

  return (
    <motion.div 
      layout
      layoutId={task.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      whileHover={{ 
        scale: 1.02, 
        rotate: -0.5,
        boxShadow: isCompleted ? '0 0 25px rgba(0,255,136,0.5)' : (isInProgress ? '0 0 25px rgba(255,234,0,0.5)' : '0 0 25px rgba(255,0,85,0.5)')
      }}
      onHoverStart={() => audio.playHover()}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`task-card ${task.status}`}
    >
      <AnimatePresence>
        {showSparkles && <Sparkles active={true} />}
      </AnimatePresence>

      {/* Animated Checkmark for Completed Status */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            fontSize: '3.5rem',
            filter: 'drop-shadow(0 0 15px rgba(0,255,136,0.8))',
            zIndex: 10,
            pointerEvents: 'none',
            color: 'var(--color-completed)'
          }}
        >
          ✓
        </motion.div>
      )}

      <div className="task-meta-badges" style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {task.priority && (
          <span className={`task-badge priority-${task.priority}`}>
            {'Prioridad ' + task.priority}
          </span>
        )}
        {task.tag && task.tag !== 'Ninguna' && (
          <span className="task-badge tag">
            {task.tag}
          </span>
        )}
      </div>
      <div className="task-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="task-title" onClick={() => onEdit(task)} title="Haz clic para editar">
          {task.title}
        </div>
        <div className="task-order-actions" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '16px' }}>
           <button className="order-btn" onClick={(e) => { e.stopPropagation(); onReorder(task.id, 'up'); }}>▲</button>
           <button className="order-btn" onClick={(e) => { e.stopPropagation(); onReorder(task.id, 'down'); }}>▼</button>
        </div>
      </div>
      
      {task.description && (
        <div className="task-description" style={{ 
          fontSize: '1rem', 
          opacity: 0.6, 
          marginTop: '0.5rem', 
          lineHeight: 1.4, 
          whiteSpace: 'pre-wrap',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {task.description}
        </div>
      )}

      <div className="task-actions">
        <div className="move-actions">
          {isCompleted || isInProgress ? (
            <ActionButton 
              variant="card-action" 
              className={isCompleted ? 'completed-action' : 'in-progress-action'}
              onClick={(e) => { e.stopPropagation(); handleMove(task.id, isCompleted ? 'in-progress' : 'pending'); }}
            >
              {'< Mover'}
            </ActionButton>
          ) : null}
          {isPending || isInProgress ? (
            <ActionButton 
              variant="card-action"
              className={isInProgress ? 'in-progress-action' : ''}
              onClick={(e) => { e.stopPropagation(); handleMove(task.id, isPending ? 'in-progress' : 'completed'); }}
            >
              {'Mover >'}
            </ActionButton>
          ) : null}
        </div>
        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); audio.playClick(); onDelete(task.id); }}>X</button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
