import React, { useEffect, useRef, useState } from "react";
import webgazer from "webgazer";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function Demo() {
    const [prediction, setPrediction] = useState("");
    const canvasRef = useRef(null);

    useEffect(() => {
        // Инициализация webgazer
        webgazer.setRegression('ridge');
        webgazer.setGazeListener(() => {});
        webgazer.begin().then(() => {
            // Отключаем точки предсказания
            if (typeof webgazer.showPredictionPoints === 'function') {
                webgazer.showPredictionPoints(false);
            }
        });

        // Настройка canvas для отрисовки точки взгляда
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';

        const interval = setInterval(async () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gaze = webgazer.getCurrentPrediction();
            if (gaze) {
                const { x, y } = gaze;
                // Рисуем точку
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(255,0,0,0.7)';
                ctx.fill();

                // Запрос предсказания от API
                try {
                    const resp = await fetch('/predict');
                    if (resp.ok) {
                        const data = await resp.json();
                        setPrediction(data.predicted_label);
                        // Симулируем клик
                        const btn = data.predicted_label === 'left' ? 0 : 2;
                        ['mousedown', 'mouseup'].forEach(type => {
                            const event = new MouseEvent(type, {
                                clientX: x,
                                clientY: y,
                                button: btn,
                                bubbles: true,
                                cancelable: true
                            });
                            document.elementFromPoint(x, y)?.dispatchEvent(event);
                        });
                    }
                } catch (err) {
                    console.error('Predict error:', err);
                }
            }
        }, 1000);

        window.addEventListener('resize', resizeCanvas);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
            webgazer.clearData();
            webgazer.end();
        };
    }, []);

    return (
        <div className="demo-container">
            <iframe title="osjs" src="http://localhost:8000" className="osjs-frame" />
            <canvas ref={canvasRef} />
            <div className="hand-indicator">
                {prediction === 'left' && <LeftOutlined className="hand-icon left-hand" />}
                {prediction === 'right' && <RightOutlined className="hand-icon right-hand" />}
            </div>
        </div>
    );
}
