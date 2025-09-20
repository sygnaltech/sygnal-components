import React, { useEffect } from 'react'; 
import logo from './logo.svg'; 
import './App.css';
import { FormFile } from './FormFile';
import { Badge } from './Badge';
import { Slider } from './Slider';
import { Slide } from './Slide';

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

<h1>Forms</h1>

<h2>Form File Upload</h2>

<div wfu-form="true" wfu-form-handler="basin" class="w-form">
  <form
    id="wf-form-Default-Form"
    name="wf-form-Default-Form"
    data-name="Default Form"
    action="https://usebasin.com/f/7e4244eb4ddd"
    method="post"
    data-wf-page-id="63377a593d694ee5674978ee"
    data-wf-element-id="93ecd648-455e-ce9e-4a43-5f0fb110fadd"
    aria-label="Default Form"
    enctype="multipart/form-data" 
  >
    <label for="Name-8">Name</label>
    <input
      class="w-input"
      maxlength="256"
      name="Name"
      data-name="Name"
      placeholder=""
      type="text"
      id="Name-8"
    />
    <label for="Email-10">Email Address</label>
    <input
      class="w-input"
      maxlength="256"
      name="Email"
      data-name="Email"
      placeholder=""
      type="email"
      id="Email-10"
    />
    <label for="Email-9">Upload your Profile Image</label>

        <div style={{ margin: '2rem 0', maxWidth: '400px' }}>
          <h3>Default Webflow Variant</h3>
          {/* <FormFile 
            name="files"
            text="Drag & Drop Files Here"
            note="or, click to browse"
            variant="Webflow"
            fileTypes=""
            multiple={true}
          /> */}
        </div>

    <input
      type="submit"
      data-wait="Please wait..."
      class="w-button"
      value="Submit"
    />
  </form>
  <div class="w-form-done" tabindex="-1" role="region" aria-label="Default Form success">
    <div>Thank you! Your submission has been received!</div>
  </div>
  <div class="w-form-fail" tabindex="-1" role="region" aria-label="Default Form failure">
    <div>Oops! Something went wrong while submitting the form.</div>
  </div>
</div>

{/* 
        <div style={{ margin: '2rem 0', maxWidth: '400px' }}>
          <h3>Default Webflow Variant</h3>
          <FormFile 
            name="files"
            text="Drag & Drop Files Here"
            note="or, click to browse"
            variant="Webflow"
            fileTypes=""
            multiple={true}
          />
        </div>

        <div style={{ margin: '2rem 0', maxWidth: '400px' }}>
          <h3>Basin Variant (PDF Only)</h3>
          <FormFile 
            name="files"
            text="Upload Your Documents"
            note="PDF files only"
            variant="Basin"
            fileTypes="application/pdf"
            multiple={true}
          />
        </div>

        <div style={{ margin: '2rem 0', maxWidth: '400px' }}>
          <h3>UploadCare Variant (Images)</h3>
          <FormFile 
            text="Drop Images Here"
            note="JPG, PNG, WebP accepted"
            variant="UploadCare"
            fileTypes="images"
            name="images"
            multiple={true}
          />
        </div> */}





  <div style={{ padding: '40px' }}>
      <h1>Slider Component Demo</h1>
      
      <Slider
        slidesPerView={3}
        spaceBetween={30}
        loop={true}
        autoplay={false}
        autoplayDelay={3000}
        slot={
          <>
            <div className="slide-card">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="Mountains" />
              <h3>Mountain Vista</h3>
              <p>Breathtaking mountain landscapes</p>
            </div>
            <div className="slide-card">
              <img src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80" alt="Ocean" />
              <h3>Ocean Waves</h3>
              <p>Serene coastal views</p>
            </div>
            <div className="slide-card">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" alt="Forest" />
              <h3>Forest Path</h3>
              <p>Peaceful woodland trails</p>
            </div>
            <div className="slide-card">
              <img src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80" alt="Desert" />
              <h3>Desert Dunes</h3>
              <p>Golden desert landscapes</p>
            </div>
            <div className="slide-card">
              <img src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80" alt="City" />
              <h3>City Lights</h3>
              <p>Urban nighttime scenery</p>
            </div>
            <div className="slide-card">
              <img src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80" alt="Aurora" />
              <h3>Northern Lights</h3>
              <p>Aurora borealis magic</p>
            </div>
          </>
        }
      />
    </div>



<Badge text='Dark' variant='Dark' />

<Badge text='Light' variant='Light' />



    </div>
  );
}

export default App;
