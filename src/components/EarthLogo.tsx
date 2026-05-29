import React from 'react';

const EarthLogo: React.FC = () => {
  return (
    <div className="orbit-logo-container">
      <div className="orbit-logo">
        <div className="orbit-logo__inner"></div>
        <div className="orbit-logo__orbit">
          <div className="orbit-logo__dot"></div>
          <div className="orbit-logo__dot"></div>
          <div className="orbit-logo__dot"></div>
          <div className="orbit-logo__dot"></div>
        </div>
      </div>
    </div>
  );
};

export default EarthLogo;
