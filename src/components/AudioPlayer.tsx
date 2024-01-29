import React, { useEffect, useRef, useState } from 'react';
import styles from '../css/audio.module.css'
import { getRandomColor, getRandomDuration, getRandomFont, getRandomSize, getRandomText } from '../tools/getRandomEvents';

const AudioPlayer: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const audioURL = `${process.env.PUBLIC_URL}/audio/ciallo.aac`;
    const gifURL = `${process.env.PUBLIC_URL}/imgs/gif/ciallo.gif`;
    setAudioSrc(audioURL);
    setGifSrc(gifURL);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let texts: { content: any; color: any; font: any; size: any; duration: any; x: number; y: number; }[] = [];
        let timer: string | number | NodeJS.Timeout | undefined;
        let animationFrameId: number;

        const maxTexts = 100;  // 设置最大文本量

        const setupAnimation = () => {
          if (timer) {
            clearInterval(timer);
          }
          timer = setInterval(() => {
            if (texts.length < maxTexts) {
              const text = {
                content: getRandomText(),
                color: getRandomColor(),
                font: getRandomFont(),
                size: getRandomSize(),
                duration: getRandomDuration(),
                x: canvas.width,
                y: Math.random() * canvas.height,
              };
              texts.push(text);
            }
          }, 1000);

          const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            texts = texts.filter(text => {
              if (text.x + ctx.measureText(text.content).width < 0) {
                return false;  // 如果文本已经离开了画布，就移除这个文本
              } else {
                ctx.font = `${text.size} ${text.font}`;
                ctx.fillStyle = text.color;
                ctx.fillText(text.content, text.x, text.y);
                text.x -= text.duration;
                return true;  // 如果文本还在画布上，就保留这个文本
              }
            });
            animationFrameId = requestAnimationFrame(animate);
          };
          animate();
        };

        setupAnimation();

        return () => {
          clearInterval(timer);
          cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, []);

  const handleClick = () => {
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().then(r => r).catch(e => e);
    }
  };

  if (!audioSrc || !gifSrc) {
    return null;
  }

  return (
    <div onClick={handleClick} className={styles.page}>
      <div>
        <canvas ref={canvasRef} className={styles.CialloCanvas} />
      </div>
      <div className={styles.CenterCialloContainer}>
        <img src={gifSrc} alt="ciallo gif" />
      </div>
    </div>
  );
};

export default AudioPlayer;
