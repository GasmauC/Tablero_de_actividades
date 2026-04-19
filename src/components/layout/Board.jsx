import React, { useState } from 'react';
import TaskColumn from '../TaskColumn';
import AgendaBanner from './AgendaBanner';
import './Board.css';

const Board = ({ tasks, onMoveTask, onDeleteTask, onEditTask, onReorderTask, events, currentDay }) => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="board-container">
      <AgendaBanner events={events} selectedDay={currentDay} />
      
      {/* Mobile Tab Navigation */}
      <div className="mobile-tabs">
        <button 
          className={`mobile-tab ${activeTab === 'pending' ? 'active pending' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⚡ PENDIENTE ({pendingTasks.length})
        </button>
        <button 
          className={`mobile-tab ${activeTab === 'in-progress' ? 'active in-progress' : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          🔥 PROGRESO ({inProgressTasks.length})
        </button>
        <button 
          className={`mobile-tab ${activeTab === 'completed' ? 'active completed' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          ✅ LISTO ({completedTasks.length})
        </button>
      </div>

      <div className="board" data-active-tab={activeTab}>
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
    </div>
  );
};

export default Board;
