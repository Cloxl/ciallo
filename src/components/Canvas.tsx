import React, {useRef, useEffect, useState} from 'react';
import styles from '../css/canvas.module.css';
import {clickEffect} from '../tools/handleClick';

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
                                                                    randomAudio,
                                                                }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker>();
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        workerRef.current = new Worker(new URL('../tools/thread.worker.ts', import.meta.url), {type: 'module'});

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

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

    useEffect(() => {
        workerRef.current?.postMessage({
            type: 'updateCanvasSize',
            width: dimensions.width,
            height: dimensions.height,
        });
    }, [dimensions]);

    function handleClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        clickEffect(event.clientX, event.clientY, randomAudio);
    }

    return <canvas ref={canvasRef} className={styles.canvas} onClick={handleClick}/>;
};
