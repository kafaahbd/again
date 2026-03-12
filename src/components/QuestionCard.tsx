"use client";
import React from "react";
import Latex from "react-latex-next";

import type { Question } from "../typescriptfile/types";

interface Props {
  question: Question;
  userAnswer?: string;
  onAnswerSelect: (questionId: number, answer: string) => void;
  disabled?: boolean;
  colorMap?: { [id: number]: string };
}

const QuestionCard: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswerSelect,
  disabled = false,
  colorMap = {},
}) => {
  const getOptionClass = (optKey: string) => {
    const color = colorMap[question?.id];
    if (!color) return "";
    if (color === "correct" && userAnswer === optKey) {
      return "bg-green-100 border-green-500 dark:bg-green-900/30";
    }
    if (color === "wrong" && userAnswer === optKey) {
      return "bg-red-100 border-red-500 dark:bg-red-900/30";
    }
    return "";
  };

  if (!question) return null;

  return (
    <div className="space-y-3 mb-6">
      {Object.entries(question.options).map(([key, value]) => (
        <label
          key={key}
          className={`block p-3 md:p-4 border rounded-lg cursor-pointer transition 
            ${userAnswer === key ? "border-green-500" : "border-gray-200 dark:border-gray-700"}
            ${getOptionClass(key)}`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name={`q-${question.id}`}
              value={key}
              checked={userAnswer === key}
              onChange={() => onAnswerSelect(question.id, key)}
              disabled={disabled}
              className="w-4 h-4 text-green-600"
            />
            <span className="ml-3 text-lg md:text-2xl text-gray-700 dark:text-gray-300">
              {key}. <Latex>{value as string}</Latex>
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default QuestionCard;