'use client';

import { useState, useEffect } from 'react';
import './styles.css';

export default function ValentinePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const [roses, setRoses] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  const [hearts, setHearts] = useState<any[]>([]);
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Generate hearts only on client
    const heartEmojis = ['💕', '💖', '💗', '💝', '💓', '💞'];
    const generatedHearts = Array.from({ length: 15 }).map(() => ({
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      fontSize: `${Math.random() * 20 + 15}px`,
    }));
    setHearts(generatedHearts);

    // Generate petals only on client
    const generatedPetals = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }));
    setPetals(generatedPetals);
  }, []);

  const createFirework = (x: number, y: number, color: string) => {
    const fireworksContainer = document.getElementById('fireworks');
    if (!fireworksContainer) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = color;

      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 100 + 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      fireworksContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }
  };

  const celebrateWithFireworks = () => {
    const colors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFD700', '#FFA500', '#FF6B9D'];
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 20) {
        clearInterval(interval);
        return;
      }
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const color = colors[Math.floor(Math.random() * colors.length)];
      createFirework(x, y, color);
      count++;
    }, 200);
  };

  const captureResponse = async (response: 'yes' | 'no') => {
    try {
      await fetch('/api/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response,
          answer: response === 'yes' ? 'She said YES! 💖' : 'She said No 💔',
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        })
      });
    } catch (error) {
      console.error('Failed to capture response:', error);
    }
  };



  const handleYesClick = () => {
    setShowSuccess(true);

    // Create roses
    const positions = [
      { x: 50, y: 100, delay: 0 },
      { x: window.innerWidth - 150, y: 100, delay: 0.2 },
      { x: 100, y: window.innerHeight - 200, delay: 0.4 },
      { x: window.innerWidth - 200, y: window.innerHeight - 200, delay: 0.6 }
    ];
    setRoses(positions);

    celebrateWithFireworks();
    captureResponse('yes');

    // Change background
    document.body.style.background = 'linear-gradient(135deg, #FFE4E9 0%, #FFB6C1 50%, #FF69B4 100%)';
  };

  const handleNoClick = () => {
    setShowRejection(true);
    document.body.style.background = 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #0d0d0d 100%)';
    captureResponse('no');
  };

  return (
    <>
      {/* Floating Hearts */}
      <div className="floating-hearts">
        {hearts.map((heart, i) => (
          <div
            key={i}
            className="heart-particle"
            style={{
              left: heart.left,
              animationDelay: heart.animationDelay,
              fontSize: heart.fontSize,
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>

      {/* Fireworks */}
      <div className="fireworks" id="fireworks"></div>

      {/* Falling Petals */}
      <div className="petals-container">
        {petals.map((petal, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: petal.left,
              animationDuration: petal.animationDuration,
              animationDelay: petal.animationDelay,
              transform: petal.transform,
            }}
          />
        ))}
      </div>

      {/* Roses */}
      {roses.map((rose, index) => (
        <div
          key={index}
          className="rose"
          style={{
            left: `${rose.x}px`,
            top: `${rose.y}px`,
            animationDelay: `${rose.delay}s`
          }}
        >
          <div className="rose-petals">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rose-petal" />
            ))}
            <div className="rose-center" />
          </div>
          <div className="rose-stem" />
        </div>
      ))}

      {/* Main Container */}
      <div className="container">
        {!showSuccess && !showRejection ? (
          <div className="content-box">
            <h1>💕 Happy Valentine&apos;s Day 💕</h1>
            <p className="message">
              Every time I see you, my day gets a little brighter.
              Your smile is contagious, and being around you feels like the best part of my day.
              I&apos;d love to spend this Valentine&apos;s Day getting to know you better.
            </p>
            <p className="question">Would You Like To Go Out With Me?</p>

            <div className="button-container">
              <button className="btn btn-yes" onClick={handleYesClick}>
                <span>Yes 💖</span>
              </button>
              <button className="btn btn-no" onClick={handleNoClick}>
                <span>No 💔</span>
              </button>
            </div>
          </div>
        ) : showSuccess ? (
          <div className="content-box success-state show">
            <div className="success-emoji">🎉💖🌹</div>
            <h1>You Just Made My Day! 💕</h1>
            <p className="message">
              Thank you for saying yes! I&apos;m so excited and can&apos;t wait to spend Valentine&apos;s Day with you.
              I promise to make it a memorable and wonderful experience!
            </p>
            <p className="question">Looking forward to our date! ❤️✨</p>
          </div>
        ) : (
          <div className="content-box rejection-state show">
            <div className="rejection-emoji">😢💔🥀</div>
            <h1>Oh... My Heart Is Broken 💔</h1>
            <p className="message">
              I understand... Maybe it wasn&apos;t meant to be. Even though today isn&apos;t the answer I hoped for,
              I&apos;ll always cherish the moments with you. Thank you for being honest.
            </p>
            <p className="question">Wishing you all the happiness in the world 😔</p>
          </div>
        )}
      </div>
    </>
  );
}
