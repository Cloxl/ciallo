import styles from "../css/audio.module.css";
import {getRandomColor, getRandomFont, getRandomText} from "./getRandomEvents";

let initializedAudioSources: { [x: string]: HTMLAudioElement; } = {};
const audioURLs: { [key: string]: string } = {
    1: `${process.env.PUBLIC_URL}/res/voice/FangNai/FangNai.aac`,
    2: `${process.env.PUBLIC_URL}/res/voice/Hu/Hu1.aac`,
    3: `${process.env.PUBLIC_URL}/res/voice/YinFanXun/YinFanXun1.aac`,
    4: `${process.env.PUBLIC_URL}/res/voice/YinFanXun/YinFanXun2.aac`,
    5: `${process.env.PUBLIC_URL}/res/voice/YinFanXun/YinFanXun3.aac`,
    6: `${process.env.PUBLIC_URL}/res/voice/YinFanXun/YinFanXun4.aac`,
    7: `${process.env.PUBLIC_URL}/res/voice/ZhuiYeChou/ZhuiYeChou1.aac`,
    8: `${process.env.PUBLIC_URL}/res/voice/ZhuiYeChou/ZhuiYeChou1.aac`,
};

export const initAudioSources = () => {
    Object.keys(audioURLs).forEach(key => {
        const audio = new Audio(audioURLs[key]);
        audio.load();
        initializedAudioSources[key] = audio;
    });
};

export const clickEffect: (x: number, y: number, randomAudio: boolean) => void = (x: number, y: number, randomAudio: boolean,) => {
    let audioSrc, audio;
    if (randomAudio) {
        const keys = Object.keys(initializedAudioSources);
        const randomIndex = Math.floor(Math.random() * keys.length);
        audioSrc = initializedAudioSources[keys[randomIndex]];
    } else {
        audioSrc = initializedAudioSources['1'];
    }

    if (audioSrc) {
        audio = new Audio(audioSrc.src);
        audio.play().then(r => r).catch(e => console.error('ciallo res play failed', e));
    }
    const span = document.createElement("span");
    const maxX = document.documentElement.clientWidth - 162;
    const maxY = document.documentElement.clientHeight - 22;
    const spanX = Math.min(x, maxX);
    const spanY = Math.min(y, maxY);

    span.className = styles.clickEffect;
    span.style.left = `${spanX}px`;
    span.style.top = `${spanY}px`;
    span.style.font = getRandomFont();
    span.textContent = getRandomText();
    span.style.color = getRandomColor();

    document.body.appendChild(span);
    setTimeout(() => {
        span.remove();
    }, 2000);
};
