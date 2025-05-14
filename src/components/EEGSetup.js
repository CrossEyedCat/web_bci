import React, { useState } from "react";
import { Button, InputNumber, Card, Space, message, Input } from "antd";

export default function EEGSetup() {
    // параметры фаз
    const [durations, setDurations] = useState({ none: 20, right: 20, left: 20 });
    // UDP и CSV
    const [udpIp, setUdpIp] = useState("0.0.0.0");
    const [udpPort, setUdpPort] = useState(2000);
    const [csvFile, setCsvFile] = useState("eeg_data.csv");

    const [training, setTraining] = useState(false);
    const [trainingResult, setTrainingResult] = useState(null);

    const handleCollectData = async () => {
        const phases = [
            { instruction: "Ни о чем не думать", label: "none", duration: durations.none },
            { instruction: "Думать о правой кнопке", label: "right", duration: durations.right },
            { instruction: "Думать о левой кнопке", label: "left", duration: durations.left },
        ];

        try {
            const resp = await fetch("/start-collection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phases, udp_ip: udpIp, udp_port: udpPort, csv_file: csvFile })
            });
            if (!resp.ok) throw new Error(await resp.text());
            const data = await resp.json();
            message.success(`Сбор данных запущен на ${data.udp_ip}:${data.udp_port}, файл ${data.csv_file}`);
        } catch (err) {
            message.error("Не удалось запустить сбор: " + err.message);
        }
    };

    const handleTrainModel = async () => {
        setTraining(true);
        try {
            const resp = await fetch("/train-model", { method: "POST" });
            if (!resp.ok) throw new Error(await resp.text());
            const result = await resp.json();
            setTrainingResult(result);
            message.success("Модель успешно обучена");
        } catch (error) {
            message.error("Ошибка при обучении модели");
            console.error(error);
        }
        setTraining(false);
    };

    return (
        <div>
            <Card title="Параметры сбора данных" className="mb-4">
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Input addonBefore="UDP IP" value={udpIp} onChange={e => setUdpIp(e.target.value)} />
                    <InputNumber
                        addonBefore="UDP порт"
                        min={1}
                        max={65535}
                        value={udpPort}
                        onChange={value => setUdpPort(value)}
                    />
                    <Input
                        addonBefore="CSV файл"
                        value={csvFile}
                        onChange={e => setCsvFile(e.target.value)}
                    />

                    <div>
                        <p>Длительности фаз (с):</p>
                        <Space>
                            {["none", "right", "left"].map(key => (
                                <div key={key}>
                                    <span>{key}: </span>
                                    <InputNumber
                                        min={5}
                                        max={120}
                                        value={durations[key]}
                                        onChange={val => setDurations(prev => ({ ...prev, [key]: val }))}
                                    />
                                </div>
                            ))}
                        </Space>
                    </div>

                    <Button type="primary" onClick={handleCollectData}>
                        Начать сбор данных
                    </Button>
                </Space>
            </Card>

            <Card title="Обучение модели">
                <Space direction="vertical">
                    <Button type="primary" loading={training} onClick={handleTrainModel}>
                        Обучить модель
                    </Button>
                    {trainingResult && (
                        <div>
                            <p>Точность: {trainingResult.accuracy}%</p>
                            <pre style={{ maxHeight: 200, overflow: "auto" }}>
                {trainingResult.report}
              </pre>
                        </div>
                    )}
                </Space>
            </Card>
        </div>
    );
}
