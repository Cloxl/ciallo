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
import {Alert, Button} from 'antd';

const AudioPlayer: React.FC = () => {
    const cilloAudioURL = `${process.env.PUBLIC_URL}/audio/ciallo.aac`;
    const bgmURL = `${process.env.PUBLIC_URL}/audio/bgm1.wav`;
    const gameAudioURL = `${process.env.PUBLIC_URL}/audio/game.wav`;

    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [bgmSrc, setBgmSrc] = useState<string | null>(null);
    const [gameAudioSrc, setGameAudioSrc] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {maxTextsPerDraw, maxTexts, backgroundMusic, textMove, randomAudio, allowGame} = useContext(AudioContext);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [playAttemptFailed, setPlayAttemptFailed] = useState(false);

    useEffect(() => {
        setAudioSrc(cilloAudioURL);
        setBgmSrc(bgmURL);
        setGameAudioSrc(gameAudioURL);
    }, [bgmURL, cilloAudioURL, gameAudioURL]);

    useEffect(() => {
        let src = backgroundMusic && allowGame ? gameAudioSrc : backgroundMusic ? bgmSrc : null;
        if (src) {
            const newAudio = new Audio(src);
            newAudio.loop = true;

            const playAudio = async () => {
                try {
                    await newAudio.play();
                    setPlayAttemptFailed(false);
                } catch (error) {
                    console.error("Audio play failed", error);
                    setPlayAttemptFailed(true);
                }
            };

            playAudio();

            // 设置当前音频状态
            setAudio(newAudio);

            // 清理函数
            return () => {
                newAudio.pause();
                newAudio.src = '';
            };
        }
    }, [backgroundMusic, allowGame, bgmSrc, gameAudioSrc]);

    useEffect(() => {
        const tryToPlayAudio = () => {
            if (playAttemptFailed && audio) {
                audio.play().then(() => {
                    setPlayAttemptFailed(false);
                }).catch(error => {
                    console.error("Playback fails after user interaction:", error);
                });
            }
        };

        // 交互事件
        document.addEventListener('click', tryToPlayAudio);
        document.addEventListener('keydown', tryToPlayAudio);

        return () => {
            document.removeEventListener('click', tryToPlayAudio);
            document.removeEventListener('keydown', tryToPlayAudio);
        };
    }, [playAttemptFailed, audio]);

    useEffect(() => {
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
    }, [maxTextsPerDraw, canvasRef, maxTexts]);

    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (audioSrc) {
            const cialloAudio = new Audio(audioSrc);
            cialloAudio.play().then(r => r).catch(e => console.error('ciallo audio play failed', e));
        }
        const span = document.createElement("span");
        const maxX = document.documentElement.clientWidth - 162;
        const maxY = document.documentElement.clientHeight - 22;
        const spanX = Math.min(e.clientX, maxX);
        const spanY = Math.min(e.clientY, maxY);

        span.className = styles.clickEffect;
        span.style.left = `${spanX}px`;
        span.style.top = `${spanY}px`;
        span.style.font = getRandomFont();
        span.textContent = getRandomText();
        span.style.color = getRandomColor();

        document.body.appendChild(span);

        setTimeout(() => {
            span.remove();
        }, 1500);
    };

    if (!audioSrc) {
        return null;
    }

    const textSpans1 = 'Ciallo～(∠・ω< )⌒★'.split('').map((char, index) => {
        const key = `char-1-${index}`;
        const specialCharHtml = specialChars[char] || char;
        return (
            <span key={key} className={`${styles.shakeTextSplit}`}
                  dangerouslySetInnerHTML={{__html: specialCharHtml}}/>
        );
    });

    const textSpans2 = '☆⌒(<ω・∠)～Ciallo'.split('').map((char, index) => {
        const key = `char-2-${index}`;
        const specialCharHtml = specialChars[char] || char;
        return (
            <span key={key} className={`${styles.shakeTextSplit}`}
                  dangerouslySetInnerHTML={{__html: specialCharHtml}}/>
        );
    });

    const showSettingsModal = () => {
        setIsSettingsModalVisible(true);
    };

    return (
        <div className={styles.page}>
            <div>
                <canvas ref={canvasRef} onClick={handleClick} className={styles.cialloCanvas}/>
            </div>
            <div className={`${styles.centerCialloContainer} ${textMove ? styles.moveContainer : ''}`}
                 onClick={handleClick}>
                <div className={textMove ? styles.textFirstHalf : ''}>
                    <div className={styles.shakeText}>
                        {textSpans1}
                    </div>
                </div>
                <div className={textMove ? styles.textSecondHalf : styles.hide}>
                    <div className={styles.shakeText}>
                        {textSpans2}
                    </div>
                </div>
            </div>
            <Button onClick={showSettingsModal} icon={<BarsOutlined/>} className={styles.settingButton}/>
            <Alert className={`${playAttemptFailed ? '' : styles.hide} ${styles.warringText}`}
                   message="音频播放失败 请尝试点击网页后看看是否能自动播放" type="warning" showIcon closable/>
            <SettingsModal
                isSettingsModalVisible={isSettingsModalVisible}
                onClose={() => setIsSettingsModalVisible(false)}
            />
        </div>
    );
};

export default AudioPlayer;
