import React, { createContext, useState } from 'react';

interface IAudioContext {
    maxTextsPerDraw: number;
    setMaxTextsPerDraw: React.Dispatch<React.SetStateAction<number>>;
    maxTexts: number;
    setMaxTexts: React.Dispatch<React.SetStateAction<number>>;
    textMove: boolean;
    setTextMove: React.Dispatch<React.SetStateAction<boolean>>;
    clickEffect: boolean;
    setClickEffect: React.Dispatch<React.SetStateAction<boolean>>;
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
    clickEffect: true,
    setClickEffect: () => {},
    allowGame: false,
    setAllowGame: () => {},
    randomAudio: true,
    setRandomAudio: () => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [maxTextsPerDraw, setMaxTextsPerDraw] = useState(10);
    const [maxTexts, setMaxTexts] = useState(100);
    const [textMove, setTextMove] = useState(true);
    const [clickEffect, setClickEffect] = useState(true);
    const [allowGame, setAllowGame] = useState(false);
    const [randomAudio, setRandomAudio] = useState(true);

    const contextValue: IAudioContext = {
        maxTextsPerDraw,
        setMaxTextsPerDraw,
        maxTexts,
        setMaxTexts,
        textMove,
        setTextMove,
        clickEffect,
        setClickEffect,
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
