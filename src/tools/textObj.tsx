import {
    getRandomColor,
    getRandomDuration,
    getRandomFont,
    getRandomSize,
    getRandomText
} from './getRandomEvents';

export class TextObj {
    content: string;
    color: string;
    font: string;
    size: number;
    duration: number;
    x: number;
    y: number;
    width: number | null;
    height: number;

    constructor(x: number, y: number) {
        this.content = getRandomText();
        this.color = getRandomColor();
        this.font = getRandomFont();
        this.size = getRandomSize();
        this.duration = getRandomDuration();
        this.x = x;
        this.y = y;
        this.width = null;
        this.height = 0;
    }

    updatePosition() {
        this.x -= this.duration;
    }

    isOutOfCanvas() {
        return this.x + (this.width ?? 0) < -5;
    }

    setWidth(context: CanvasRenderingContext2D) {
        context.font = `${this.size}px ${this.font}`;
        const metrics = context.measureText(this.content);
        this.width = metrics.width;
    }

    setHeight(context: CanvasRenderingContext2D) {
        context.font = `${this.size}px ${this.font}`;
        const metrics = context.measureText(this.content);
        this.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }
}

export class TextObjManager {
    texts: TextObj[] = [];
    maxTexts: number;
    maxTextsPerDraw: number;
    width: number;
    height: number;

    constructor(maxTexts: number, maxTextsPerDraw: number, width: number, height: number) {
        this.maxTexts = maxTexts;
        this.maxTextsPerDraw = maxTextsPerDraw;
        this.width = width;
        this.height = height;
    }

    updateTextSettings(maxTextsPerDraw: number, maxTexts: number) {
        this.maxTextsPerDraw = maxTextsPerDraw;
        this.maxTexts = maxTexts;
    }

    updateClientSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    addText(x: number, y: number, context: CanvasRenderingContext2D, height: number) {
        if (this.texts.length < this.maxTexts) {
            const newText = new TextObj(x, y);
            newText.setWidth(context);
            newText.setHeight(context);

            y = Math.max(y, newText.height);
            newText.y = y;

            this.texts.push(newText);
        }
    }


    get() {
        return this.texts.map(text => ({
            content: text.content,
            color: text.color,
            font: text.font,
            size: text.size,
            duration: text.duration,
            x: text.x,
            y: text.y,
            width: text.width
        }));
    }

    update() {
        this.texts.forEach(text => text.updatePosition());
        this.texts = this.texts.filter(text => !text.isOutOfCanvas());
    }

    updateContent(context: CanvasRenderingContext2D) {
        if (this.texts.length < this.maxTexts) {
            for (let i = 0; i < this.maxTextsPerDraw; i++) {
                this.addText(this.width, Math.random() * this.height, context, this.height);
            }
        }
    }
}
