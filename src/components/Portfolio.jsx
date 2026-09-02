import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import portfolioData from '../portfolioData.json';
import './Portfolio.css';

const MediaItem = ({ item, onClick }) => {
  const isVideo = item.url.match(/\.(mp4|mov|webm)$/i);
  const displayName = item.name.length > 40 ? item.name.slice(0, 38) + '…' : item.name;
  const handleContextMenu = (e) => e.preventDefault();

  return (
    <div
      className="media-container"
      onClick={() => onClick(item)}
      onContextMenu={handleContextMenu}
    >
      {isVideo ? (
        <video
          src={item.url}
          className="media-element"
          autoPlay
          loop
          muted
          playsInline
          controlsList="nodownload"
        />
      ) : (
        <img src={item.url} alt={displayName} className="media-element" loading="lazy" />
      )}
      {isVideo && (
        <div className="video-indicator">
          <Play size={16} fill="white" />
        </div>
      )}
      <div className="media-hover-overlay">
        <Play size={32} fill="white" />
      </div>
      <div className="media-title">{displayName}</div>
    </div>
  );
};

// Draggable + auto-scrolling marquee
const DraggableMarquee = ({ items, onMediaClick }) => {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const autoScroll = () => {
      if (!isDragging.current) {
        track.scrollLeft += 0.25; // very slow crawl
        // seamless loop: when past the halfway point (duplicate set), reset
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      animRef.current = requestAnimationFrame(autoScroll);
    };

    animRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* ── Mouse handlers ── */
  const onMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    dragScrollStart.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 3) hasDragged.current = true;
    trackRef.current.scrollLeft = dragScrollStart.current - delta;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  /* ── Touch handlers ── */
  const onTouchStart = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.touches[0].clientX;
    dragScrollStart.current = trackRef.current.scrollLeft;
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(delta) > 3) hasDragged.current = true;
    trackRef.current.scrollLeft = dragScrollStart.current - delta;
  };

  const onTouchEnd = () => { isDragging.current = false; };

  /* ── Click guard: suppress click if user dragged ── */
  const onClickCapture = (e) => {
    if (hasDragged.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="draggable-marquee-outer">
      <div
        className="draggable-marquee-track"
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClickCapture={onClickCapture}
      >
        {[...items, ...items].map((item, idx) => (
          <MediaItem key={idx} item={item} onClick={onMediaClick} />
        ))}
      </div>
      <div className="drag-hint">
        <ChevronLeft size={14} /> drag to browse <ChevronRight size={14} />
      </div>
    </div>
  );
};

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="book-page" ref={ref}>
      {props.children}
    </div>
  );
});
Page.displayName = 'Page';

const BookletSection = ({ items }) => {
  const flipBookRef = useRef(null);

  return (
    <div className="booklet-wrapper">
      <HTMLFlipBook
        width={350}
        height={400}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="flipbook"
        ref={flipBookRef}
      >
        {items.map((item, idx) => (
          <Page key={idx}>
            <img src={item.url} alt={item.name} className="page-image" loading="lazy" />
          </Page>
        ))}
      </HTMLFlipBook>
      <div className="booklet-controls">
        <button
          className="book-btn glass"
          onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
          type="button"
        >
          ← Previous Page
        </button>
        <button
          className="book-btn glass"
          onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
          type="button"
        >
          Next Page →
        </button>
      </div>
    </div>
  );
};

const GridSection = ({ items, onMediaClick }) => (
  <div className="posters-grid">
    {items.map((item, idx) => (
      <MediaItem key={idx} item={item} onClick={onMediaClick} />
    ))}
  </div>
);

const CategorySection = ({ title, subcategories, onMediaClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="category-section glass">
      <div className="category-header" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="text-gradient cursive-text">{title}</h2>
        <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </div>

      <div className={`category-content ${isOpen ? 'open' : ''}`}>
        {Object.entries(subcategories).map(([subTitle, items]) => (
          <div key={subTitle} className="subcategory-section">
            <h3 className="subcategory-title cursive-text">{subTitle}</h3>

            {subTitle === 'odyssey booklet' ? (
              <BookletSection items={items} />
            ) : (subTitle === 'posters' || subTitle === 'visiting cards') ? (
              <GridSection items={items} onMediaClick={onMediaClick} />
            ) : (
              <DraggableMarquee items={items} onMediaClick={onMediaClick} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const displayNames = {
    '3d animator': '3D Animator',
    'graphic design': 'Graphic Design',
    'video editor': 'Video Editor'
  };

  const handleClose = () => setSelectedItem(null);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="portfolio-wrapper">
        <h1 className="portfolio-main-title text-accent-gradient">My Portfolio</h1>

        {Object.entries(portfolioData).map(([category, subcategories]) => (
          <CategorySection
            key={category}
            title={displayNames[category] || category}
            subcategories={subcategories}
            onMediaClick={setSelectedItem}
          />
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedItem && (
        <div className="fullscreen-modal" onClick={handleClose}>
          <button className="close-btn" onClick={handleClose}>
            <X size={32} />
          </button>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {selectedItem.url.match(/\.(mp4|mov|webm)$/i) ? (
              <video
                src={selectedItem.url}
                className="modal-media"
                autoPlay
                controls
                controlsList="nodownload"
                onContextMenu={e => e.preventDefault()}
              />
            ) : (
              <img
                src={selectedItem.url}
                alt={selectedItem.name}
                className="modal-media"
                onContextMenu={e => e.preventDefault()}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
