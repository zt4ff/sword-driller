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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto">
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getQuestionTypeColor(
            question.type
          )}`}
        >
          {getQuestionTypeTitle(question.type)}
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {question.text}
        </h2>

        {question.reference && (
          <p className="text-lg text-gray-600 dark:text-gray-300 italic">
            "{question.reference}"
          </p>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Found It!
        </button>
        <button
          onClick={onSkip}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        {question.type === "books" && "Find and open this book in your Bible"}
        {question.type === "passages" &&
          "Find and open this passage in your Bible"}
        {question.type === "fatherhood" &&
          "Find the Bible verse this quote is from"}
      </div>
    </div>
  );
}
