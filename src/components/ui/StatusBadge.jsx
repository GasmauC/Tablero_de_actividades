import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ count }) => {
  return (
    <span className="status-badge">
      {count}
    </span>
  );
};

export default StatusBadge;
