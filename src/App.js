import React, { useState } from "react";
import { Steps, Button } from 'antd';
import {
  InfoCircleOutlined,
  EyeOutlined,
  ExperimentOutlined,
  PlayCircleOutlined
} from "@ant-design/icons";
import 'antd/dist/reset.css';
import './App.css';
import EyeTracker from "./components/EyeTracker";
import EEGSetup from "./components/EEGSetup";
import Demo from "./components/Demo";
import Description from "./components/Description";

const { Step } = Steps;

export default function App() {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Описание",
      icon: <InfoCircleOutlined />
    },
    {
      title: "Настройка захвата взгляда",
      icon: <EyeOutlined />
    },
    {
      title: "Настройка ЭЭГ",
      icon: <ExperimentOutlined />
    },
    {
      title: "Демо",
      icon: <PlayCircleOutlined />
    }
  ];

  const next = () => {
    setCurrent(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => {
    setCurrent(prev => Math.max(prev - 1, 0));
  };

  return (
      <div className="p-8">
        <Steps current={current}>
          {steps.map(item => (
              <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <div className="mt-8">
          <div className="steps-content">
            {current === 0 && <Description />}
            {current === 1 && <EyeTracker/>}
            {current === 2 && <EEGSetup/>}
            {current === 3 && <Demo/>}
          </div>
          <div className="steps-action mt-4">
            <Button
                style={{ margin: '0 8px'}}
                disabled={current === 0}
                onClick={prev}
            >
              Назад
            </Button>
            <Button type="primary" onClick={next} disabled={current === steps.length - 1}>
              Далее
            </Button>
          </div>
        </div>
      </div>
  );
}
