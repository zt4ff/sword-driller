interface TTSControlsProps {
  onSpeak: () => void;
  onStop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function TTSControls({
  onSpeak,
  onStop,
  isSpeaking,
  isSupported,
}: TTSControlsProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onSpeak}
        disabled={isSpeaking}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.765L4.69 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.69l3.693-3.765z"
            clipRule="evenodd"
          />
          <path d="M12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
        </svg>
        {isSpeaking ? "Speaking..." : "Repeat Question"}
      </button>

      {isSpeaking && (
        <button
          onClick={onStop}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Stop Speaking
        </button>
      )}
    </div>
  );
}
