import React, {useRef, useEffect, useState} from 'react';
import styles from '../css/canvas.module.css';
import {clickEffect} from '../tools/handleClick';
import {TextObjManager} from '../tools/textObj';

interface CanvasComponentProps {
    allowGame: boolean;
    maxTextsPerDraw: number;
    maxTexts: number;
    randomAudio: boolean;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({
                                                                    allowGame,
                                                                    maxTextsPerDraw,
                                                                    maxTexts,
                                                                    randomAudio
                                                                }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textManagerRef = useRef<TextObjManager>(new TextObjManager(maxTexts, maxTextsPerDraw, 0, 0));
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        let animationFrameId: number | null = null;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.textBaseline = 'top';

        // 设置画布尺寸
        const updateCanvasSize = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            setDimensions({width: canvas.width, height: canvas.height});
        }
        updateCanvasSize();
        textManagerRef.current.updateClientSize(canvas.clientWidth, canvas.clientHeight);
        textManagerRef.current.updateContent(ctx);

        let contentUpdateTimer: number | null = setInterval(() => {
            textManagerRef.current.updateContent(ctx);
        }, 1000) as unknown as number;


        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const texts = textManagerRef.current.get();
            texts.forEach(text => {
                ctx.font = `${text.size}px ${text.font}`;
                ctx.fillStyle = text.color;
                ctx.fillText(text.content, text.x, text.y);
            });
            textManagerRef.current.update();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && contentUpdateTimer === null) {
                contentUpdateTimer = setInterval(() => {
                    textManagerRef.current.updateContent(ctx);
                }, 1000) as unknown as number;
            } else {
                if (contentUpdateTimer !== null) {
                    clearInterval(contentUpdateTimer);
                    contentUpdateTimer = null;
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            if (contentUpdateTimer !== null) {
                clearInterval(contentUpdateTimer);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        textManagerRef.current.updateTextSettings(maxTextsPerDraw, maxTexts);
    }, [maxTextsPerDraw, maxTexts]);

    // 画布尺寸变化
    useEffect(() => {
        textManagerRef.current.updateClientSize(dimensions.width, dimensions.height);
    }, [dimensions]);

    // 浏览器窗口变化
    useEffect(() => {
        const resizeListener = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                setDimensions({width: canvas.clientWidth, height: canvas.clientHeight});
            }
        };
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, []);

    function handleClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        clickEffect(event.clientX, event.clientY, randomAudio);
    }

    return <canvas ref={canvasRef} className={styles.cialloCanvas} onClick={handleClick}/>;
};
