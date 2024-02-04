import React, {useRef, useEffect} from 'react';
import styles from '../css/canvas.module.css';
import {clickEffect} from '../tools/handleClick';
import {
    getRandomColor,
    getRandomDuration,
    getRandomFont,
    getRandomSize,
    getRandomText
} from '../tools/getRandomEvents';


interface CanvasComponentProps {
    allowGame: boolean;
    maxTextsPerDraw: number;
    maxTexts: number;
    randomAudio: boolean;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({allowGame, maxTextsPerDraw, maxTexts, randomAudio}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        let texts: {
            content: any;
            color: any;
            font: any;
            size: any;
            duration: any;
            x: number;
            y: number;
        }[] = [];
        let timer: string | number | NodeJS.Timeout | undefined;
        let animationFrameId: number;
        const addTexts = () => {
            if (texts.length < maxTexts) {
                for (let i = 0; i < maxTextsPerDraw; i++) {
                    const size = getRandomSize();
                    let y = Math.random() * canvas.height;
                    let duration = getRandomDuration();

                    if (maxTexts - texts.length < 40) {
                        duration += 4;
                    }

                    if (y - size < 0) {
                        y = size + Math.random() * (15 - 4) + 4;
                    }

                    const text = {
                        content: getRandomText(),
                        color: getRandomColor(),
                        font: getRandomFont(),
                        size: `${size}px`,
                        duration: duration,
                        x: canvas.width,
                        y: y,
                    };

                    texts.push(text);
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            texts = texts.filter(text => {
                if (text.x + ctx.measureText(text.content).width < -5) {
                    return false;
                } else {
                    ctx.font = `${text.size} ${text.font}`;
                    ctx.fillStyle = text.color;
                    ctx.fillText(text.content, text.x, text.y);
                    text.x -= text.duration;
                    return true;
                }
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        timer = setInterval(addTexts, 1000);
        animate();

        return () => {
            clearInterval(timer);
            cancelAnimationFrame(animationFrameId);
        };
    }, [maxTextsPerDraw, maxTexts]);

    function handleClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        clickEffect(event.clientX, event.clientY, randomAudio);
    }

    return <canvas ref={canvasRef} className={styles.cialloCanvas} onClick={handleClick}/>;
};
