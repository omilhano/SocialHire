import React from 'react';
import Construction from 'common/images/under_construction.png';

const UnderConstruction = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', paddingBottom: '50px' }}>
      <img 
        src= {Construction} 
        alt="Under Construction" 
        style={{ width: '50%', maxWidth: '600px', marginTop: '20px' }} 
      />
      <h2 style={{ fontWeight: 'bold' }}>Sorry, this page is under construction</h2>
    </div>
  );
};

export default UnderConstruction;
