import React, {useContext, useEffect, useState} from 'react';
import styles from '../css/audio.module.css'
import {AudioContext} from "./AudioContext";
import {SettingsModal} from "./SettingsModal";
import {CanvasComponent} from './Canvas';
import {clickEffect, initAudioSources} from '../tools/handleClick';
import {
    specialChars
} from '../tools/getRandomEvents';
import {BarsOutlined} from '@ant-design/icons';
import {Alert, Button} from 'antd';

const AudioPlayer: React.FC = () => {
    const defaultAudioURL = `${process.env.PUBLIC_URL}/res/voice/FangNai/FangNai.aac`;
    const bgmURL = `${process.env.PUBLIC_URL}/res/bgm/bgm1.wav`;
    const gameAudioURL = `${process.env.PUBLIC_URL}/res/bgm/game.wav`;

    const [bgmSrc, setBgmSrc] = useState<string | null>(null);
    const [gameAudioSrc, setGameAudioSrc] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const {maxTextsPerDraw, maxTexts, backgroundMusic, textMove, randomAudio, allowGame} = useContext(AudioContext);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [playAttemptFailed, setPlayAttemptFailed] = useState(false);

    useEffect(() => {
        setBgmSrc(bgmURL);
        setGameAudioSrc(gameAudioURL);
        initAudioSources();
    }, [bgmURL, defaultAudioURL, gameAudioURL]);

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

            playAudio().then(r => r).catch(e => console.error('bgm res play failed', e));
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

    const textSpans1 = 'Ciallo～(∠・ω< )⌒★'.split('').map((char, index) => {
        const key = `char-1-${index}`;
        const specialCharHtml = specialChars[char] || char;
        return (
            <span key={key} className={`${styles.shakeTextSplit}`}
                  dangerouslySetInnerHTML={{__html: specialCharHtml}}/>
        );
    });

    const textSpans2 = '☆⌒( >ω・∠)～ollɐıɔ'.split('').map((char, index) => {
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

    function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        clickEffect(event.clientX, event.clientY, randomAudio);
    }

    return (
        <div className={styles.page}>
            <div>
                <CanvasComponent
                    allowGame={allowGame}
                    maxTextsPerDraw={maxTextsPerDraw}
                    maxTexts={maxTexts}
                    randomAudio={randomAudio}
                />
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
