import { useState } from "react";

type SectionType = "books" | "passages" | "fatherhood";

interface Config {
  timer: number;
  sections: {
    type: SectionType;
    count: number;
  }[];
  trainingTime: number;
  autoSpeak: boolean;
  speakingRate: number;
}

interface ConfigPanelProps {
  config: Config;
  onConfigChange: (config: Config) => void;
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const updateTimer = (timer: number) => {
    onConfigChange({ ...config, timer });
  };

  const updateTrainingTime = (trainingTime: number) => {
    onConfigChange({ ...config, trainingTime });
  };

  const updateAutoSpeak = (autoSpeak: boolean) => {
    onConfigChange({ ...config, autoSpeak });
  };

  const updateSpeakingRate = (speakingRate: number) => {
    onConfigChange({ ...config, speakingRate });
  };

  const updateSectionCount = (type: SectionType, count: number) => {
    const updatedSections = config.sections.map((section) =>
      section.type === type ? { ...section, count } : section
    );
    onConfigChange({ ...config, sections: updatedSections });
  };

  const toggleSection = (type: SectionType) => {
    const exists = config.sections.find((s) => s.type === type);
    if (exists) {
      const filtered = config.sections.filter((s) => s.type !== type);
      onConfigChange({ ...config, sections: filtered });
    } else {
      const newSections = [...config.sections, { type, count: 1 }];
      onConfigChange({ ...config, sections: newSections });
    }
  };

  const getSectionName = (type: SectionType) => {
    switch (type) {
      case "books":
        return "Books of the Bible";
      case "passages":
        return "Bible Passages";
      case "fatherhood":
        return "Fatherhood of God";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Training Configuration
      </h2>

      {/* Timer Settings */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timer per Question (seconds)
        </label>
        <input
          type="range"
          min="3"
          max="30"
          value={config.timer}
          onChange={(e) => updateTimer(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>3s</span>
          <span className="font-medium">{config.timer}s</span>
          <span>30s</span>
        </div>
      </div>

      {/* Training Time */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Training Time (minutes)
        </label>
        <input
          type="range"
          min="5"
          max="60"
          value={config.trainingTime}
          onChange={(e) => updateTrainingTime(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>5m</span>
          <span className="font-medium">{config.trainingTime}m</span>
          <span>60m</span>
        </div>
      </div>

      {/* Text-to-Speech Settings */}
      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Text-to-Speech
        </h3>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.autoSpeak}
              onChange={(e) => updateAutoSpeak(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-speak questions
            </span>
          </label>
        </div>

        {config.autoSpeak && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Speaking Rate
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={config.speakingRate}
              onChange={(e) => updateSpeakingRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>Slow</span>
              <span className="font-medium">{config.speakingRate}x</span>
              <span>Fast</span>
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Question Sections
        </h3>

        {(["books", "passages", "fatherhood"] as SectionType[]).map((type) => {
          const section = config.sections.find((s) => s.type === type);
          const isEnabled = !!section;

          return (
            <div
              key={type}
              className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => toggleSection(type)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getSectionName(type)}
                  </span>
                </label>
              </div>

              {isEnabled && (
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={section?.count || 1}
                    onChange={(e) =>
                      updateSectionCount(type, Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
