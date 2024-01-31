import {Modal, Input, Radio, RadioChangeEvent, Space, Divider} from "antd";
import {useContext, useState} from "react";
import {AudioContext} from "./AudioContext";
import styles from "../css/setting.module.css";

interface SettingsModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const SettingsModal = ({isVisible, onClose}: SettingsModalProps) => {
    const {
        maxTextsPerDraw, setMaxTextsPerDraw,
        maxTexts, setMaxTexts,
        textMove, setTextMove,
        clickEffect, setClickEffect,
        allowGame, setAllowGame,
        randomAudio, setRandomAudio
    } = useContext(AudioContext);
    const [tempMaxTextsPerDraw, setTempMaxTextsPerDraw] = useState(maxTextsPerDraw);
    const [tempMaxTexts, setTempMaxTexts] = useState(maxTexts);
    const [tempTextMove, setTempTextMove] = useState(textMove);
    const [tempClickEffect, setTempClickEffect] = useState(clickEffect);
    const [tempAllowGame, setTempAllowGame] = useState(allowGame);
    const [tempRandomAudio, setTempRandomAudio] = useState(randomAudio);
    const [, setIsModalVisible] = useState(false);

    const handleOpen = () => {
        setMaxTextsPerDraw(tempMaxTextsPerDraw);
        setMaxTexts(tempMaxTexts);
        setTextMove(tempTextMove);
        setClickEffect(tempClickEffect);
        setAllowGame(tempAllowGame);
        setRandomAudio(tempRandomAudio);
        setIsModalVisible(false);
    };
    
    const textMoveChange = (e: RadioChangeEvent) => {
        setTempTextMove(e.target.value);
    }
    
    const randomAudioChange = (e: RadioChangeEvent) => {
        setTempRandomAudio(e.target.value);
    }

    const clickEffectChange = (e: RadioChangeEvent) => {
        setTempClickEffect(e.target.value);
    }

    const allowGameChange = (e: RadioChangeEvent) => {
        setTempAllowGame(e.target.value);
    }
    
    const handleInputMaxTextsPerDrawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        newValue < 1 ? void 0 : setTempMaxTextsPerDraw(newValue);
    };


    const handleInputMaxTextsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        newValue < 1 ? void 0 : setTempMaxTexts(newValue);
    };

    const MaxTextsPerDrawnChange = (e: RadioChangeEvent) => {
        const newValue = e.target.value;
        newValue >= 1 ? setTempMaxTextsPerDraw(newValue) : void 0;
    };

    const MaxTextsChange = (e: RadioChangeEvent) => {
        const newValue = e.target.value;
        newValue >= 1 ? setTempMaxTexts(newValue) : void 0;
    };
    

    return (
        <Modal
            title="设置"
            open={isVisible}
            onOk={handleOpen}
            onCancel={onClose}
            centered
            className={styles.settingsModal}
        >
            <Space split={<Divider type="vertical"/>} size={'large'}>
                <div>
                    <p className={styles.ModalText}>音频</p>
                    <Radio.Group onChange={randomAudioChange} value={tempRandomAudio}>
                        <Radio value={true}>芳乃</Radio>
                        <Radio value={false}>随机</Radio>
                    </Radio.Group>
                </div>
                <div>
                    <p className={styles.ModalText}>居中文字移动</p>
                    <Radio.Group onChange={textMoveChange} value={tempTextMove}>
                        <Radio value={true}>开启</Radio>
                        <Radio value={false}>关闭</Radio>
                    </Radio.Group>
                </div>
            </Space>
            <Space split={<Divider type="vertical"/>} size={'large'}>
                <div>
                    <p className={styles.ModalText}>允许游戏运行</p>
                    <Radio.Group onChange={allowGameChange} value={tempAllowGame}>
                        <Radio value={true}>开启</Radio>
                        <Radio value={false}>关闭</Radio>
                    </Radio.Group>
                </div>
                <div>
                    <p className={styles.ModalText}>点击特效</p>
                    <Radio.Group onChange={clickEffectChange} value={tempClickEffect}>
                        <Radio value={true}>开启</Radio>
                        <Radio value={false}>关闭</Radio>
                    </Radio.Group>
                </div>
            </Space>
            <p className={styles.ModalText}>单次绘制</p>
            <Space split={<Divider type="vertical"/>}>
                <Radio.Group onChange={MaxTextsPerDrawnChange} value={tempMaxTextsPerDraw}>
                    <Radio value={10}>10</Radio>
                    <Radio value={20}>20</Radio>
                    <Radio value={100}>B站巅峰弹幕</Radio>
                </Radio.Group>
                <Input
                    type="number"
                    value={tempMaxTextsPerDraw}
                    placeholder="请输入一个正整数的文本单次绘制量"
                    onChange={handleInputMaxTextsPerDrawChange}
                />
            </Space>
            <p className={styles.ModalText}>绘制总量</p>
            <Space split={<Divider type="vertical"/>}>
                <Radio.Group onChange={MaxTextsChange} value={tempMaxTexts}>
                    <Radio value={10}>10</Radio>
                    <Radio value={20}>20</Radio>
                    <Radio value={100}>B站巅峰弹幕</Radio>
                </Radio.Group>
                <Input
                    type="number"
                    value={tempMaxTexts}
                    placeholder="请输入一个正整数的文本绘制总量"
                    onChange={handleInputMaxTextsChange}
                />
            </Space>
        </Modal>
    );
};
