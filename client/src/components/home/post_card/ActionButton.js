import React, { useState } from 'react';

const ActionButton = ({ icon, gradient, onClick, isActive, isLoading, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        disabled={isLoading}
        style={{
          background: gradient,
          border: 'none',
          color: 'white',
          padding: '8px',
          borderRadius: '50%',
          fontSize: '13px',
          fontWeight: '500',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
          width: '40px',
          height: '40px',
          minWidth: '40px'
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {isLoading ? (
          <span className="material-icons" style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>
            refresh
          </span>
        ) : (
          <span className="material-icons" style={{ fontSize: '20px' }}>
            {icon}
          </span>
        )}
      </button>
      
      {showTooltip && !isLoading && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          marginBottom: '5px'
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default ActionButton;