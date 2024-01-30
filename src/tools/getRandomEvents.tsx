const fonts = ["Arial, sans-serif", "Georgia, serif", "Times New Roman, serif"];

export const getRandomFont = () => {
    return fonts[Math.floor(Math.random() * fonts.length)];
};

export const getRandomText = () => {
    return ["Ciallo～(∠・ω< )⌒★", "Ciallo～(∠・ω< )⌒☆"][Math.floor(Math.random() * 2)];
};

export const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const getRandomDuration = () => {
    return Math.floor(Math.random() * 9) + 1;
};

export const getRandomSize = () => {
    return Math.floor(Math.random() * 40 + 10);
};
