import React, {useRef, useEffect, useState} from 'react';
import styles from '../css/canvas.module.css';
import {clickEffect} from '../tools/handleClick';
import {TextObjManager} from '../tools/textObj';
import {notification} from "antd";
import {SmileOutlined} from "@ant-design/icons";

interface CanvasComponentProps {
    allowGame: boolean;
    maxTextsPerDraw: number;
    maxTexts: number;
    randomAudio: boolean;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({
                                                                    allowGame,
                                                                    maxTextsPerDraw,
                                                                    maxTexts,
                                                                    randomAudio
                                                                }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textManagerRef = useRef<TextObjManager>(new TextObjManager(maxTexts, maxTextsPerDraw, 0, 0));
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const [score, setScore] = useState(0);

    const onaniiURl = `${process.env.PUBLIC_URL}/res/voice/onanii.ogg`;
    const [onanniSrc, setOnanniSrc] = useState<string | null>(null);

    useEffect(() => {
        setOnanniSrc(onaniiURl);
    }, [onaniiURl]);

    useEffect(() => {
        let animationFrameId: number | null = null;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.textBaseline = 'top';

        // 设置画布尺寸
        const updateCanvasSize = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            setDimensions({width: canvas.width, height: canvas.height});
        }
        updateCanvasSize();
        textManagerRef.current.updateClientSize(canvas.clientWidth, canvas.clientHeight);
        textManagerRef.current.updateContent(ctx);

        let contentUpdateTimer: number | null = setInterval(() => {
            textManagerRef.current.updateContent(ctx);
        }, 1000) as unknown as number;


        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const texts = textManagerRef.current.get();
            texts.forEach(text => {
                ctx.fillStyle = text.color;
                ctx.font = `${text.size}px ${text.font}`;
                ctx.fillText(text.content, text.x, text.y);

                // 辅助线
                // const metrics = ctx.measureText(text.content);
                // const textWidth = metrics.width;
                // const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                // ctx.strokeStyle = 'red';
                // ctx.lineWidth = 1;
                // ctx.strokeRect(text.x, text.y, textWidth, textHeight);

            });
            textManagerRef.current.update();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && contentUpdateTimer === null) {
                contentUpdateTimer = setInterval(() => {
                    textManagerRef.current.updateContent(ctx);
                }, 1000) as unknown as number;
            } else {
                if (contentUpdateTimer !== null) {
                    clearInterval(contentUpdateTimer);
                    contentUpdateTimer = null;
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            if (contentUpdateTimer !== null) {
                clearInterval(contentUpdateTimer);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        textManagerRef.current.updateTextSettings(maxTextsPerDraw, maxTexts);
    }, [maxTextsPerDraw, maxTexts]);

    // 画布尺寸变化
    useEffect(() => {
        textManagerRef.current.updateClientSize(dimensions.width, dimensions.height);
    }, [dimensions]);

    // 浏览器窗口变化
    useEffect(() => {
        const resizeListener = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                setDimensions({width: canvas.clientWidth, height: canvas.clientHeight});
            }
        };
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, []);

    useEffect(() => {
        if (score === 721) {
            const onaniiAudio = new Audio(onanniSrc!);
            onaniiAudio.play().then(r => r).catch(e => console.error('onanii res play failed', e));
            notification.open({
                message: '恭喜你发现了游戏的秘密',
                description: '当你的分数到达0721时，就会播放0721专属音频。',
                placement: 'top',
                icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            });
        }
        if (score > 1000) {
            notification.open({
                message: '胜利！',
                description: '你的积分已经到达1000以上 你可以选择离开网页 或者自动重新开始游戏',
                placement: 'top',
                icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            });
            setScore(0);
        }
    }, [onanniSrc, score]);

    function handleClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        clickEffect(event.clientX, event.clientY, randomAudio);
        console.log(allowGame)
        if (allowGame) {
            const isAdd = textManagerRef.current.isAddCount(event.clientX, event.clientY);
            if (isAdd) {
                setScore(score + 7);
            }
        }
    }

    return (
        <div>
            <div className={`${allowGame? styles.leftBottom:styles.hide}`}>积分:{score.toString().padStart(4, '0')}分</div>
            <canvas ref={canvasRef} className={styles.cialloCanvas} onClick={handleClick}/>
        </div>
    );
};
