import logo from './logo.svg';
import './App.css';
import { FormFile } from './FormFile';
import { Badge } from './Badge';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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

<h1>Forms</h1>

<h2>Form File Upload</h2>


        <div style={{ margin: '2rem 0', maxWidth: '400px' }}>
          <h3>Default Webflow Variant</h3>
          <FormFile 
            text="Drag & Drop Files Here"
            note="or, click to browse"
            variant="Webflow"
            fileTypes=""
          />
        </div>

        <div style={{ margin: '2rem 0', maxWidth: '400px' }}>
          <h3>Basin Variant (PDF Only)</h3>
          <FormFile 
            text="Upload Your Documents"
            note="PDF files only"
            variant="Basin"
            fileTypes="application/pdf"
          />
        </div>

        <div style={{ margin: '2rem 0', maxWidth: '400px' }}>
          <h3>UploadCare Variant (Images)</h3>
          <FormFile 
            text="Drop Images Here"
            note="JPG, PNG, WebP accepted"
            variant="UploadCare"
            fileTypes="images"
          />
        </div>

<Badge text='Dark' variant='Dark' />

<Badge text='Light' variant='Light' />



    </div>
  );
}

export default App;
