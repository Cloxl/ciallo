import React, {useEffect, useRef, useState} from 'react';
import styles from '../css/audio.module.css'
import {getRandomColor, getRandomDuration, getRandomFont, getRandomSize, getRandomText} from '../tools/getRandomEvents';
import { BarsOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const AudioPlayer: React.FC = () => {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [gifSrc, setGifSrc] = useState<string | null>(null);
    const [maxTextsPerDraw, setMaxTextsPerDraw] = useState<number>(10);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const audioURL = `${process.env.PUBLIC_URL}/audio/ciallo.aac`;
        const gifURL = `${process.env.PUBLIC_URL}/imgs/gif/ciallo.gif`;
        setAudioSrc(audioURL);
        setGifSrc(gifURL);

        setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
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

                    const maxTexts = 100;

                    const setupAnimation = () => {
                        if (timer) {
                            clearInterval(timer);
                        }
                        timer = setInterval(() => {
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

                    const handleVisibilityChange = () => {
                        if (document.hidden) {
                            // 当文档不可见时，停止动画
                            clearInterval(timer);
                            cancelAnimationFrame(animationFrameId);
                        } else {
                            // 当文档变为可见时，重新开始动画
                            setupAnimation();
                        }
                    };
                    document.addEventListener('visibilitychange', handleVisibilityChange);

                    setupAnimation();


                    return () => {
                        // 清理工作
                        clearInterval(timer);
                        cancelAnimationFrame(animationFrameId);
                        document.removeEventListener('visibilitychange', handleVisibilityChange);
                    };
                }
            }
        }, 0);

    }, [maxTextsPerDraw, canvasRef]);

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
                <canvas ref={canvasRef} className={styles.CialloCanvas}/>
            </div>
            <div className={styles.CenterCialloContainer}>
                <img src={gifSrc} alt="ciallo gif"/>
            </div>
           <Button type="primary" icon={<BarsOutlined />} />
        </div>
    );
};

export default AudioPlayer;
