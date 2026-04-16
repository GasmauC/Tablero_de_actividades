import React from 'react';

const EmptyState = ({ status }) => {
  let icon = '🎯';
  let title = 'DESPEJADO';
  let subtitle = '¡Estás al día! Agrega una nueva meta para conquistar tu jornada.';

  if (status === 'in-progress') {
    icon = '⚡';
    title = 'ZONA LIBRE';
    subtitle = '¿Nada en progreso? ¡Toma una tarea pendiente y empieza la acción!';
  } else if (status === 'completed') {
    icon = '🏆';
    title = 'LIENZO EN BLANCO';
    subtitle = 'Ningún logro aún en el día. ¡Acelera el ritmo y completa algo genial!';
  }

  return (
    <div style={{
      padding: '4rem 2rem',
      backgroundColor: 'transparent',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      flexGrow: 1,
      minHeight: '250px'
    }}>
      <div style={{
        fontSize: '11rem',
        filter: 'drop-shadow(0px 15px 30px rgba(0,0,0,0.6))',
        animation: 'float 4s ease-in-out infinite',
        lineHeight: 1
      }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        <h3 style={{ 
          color: '#fff',
          fontSize: '3.5rem',
          margin: 0,
          letterSpacing: '-2px',
          fontWeight: '900',
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          maxWidth: '280px',
          margin: 0,
          lineHeight: 1.5,
          fontWeight: '500',
          opacity: 0.6
        }}>
          {subtitle}
        </p>
      </div>
      
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg) scale(1); }
            50% { transform: translateY(-10px) rotate(4deg) scale(1.02); }
            100% { transform: translateY(0px) rotate(0deg) scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default EmptyState;
