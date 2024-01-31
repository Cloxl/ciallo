import {Modal, Input} from "antd";
import {useContext, useState} from "react";
import {AudioContext} from "./AudioContext";

interface SettingsModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isVisible, onClose }: SettingsModalProps) => {
    const { maxTextsPerDraw, setMaxTextsPerDraw, maxTexts, setMaxTexts } = useContext(AudioContext);
    const [tempMaxTextsPerDraw, setTempMaxTextsPerDraw] = useState(maxTextsPerDraw);
    const [tempMaxTexts, setTempMaxTexts] = useState(maxTexts);
    const [, setIsModalVisible] = useState(false);

    const handleOpen = () => {
        setMaxTextsPerDraw(tempMaxTextsPerDraw);
        setMaxTexts(tempMaxTexts);
        setIsModalVisible(false);
    };

    return (
        <div>
            <Modal
                title="设置"
                open={isVisible}
                onOk={handleOpen}
                onCancel={onClose}
            >
                <div>
                    <p>每次绘制的最大文本量:</p>
                    <Input
                        type="number"
                        value={tempMaxTextsPerDraw}
                        onChange={(e) => setTempMaxTextsPerDraw(Number(e.target.value))}
                    />
                </div>
                <div>
                    <p>最大文本量:</p>
                    <Input
                        type="number"
                        value={tempMaxTexts}
                        onChange={(e) => setTempMaxTexts(Number(e.target.value))}
                    />
                </div>
            </Modal>
        </div>
    );
};
