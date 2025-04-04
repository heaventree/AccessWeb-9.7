import { motion } from 'framer-motion';

interface SuggestedActionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedActions({ onSelect }: SuggestedActionsProps) {
  // Define suggested questions specifically for accessibility
  const suggestedQuestions = [
    {
      title: "What is",
      label: "WCAG compliance?",
      action: "What is WCAG compliance?"
    },
    {
      title: "How do I",
      label: "check color contrast?",
      action: "How do I check color contrast?"
    },
    {
      title: "What are",
      label: "accessibility best practices?",
      action: "What are accessibility best practices?"
    },
    {
      title: "How do I make",
      label: "forms accessible?",
      action: "How do I make forms accessible?"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
      {suggestedQuestions.map((question, index) => (
        <motion.button
          key={`suggested-question-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="text-left p-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          onClick={() => onSelect(question.action)}
        >
          <span className="font-medium">{question.title}</span>
          <span className="text-gray-600"> {question.label}</span>
        </motion.button>
      ))}
    </div>
  );
}