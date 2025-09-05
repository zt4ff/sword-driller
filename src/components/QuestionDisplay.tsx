interface Question {
  type: "books" | "passages" | "fatherhood";
  text: string;
  reference?: string;
}

interface QuestionDisplayProps {
  question: Question;
  onNext: () => void;
  onSkip: () => void;
}

export function QuestionDisplay({
  question,
  onNext,
  onSkip,
}: QuestionDisplayProps) {
  const getQuestionTypeTitle = (type: string) => {
    switch (type) {
      case "books":
        return "Book of the Bible";
      case "passages":
        return "Bible Passage";
      case "fatherhood":
        return "Fatherhood of God";
      default:
        return "Question";
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "books":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "passages":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "fatherhood":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 text-center max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${getQuestionTypeColor(
            question.type
          )}`}
        >
          {getQuestionTypeTitle(question.type)}
        </span>
      </div>

      <div className="mb-8 min-h-[120px] flex items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          {question.text}
        </h2>

        {question.reference && (
          <p className="text-xl text-gray-500 dark:text-gray-400 italic mt-2">
            "{question.reference}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onNext}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-6 rounded-lg text-2xl transition-transform transform hover:scale-105 shadow-lg"
        >
          Found It!
        </button>
        <button
          onClick={onSkip}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-6 rounded-lg text-2xl transition-transform transform hover:scale-105 shadow-lg"
        >
          Skip
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        {question.type === "books" && "Find and open this book in your Bible"}
        {question.type === "passages" &&
          "Find and open this passage in your Bible"}
        {question.type === "fatherhood" &&
          "Find the Bible verse this quote is from"}
      </div>
    </div>
  );
}
