import React from "react";
import { Typography, List, Card } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function Description() {
    return (
        <Card bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2}>Общее описание приложения</Title>
            <Paragraph>
                Это веб-приложение предназначено для исследования управления виртуальным окружением с помощью анализа визуального внимания и электроэнцефалографии (ЭЭГ).
            </Paragraph>

            <Title level={4}>Ключевые возможности:</Title>
            <List
                size="large"
                dataSource={[
                    "Калибровка и трекинг взгляда с помощью WebGazer.js",
                    "Сбор и аннотация ЭЭГ-данных через UDP",
                    "Обучение модели на базе RandomForest для классификации мыслительных команд",
                    "Реальное время предсказания и симуляция кликов по направлению взгляда",
                    "Интеграция с виртуальным рабочим столом OS.js через iframe"
                ]}
                renderItem={item => (
                    <List.Item>
                        <Text>{item}</Text>
                    </List.Item>
                )}
            />

            <Title level={4}>Как это работает:</Title>
            <List
                size="small"
                dataSource={[
                    "Шаг 1: Настройка захвата взгляда и калибровка",
                    "Шаг 2: Конфигурация и запуск сбора тренировочных ЭЭГ-данных",
                    "Шаг 3: Обучение модели на собранных данных для распознавания команд",
                    "Шаг 4: Демо — управление через веб-интерфейс OS.js"
                ]}
                renderItem={item => <List.Item>{item}</List.Item>}
            />

            <Paragraph>
                Для начала работы перейдите на вкладку “Настройка захвата взгляда” и выполните калибровку. Далее — раздел “Настройка ЭЭГ”: сбор данных и обучение модели. В демо-режиме протестируйте управление через OS.js.
            </Paragraph>
        </Card>
    );
}