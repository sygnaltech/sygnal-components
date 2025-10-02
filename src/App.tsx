import React, { useEffect } from 'react'; 
import logo from './logo.svg'; 
import './App.css';
import { QRCode } from './QRCode';

function App() {

  useEffect(() => {
    // Add Sygnal CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/sygnaltech/webflow-util@5.2.33/dist/css/webflow-form.css';
    document.head.appendChild(link);

    // Add Sygnal JS
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://cdn.jsdelivr.net/gh/sygnaltech/webflow-util@5.2.33/dist/nocode/webflow-form.js';
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo}  className="App-logo" alt="logo" />
        <h1>Sygnal Components</h1>
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
      </header>










<div style={{ padding: '40px' }}>
  <h1>QR Code Component Demo</h1>

  <div style={{ marginBottom: '40px' }}>
    <h2>Demo 1: Default Webflow Link</h2>
    <p>200x200 with medium error correction, black on white</p>
    <QRCode
      data="https://www.webflow.com"
      variant="200x200"
      errorCorrection="M"
      foregroundColor="#000000"
      backgroundColor="#ffffff"
      includeMargin={true}
    />
  </div>

  <div style={{ marginBottom: '40px' }}>
    <h2>Demo 2: Custom Styled (Purple on Light Pink)</h2>
    <p>300x300 with high error correction</p>
    <QRCode
      data="https://github.com/sygnaltech"
      variant="300x300"
      errorCorrection="H"
      foregroundColor="#8B5CF6"
      backgroundColor="#FDE2F3"
      includeMargin={true}
    />
  </div>

  <div style={{ marginBottom: '40px', maxWidth: '400px', border: '2px solid #ccc', padding: '20px' }}>
    <h2>Demo 3: Responsive (100% x 100%)</h2>
    <p>Contact card vCard data, fits container width</p>
    <QRCode
      data="BEGIN:VCARD&#10;VERSION:3.0&#10;FN:John Doe&#10;TEL:+1-555-123-4567&#10;EMAIL:john@example.com&#10;END:VCARD"
      variant="100%x100%"
      errorCorrection="Q"
      foregroundColor="#059669"
      backgroundColor="#ECFDF5"
      includeMargin={false}
    />
  </div>
</div>


    </div>
  );
}

export default App;
