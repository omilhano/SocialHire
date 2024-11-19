const WebsiteFeatureButton = () => {
    const buttonStyle = {
      fontFamily: "'Futura PT', Arial", 
      backgroundColor: '#17497B',
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
        <button style={buttonStyle}>Website feature</button>
      </>
    );
  };

export default WebsiteFeatureButton;