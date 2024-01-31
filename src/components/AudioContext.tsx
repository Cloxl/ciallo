import React, { createContext, useState } from 'react';

interface IAudioContext {
    maxTextsPerDraw: number;
    setMaxTextsPerDraw: React.Dispatch<React.SetStateAction<number>>;
    maxTexts: number;
    setMaxTexts: React.Dispatch<React.SetStateAction<number>>;
}

export const AudioContext = createContext<IAudioContext>({
    maxTextsPerDraw: 10,
    setMaxTextsPerDraw: () => {},
    maxTexts: 100,
    setMaxTexts: () => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [maxTextsPerDraw, setMaxTextsPerDraw] = useState(10);
    const [maxTexts, setMaxTexts] = useState(100);

    const contextValue: IAudioContext = {
        maxTextsPerDraw,
        setMaxTextsPerDraw,
        maxTexts,
        setMaxTexts,
    };

    return (
        <AudioContext.Provider value={contextValue}>
            {children}
        </AudioContext.Provider>
    );
};
