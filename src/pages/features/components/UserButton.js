const UserFeatureButton = () => {
  const buttonStyle = {
    fontFamily: "'Futura PT', Arial", 
    backgroundColor: '#FF9F80',
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
      <button style={buttonStyle}>User Feature</button>
    </>
  );
};

export default UserFeatureButton;