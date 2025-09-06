"use client";

import { useState, useEffect, useCallback } from "react";
import { Timer } from "@/components/Timer";
import { ConfigPanel } from "@/components/ConfigPanel";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { ProgressBar } from "@/components/ProgressBar";
import { TTSControls } from "@/components/TTSControls";
import { bibleBooks, biblePassages, fatherhoodQuotes } from "@/data/bibleData";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

type SectionType = "books" | "passages" | "fatherhood";

interface Config {
  timer: number; // seconds
  sections: {
    type: SectionType;
    count: number;
  }[];
  trainingTime: number; // minutes
  autoSpeak: boolean; // Auto-speak questions
  speakingRate: number; // Speech rate
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
    autoSpeak: true,
    speakingRate: 0.9,
  });

  const [isTraining, setIsTraining] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);
  const [score, setScore] = useState(0);
  const [isSearchPhase, setIsSearchPhase] = useState(false); // New state to track if timer should run

  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

  const speakQuestionSequence = useCallback(
    (question: Question) => {
      if (!isSupported || !config.autoSpeak) {
        // If TTS is not supported or disabled, start search phase immediately
        setIsSearchPhase(true);
        return;
      }

      setIsSearchPhase(false); // Stop timer during speech sequence

      // Step 1: Say "Draw up your sword"
      speak("Draw up your sword", {
        rate: config.speakingRate,
        pitch: 1,
        volume: 0.8,
      });

      // Step 2: Wait 3 seconds, then call out the question
      setTimeout(() => {
        speak(question.text, {
          rate: config.speakingRate,
          pitch: 1,
          volume: 0.8,
        });

        // Step 3: Wait another moment, then say "Search" and start timer
        setTimeout(() => {
          speak("Search", {
            rate: config.speakingRate,
            pitch: 1,
            volume: 0.8,
          });

          // Start the search phase (timer) after "Search" is said
          setTimeout(() => {
            setIsSearchPhase(true);
          }, 1000); // Small delay to ensure "Search" is spoken
        }, 2000); // 2 seconds after question is spoken
      }, 3000); // 3 seconds after "Draw up your sword"
    },
    [speak, isSupported, config.autoSpeak, config.speakingRate]
  );

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
    setIsSearchPhase(false);
    setTrainingStartTime(new Date());
    setScore(0);

    // Start the speech sequence for the first question
    setTimeout(() => {
      if (newQuestions[0]) {
        speakQuestionSequence(newQuestions[0]);
      }
    }, 1000);
  };

  const nextQuestion = useCallback(() => {
    if (questionIndex < questions.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setTimeLeft(config.timer);
      setIsSearchPhase(false); // Reset search phase
      setScore((prev) => prev + 1);

      // Start speech sequence for next question
      setTimeout(() => {
        speakQuestionSequence(questions[nextIndex]);
      }, 500);
    } else {
      // Training complete
      stop(); // Stop any ongoing speech
      setIsTraining(false);
      setCurrentQuestion(null);
      setIsSearchPhase(false);

      // Announce completion
      if (config.autoSpeak) {
        setTimeout(() => {
          speak("Training session completed! Well done!", {
            rate: config.speakingRate,
          });
        }, 500);
      }
    }
  }, [
    questionIndex,
    questions,
    config.timer,
    speakQuestionSequence,
    stop,
    speak,
    config.autoSpeak,
    config.speakingRate,
  ]);

  const skipQuestion = () => {
    stop(); // Stop current speech
    nextQuestion();
  };

  // Manual speak current question with full sequence
  const speakCurrentQuestion = () => {
    if (currentQuestion) {
      speakQuestionSequence(currentQuestion);
    }
  };

  // Modified useEffect to only run timer during search phase
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTraining && isSearchPhase && timeLeft > 0) {
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
  }, [isTraining, isSearchPhase, timeLeft, config.timer, nextQuestion]);

  // Check if training time limit reached
  useEffect(() => {
    if (isTraining && trainingStartTime) {
      const interval = setInterval(() => {
        const elapsed =
          (new Date().getTime() - trainingStartTime.getTime()) / 1000 / 60;
        if (elapsed >= config.trainingTime) {
          stop(); // Stop any ongoing speech
          setIsTraining(false);
          setCurrentQuestion(null);
          setIsSearchPhase(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTraining, trainingStartTime, config.trainingTime, stop]);

  const progress =
    questions.length > 0 ? (questionIndex / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4 flex flex-col font-sans">
      <div className="max-w-5xl w-full mx-auto flex-grow">
        <header className="text-center my-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
            Sword Driller
          </h1>
          <p className="text-indigo-200 dark:text-gray-300 text-lg">
            Bible Drill Training Application
          </p>
          {!isSupported && (
            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Text-to-speech is not supported in your browser
              </p>
            </div>
          )}
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

            <div className="flex flex-col items-center gap-4">
              <Timer timeLeft={timeLeft} totalTime={config.timer} />

              {/* Status indicator */}
              <div className="text-center h-10">
                {!isSearchPhase ? (
                  <p className="text-xl font-bold text-indigo-200">
                    {isSpeaking ? "🔊 Listen..." : "⏳ Get Ready..."}
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-yellow-300 animate-pulse">
                    🔍 Search!
                  </p>
                )}
              </div>
            </div>

            {currentQuestion && (
              <QuestionDisplay
                question={currentQuestion}
                onNext={nextQuestion}
                onSkip={skipQuestion}
              />
            )}

            {/* TTS Controls */}
            <TTSControls
              onSpeak={speakCurrentQuestion}
              onStop={stop}
              isSpeaking={isSpeaking}
              isSupported={isSupported}
            />

            <div className="text-center">
              <button
                onClick={() => {
                  stop();
                  setIsTraining(false);
                  setCurrentQuestion(null);
                  setIsSearchPhase(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                End Training
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              First Baptist Church Alapere Media Team. 2025
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
