const CompanyFeatureButton = () => {
    const buttonStyle = {
      fontFamily: "'Futura PT', Arial", 
      backgroundColor: '#177B7B',
      border: 'none',
      color: 'white',
      padding: '5px 5px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1.2rem'
    };
  
    return (
      <>
        <button style={buttonStyle}>Company Feature</button>
      </>
    );
  };

export default CompanyFeatureButton;