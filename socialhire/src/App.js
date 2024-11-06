import logo from './logo.svg';
import './App.css';
import Footer from './components/Footer'; // Adjust path if needed


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h1>This is a test of the project!</h1>
      </header>
      <Footer />
    </div>
  );
}

export default App;
