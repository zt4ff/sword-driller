"use client";

import { useState, useEffect, useCallback } from "react";
import { Timer } from "@/components/Timer";
import { ConfigPanel } from "@/components/ConfigPanel";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { ProgressBar } from "@/components/ProgressBar";
import { bibleBooks, biblePassages, fatherhoodQuotes } from "@/data/bibleData";

type SectionType = "books" | "passages" | "fatherhood";

interface Config {
  timer: number; // seconds
  sections: {
    type: SectionType;
    count: number;
  }[];
  trainingTime: number; // minutes
}

interface Question {
  type: SectionType;
  text: string;
  reference?: string;
}

export default function Home() {
  const [config, setConfig] = useState<Config>({
    timer: 10,
    sections: [
      { type: "books", count: 5 },
      { type: "passages", count: 5 },
      { type: "fatherhood", count: 3 },
    ],
    trainingTime: 15,
  });

  const [isTraining, setIsTraining] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);
  const [score, setScore] = useState(0);

  const generateQuestions = useCallback(() => {
    const allQuestions: Question[] = [];

    // Process sections in order without shuffling between them
    config.sections.forEach((section) => {
      const sectionQuestions: Question[] = [];

      for (let i = 0; i < section.count; i++) {
        switch (section.type) {
          case "books":
            const randomBook =
              bibleBooks[Math.floor(Math.random() * bibleBooks.length)];
            sectionQuestions.push({
              type: "books",
              text: randomBook,
            });
            break;
          case "passages":
            const randomPassage =
              biblePassages[Math.floor(Math.random() * biblePassages.length)];
            sectionQuestions.push({
              type: "passages",
              text: randomPassage.reference,
              reference: randomPassage.text,
            });
            break;
          case "fatherhood":
            const randomQuote =
              fatherhoodQuotes[
                Math.floor(Math.random() * fatherhoodQuotes.length)
              ];
            sectionQuestions.push({
              type: "fatherhood",
              text: randomQuote.quote,
              reference: randomQuote.reference,
            });
            break;
        }
      }

      // Shuffle only within the current section
      sectionQuestions.sort(() => Math.random() - 0.5);

      // Add section questions to the overall list
      allQuestions.push(...sectionQuestions);
    });

    return allQuestions;
  }, [config]);

  const startTraining = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setQuestionIndex(0);
    setCurrentQuestion(newQuestions[0]);
    setTimeLeft(config.timer);
    setIsTraining(true);
    setTrainingStartTime(new Date());
    setScore(0);
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setTimeLeft(config.timer);
      setScore((prev) => prev + 1);
    } else {
      // Training complete
      setIsTraining(false);
      setCurrentQuestion(null);
    }
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTraining && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up, move to next question
            nextQuestion();
            return config.timer;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTraining, timeLeft, config.timer, questionIndex, questions.length]);

  // Check if training time limit reached
  useEffect(() => {
    if (isTraining && trainingStartTime) {
      const interval = setInterval(() => {
        const elapsed =
          (new Date().getTime() - trainingStartTime.getTime()) / 1000 / 60;
        if (elapsed >= config.trainingTime) {
          setIsTraining(false);
          setCurrentQuestion(null);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTraining, trainingStartTime, config.trainingTime]);

  const progress =
    questions.length > 0 ? (questionIndex / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Sword Driller
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bible Drill Training Application
          </p>
        </header>

        {!isTraining ? (
          <div className="grid md:grid-cols-2 gap-8">
            <ConfigPanel config={config} onConfigChange={setConfig} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Ready to Start?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your training session will include{" "}
                {config.sections.reduce((sum, s) => sum + s.count, 0)} questions
                over {config.trainingTime} minutes.
              </p>
              <button
                onClick={startTraining}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Training
              </button>
              {score > 0 && (
                <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    Last session: {score} questions completed!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ProgressBar current={questionIndex + 1} total={questions.length} />

            <div className="flex justify-center">
              <Timer timeLeft={timeLeft} totalTime={config.timer} />
            </div>

            {currentQuestion && (
              <QuestionDisplay
                question={currentQuestion}
                onNext={nextQuestion}
                onSkip={skipQuestion}
              />
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setIsTraining(false);
                  setCurrentQuestion(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                End Training
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
