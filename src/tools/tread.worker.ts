import {TextObjManager} from './textObj';

class WorkerThread {
    private offscreenCanvas: OffscreenCanvas | null = null;
    private ctx: OffscreenCanvasRenderingContext2D | null = null;
    private textManager: TextObjManager;
    private animationFrameId: number | null = null;
    private isPageVisible: boolean = true;

    private contentUpdateInterval: number | null = null;
    private updateInterval = 1000;
    private maxTextsPerDraw: number = 10;
    private maxTexts: number = 100;
    private clintHeight: any;
    private clientWidth: any;

    constructor() {
        this.textManager = new TextObjManager(100, 10, 0, 0);
        this.listenToMessages();
    }

    private listenToMessages() {
        onmessage = (event) => {
            const {data} = event;
            switch (data.type) {
                case 'init':
                    this.clintHeight = data.clintHeight;
                    this.clientWidth = data.clientWidth;
                    this.initializeCanvas(data.canvas, this.clientWidth, this.clintHeight);
                    break;
                case 'visibilityChange':
                    this.isPageVisible = data.isVisible;
                    if (this.isPageVisible) {
                        this.startAnimation();
                        this.startContentUpdates();
                    } else {
                        this.stopAnimation();
                        this.stopContentUpdates();
                    }
                    break;
                case 'updateTextSetting':
                    this.maxTextsPerDraw = data.maxTextsPerDraw;
                    this.maxTexts = data.maxTexts;
                    this.textManager.updateTextSettings(this.maxTextsPerDraw, this.maxTexts);
                    break;
            }
        };
    }

    private initializeCanvas(canvas: OffscreenCanvas, clintWidth: any, clintHeight: any) {
        this.offscreenCanvas = canvas;
        this.offscreenCanvas.width = clintWidth;
        this.offscreenCanvas.height = clintHeight;
        this.ctx = this.offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D | null;
        if (this.ctx) {
            this.ctx.textBaseline = 'top';
            this.startAnimation();
            this.startContentUpdates();
            this.textManager.updateClientSize(this.offscreenCanvas.width, this.offscreenCanvas.height);
        }
    }

    private stopContentUpdates() {
        if (this.contentUpdateInterval !== null) {
            clearInterval(this.contentUpdateInterval);
            this.contentUpdateInterval = null;
        }
    }

    private startContentUpdates() {
        this.stopContentUpdates();
        this.contentUpdateInterval = window.setInterval(() => {
            this.textManager.updateContent(this.ctx as unknown as CanvasRenderingContext2D);
        }, this.updateInterval) as unknown as number;
    }

    private startAnimation() {
        if (!this.isPageVisible || this.animationFrameId !== null) return;

        const render = () => {
            if (!this.ctx || !this.offscreenCanvas) return;

            this.ctx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
            const texts = this.textManager.get();
            texts.forEach(text => {
                this.ctx!.font = `${text.size}px ${text.font}`;
                this.ctx!.fillStyle = text.color;
                this.ctx!.fillText(text.content, text.x, text.y);
            });
            this.textManager.update();

            (this.offscreenCanvas as any).convertToBlob().then((blob: Blob | null) => {
                if (blob) {
                    postMessage({type: 'canvasBlob', blob});
                }
            });

            this.animationFrameId = requestAnimationFrame(render);
        };

        render();
    }


    private stopAnimation() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

new WorkerThread();
