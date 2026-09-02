import React, { useState } from 'react';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';

function App() {
  const [preloadedImages, setPreloadedImages] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloadComplete = (images) => {
    setPreloadedImages(images);
    setIsLoaded(true);
  };

  return (
    <div className="app-container">
      {!isLoaded && <Preloader onComplete={handlePreloadComplete} />}
      <CustomCursor />
      <Hero preloadedImages={preloadedImages} />
      <Portfolio />
      <Footer />
    </div>
  );
}

export default App;
