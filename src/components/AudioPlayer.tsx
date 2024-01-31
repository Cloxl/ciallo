import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from '../css/audio.module.css'
import {AudioContext} from "./AudioContext";
import {SettingsModal} from "./SettingsModal";
import {
    getRandomColor,
    getRandomDuration,
    getRandomFont,
    getRandomSize,
    getRandomText,
    specialChars
} from '../tools/getRandomEvents';
import {BarsOutlined} from '@ant-design/icons';
import {Button} from 'antd';

const AudioPlayer: React.FC = () => {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [gifSrc, setGifSrc] = useState<string | null>(null);
    const {maxTextsPerDraw, maxTexts} = useContext(AudioContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const audioURL = `${process.env.PUBLIC_URL}/audio/ciallo.aac`;
    const gifURL = `${process.env.PUBLIC_URL}/imgs/gif/ciallo.gif`;
    
    useEffect(() => {
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
                        animate();
                    };

                    const handleVisibilityChange = () => {
                        // 当网页被隐藏时，停止绘制
                        if (document.hidden) {
                            clearInterval(timer);
                            cancelAnimationFrame(animationFrameId);
                        } else {
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

    }, [maxTextsPerDraw, canvasRef, maxTexts, audioURL, gifURL]);

    const handleClick = () => {
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play().then(r => r).catch(e => e);
        }
    };

    if (!audioSrc || !gifSrc) {
        return null;
    }

    const text = 'Ciallo～(∠・ω< )⌒★';
    const textSpans = text.split('').map((char, index) => {
        const key = `char-${index}`;
        const specialCharHtml = specialChars[char] || char;
        return (
            <span key={key} className={styles.shakeTextSplit} dangerouslySetInnerHTML={{__html: specialCharHtml}}/>
        );
    });

    const showSettingsModal = () => {
        setIsSettingsModalVisible(true);
    };

    return (
        <div className={styles.page}>
            <div>
                <canvas ref={canvasRef} onClick={handleClick} className={styles.CialloCanvas}/>
            </div>
            <div className={styles.CenterCialloContainer} onClick={handleClick}>
                <div className={styles.shakeText}>{textSpans}</div>
            </div>
            <Button onClick={showSettingsModal} icon={<BarsOutlined/>} className={styles.settingButton}/>
            <SettingsModal
                isVisible={isSettingsModalVisible}
                onClose={() => setIsSettingsModalVisible(false)}
            />
        </div>
    );
};

export default AudioPlayer;
