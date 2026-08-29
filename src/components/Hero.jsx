import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const APPS = ['Blender', 'After Effects', 'Photoshop', 'DaVinci Resolve', 'Illustrator', 'Premiere Pro', 'AI Video Gen', 'AI Image Gen'];

const Hero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const frameCount = 95;
    const currentFrame = index =>
      `/robot wave png file hero page/${(index + 1).toString().padStart(4, '0')}.png`;

    const images = [];
    const state = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    function render() {
      // Size canvas to its CSS-rendered size (right 65% of viewport)
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = images[state.frame];
      if (!img || !img.complete) return;

      // object-fit: contain — keep full image, no crop
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    images[0].onload = render;

    // Scroll-driven image sequence — all 95 frames
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      }
    });

    tl.to(state, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: render
    });

    // Resize listener
    const onResize = () => { render(); };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="hero-container" ref={containerRef}>
      <div className="sticky-wrapper">

        {/* Robot wave canvas — right side */}
        <canvas className="hero-canvas" ref={canvasRef} />

        {/* Gradient vignette blending canvas into background */}
        <div className="hero-canvas-fade" />

        {/* Left-side text panel */}
        <div className="hero-content" ref={textRef}>
          {/* Glass texture backdrop */}
          <div className="hero-text-backdrop" />

          <h1 className="hero-title text-gradient">Tharun</h1>

          <div className="hero-roles text-accent-gradient">
            Animator | Video Editor
          </div>

          <p className="hero-bio">
            I craft cinematic 3D product animations and compelling storytelling videos
            that elevate brand identity and boost online presence. I specialize in both
            3D and 2D explainer videos, delivering engaging visuals that drive
            conversions and audience growth.
          </p>

          <div className="hero-apps">
            {APPS.map(app => (
              <span key={app} className="hero-app-tag">{app}</span>
            ))}
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
