import React, {createContext, useEffect, useState} from 'react';

interface IAudioContext {
    maxTextsPerDraw: number;
    setMaxTextsPerDraw: React.Dispatch<React.SetStateAction<number>>;
    maxTexts: number;
    setMaxTexts: React.Dispatch<React.SetStateAction<number>>;
    textMove: boolean;
    setTextMove: React.Dispatch<React.SetStateAction<boolean>>;
    backgroundMusic: boolean;
    setBackgroundMusic: React.Dispatch<React.SetStateAction<boolean>>;
    allowGame: boolean;
    setAllowGame: React.Dispatch<React.SetStateAction<boolean>>;
    randomAudio: boolean;
    setRandomAudio: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AudioContext = createContext<IAudioContext>({
    maxTextsPerDraw: 10,
    setMaxTextsPerDraw: () => {},
    maxTexts: 100,
    setMaxTexts: () => {},
    textMove: true,
    setTextMove: () => {},
    backgroundMusic: true,
    setBackgroundMusic: () => {},
    allowGame: false,
    setAllowGame: () => {},
    randomAudio: true,
    setRandomAudio: () => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [maxTextsPerDraw, setMaxTextsPerDraw] = useState(10);
    const [maxTexts, setMaxTexts] = useState(100);
    const [textMove, setTextMove] = useState(true);
    const [backgroundMusic, setBackgroundMusic] = useState(true);
    const [allowGame, setAllowGame] = useState(false);
    const [randomAudio, setRandomAudio] = useState(true);


    useEffect(() => {
        const settings = localStorage.getItem('setting');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            // 防小人行为
            setTextMove(typeof parsedSettings.textMove === 'boolean' ? parsedSettings.textMove : true);
            setBackgroundMusic(typeof parsedSettings.backgroundMusic === 'boolean' ? parsedSettings.backgroundMusic : true);
            setAllowGame(typeof parsedSettings.allowGame === 'boolean' ? parsedSettings.allowGame : false);
            setRandomAudio(typeof parsedSettings.randomAudio === 'boolean' ? parsedSettings.randomAudio : true);
        }
    }, []);

    const contextValue: IAudioContext = {
        maxTextsPerDraw,
        setMaxTextsPerDraw,
        maxTexts,
        setMaxTexts,
        textMove,
        setTextMove,
        backgroundMusic,
        setBackgroundMusic,
        allowGame,
        setAllowGame,
        randomAudio,
        setRandomAudio,
    };

    return (
        <AudioContext.Provider value={contextValue}>
            {children}
        </AudioContext.Provider>
    );
};
