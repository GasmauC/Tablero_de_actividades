import React from 'react';
import TaskColumn from '../TaskColumn';
import './Board.css';

const Board = ({ tasks, onMoveTask, onDeleteTask, onEditTask, onReorderTask }) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="board">
      <TaskColumn 
        title="⚡ PENDIENTE" 
        status="pending" 
        tasks={pendingTasks} 
        onMove={onMoveTask} 
        onDelete={onDeleteTask} 
        onEdit={onEditTask}
        onReorder={onReorderTask}
      />
      <TaskColumn 
        title="🔥 EN PROGRESO" 
        status="in-progress" 
        tasks={inProgressTasks} 
        onMove={onMoveTask} 
        onDelete={onDeleteTask} 
        onEdit={onEditTask}
        onReorder={onReorderTask}
      />
      <TaskColumn 
        title="✅ COMPLETADAS" 
        status="completed" 
        tasks={completedTasks} 
        onMove={onMoveTask} 
        onDelete={onDeleteTask} 
        onEdit={onEditTask}
        onReorder={onReorderTask}
      />
    </div>
  );
};

export default Board;
