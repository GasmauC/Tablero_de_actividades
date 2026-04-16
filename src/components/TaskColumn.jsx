import React from 'react';
import TaskCard from './TaskCard';
import StatusBadge from './ui/StatusBadge';
import EmptyState from './ui/EmptyState';
import { AnimatePresence } from 'framer-motion';
import './TaskColumn.css';

const TaskColumn = ({ title, status, tasks, onMove, onDelete, onEdit, onReorder }) => {
  return (
    <div className={`task-column ${status}`}>
      <div className="column-header">
        {title}
        <StatusBadge count={tasks.length} />
      </div>
      {tasks.length === 0 ? (
        <EmptyState status={status} />
      ) : (
        <div className="task-list">
          <AnimatePresence>
            {tasks.map(task => (
               <TaskCard 
                 key={task.id} 
                 task={task} 
                 onMove={onMove} 
                 onDelete={onDelete} 
                 onEdit={onEdit} 
                 onReorder={onReorder} 
               />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskColumn;
