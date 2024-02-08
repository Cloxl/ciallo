import {
    getRandomColor,
    getRandomDuration,
    getRandomFont,
    getRandomSize,
    getRandomText
} from './getRandomEvents';

// import {QuadTree, Rectangle} from './QuadTree';

export class TextObj {
    content: string;
    color: string;
    font: string;
    size: number;
    duration: number;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number) {
        this.content = getRandomText();
        this.color = getRandomColor();
        this.font = getRandomFont();
        this.size = getRandomSize();
        this.duration = getRandomDuration();
        this.x = x;
        this.y = y;
        this.width = 0;
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

    // quadtree: QuadTree;

    constructor(maxTexts: number, maxTextsPerDraw: number, width: number, height: number) {
        this.maxTexts = maxTexts;
        this.maxTextsPerDraw = maxTextsPerDraw;
        this.width = width;
        this.height = height;

        // 四叉树
        // const boundary = new Rectangle(0, 0, width, height);
        // this.quadtree = new QuadTree(boundary, 4);
    }

    updateTextSettings(maxTextsPerDraw: number, maxTexts: number) {
        this.maxTextsPerDraw = maxTextsPerDraw;
        this.maxTexts = maxTexts;
    }

    updateClientSize(width: number, height: number) {
        this.width = width;
        this.height = height;
        // const boundary = new Rectangle(0, 0, width, height);
        // this.quadtree = new QuadTree(boundary, 4);
        // this.texts.forEach(text => this.quadtree.insert(text));
    }

    addText(x: number, y: number, context: CanvasRenderingContext2D) {
        if (this.texts.length < this.maxTexts) {
            const newText = new TextObj(x, y);

            newText.setWidth(context);
            newText.setHeight(context);
            newText.y = Math.max(y, newText.height);

            this.texts.push(newText);
            // this.quadtree.insert(newText);
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
        // const boundary = new Rectangle(0, 0, this.width, this.height);
        // this.quadtree = new QuadTree(boundary, 4);
        // this.texts.forEach(text => this.quadtree.insert(text));
    }


    updateContent(context: CanvasRenderingContext2D) {
        if (this.texts.length < this.maxTexts) {
            for (let i = 0; i < this.maxTextsPerDraw; i++) {
                this.addText(this.width, Math.random() * this.height, context, this.height);
            }
        }
    }

    // isAddCount(x: number, y: number) {
    //     const mouseRect = new Rectangle(x - 10, y - 10, 20, 20);
    //     const foundTexts = this.quadtree.query(mouseRect);
    //     let collisionDetected = false;
    //     let qlength = this.quadtree.getTotalLength();
    //     console.log('qlength', qlength);
    //
    //     this.quadtree.printBoundaries();
    //
    //     foundTexts.forEach(foundText => {
    //         const index = this.texts.findIndex(text => text === foundText);
    //         if (index > -1) {
    //             console.log('collision detected');
    //             collisionDetected = true;
    //             this.texts.splice(index, 1);
    //             this.quadtree.delete(this.texts[index]);
    //         }
    //     });
    //
    //     return collisionDetected;
    // }
    isAddCount(x: number, y: number): boolean {
        for (let i = 0; i < this.texts.length; i++) {
            const text = this.texts[i];
            const withinXRange = x >= text.x && x <= (text.x + text.width);
            if (withinXRange) {
                const offsetY = y + text.height;
                const withinYRange = offsetY >= text.y && offsetY <= (text.y + text.height);

                // if (y < text.y) {
                //     console.log('小于y y:', y, ' ', text.y, '还差', text.y - y);
                // }else if (y > text.y + text.height) {
                //     console.log('大于y y:', y, ' ', text.y, '多了', y - (text.y + text.height));
                // }

                if (withinYRange) {
                    this.texts.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }
}
