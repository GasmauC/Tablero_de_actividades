import React from 'react';
import ActionButton from './ui/ActionButton';
import { motion } from 'framer-motion';
import './TaskCard.css';

const TaskCard = ({ task, onMove, onDelete, onEdit, onReorder }) => {
  const isPending = task.status === 'pending';
  const isInProgress = task.status === 'in-progress';
  const isCompleted = task.status === 'completed';

  return (
    <motion.div 
      layout
      layoutId={task.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`task-card ${task.status}`}
    >
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
            fontSize: '3rem',
            filter: 'drop-shadow(0 0 15px rgba(0,255,136,0.8))',
            zIndex: 10,
            pointerEvents: 'none'
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
              onClick={(e) => { e.stopPropagation(); onMove(task.id, isCompleted ? 'in-progress' : 'pending'); }}
            >
              {'< Mover'}
            </ActionButton>
          ) : null}
          {isPending || isInProgress ? (
            <ActionButton 
              variant="card-action"
              className={isInProgress ? 'in-progress-action' : ''}
              onClick={(e) => { e.stopPropagation(); onMove(task.id, isPending ? 'in-progress' : 'completed'); }}
            >
              {'Mover >'}
            </ActionButton>
          ) : null}
        </div>
        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>X</button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
