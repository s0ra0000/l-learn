"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  word: string;
  options: Option[];
}

interface QuizPageProps {
  params: { id: string };
}

export default function QuizPlayPage({ params }: QuizPageProps) {
  const { id } = params; // Get the quiz ID from the route parameters
  const [questions, setQuestions] = useState<Question[]>([]); // Type state correctly
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quizzes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
        } else {
          console.error("Failed to fetch quiz data");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  // Handle selecting an answer
  const handleAnswerClick = (index: number, isCorrect: boolean) => {
    setSelectedAnswer(index);
    if (isCorrect && selectedAnswer !== index) {
      setScore(score + 1);
    }
  };

  // Move to the next question
  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  // Handle end quiz and update score
  const handleEndQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${id}/score`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        setQuizFinished(true);
      } else {
        console.error("Failed to update quiz score");
      }
    } catch (error) {
      console.error("Error updating quiz score:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center my-[200px]">
        <div className="bg-white flex flex-col items-center justify-center p-[30px] px-[60px] rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold">Congratulations!</h1>
          <p className="mt-4">Your Score:</p>
          <p className="text-3xl text-success font-bold mt-4">
            {score} / {questions.length}
          </p>
          <Link href="/dashboard/quizzes">
            <button className="mt-6 bg-primary text-white py-2 px-4 rounded">
              Back to Quizzes
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center md:p-[30px] min-h-screen">
      <div className="bg-white p-8 rounded-lg w-full md:w-96 text-center shadow-md">
        <h1 className="text-2xl font-medium mb-4">Quiz Play</h1>
        <h2 className="font-light mb-4">
          Question {currentQuestion + 1}/{questions.length}
        </h2>
        <p className="mb-6 text-xl font-bold text-primary">
          {questions[currentQuestion].word}
        </p>
        <div className="flex flex-col gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index, option.isCorrect)}
              className={`w-full px-4 py-2 rounded border border-background text-left ${
                selectedAnswer === index
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-primary_hover hover:text-white"
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
        <button
          className="mt-6 bg-primary text-white py-2 px-4 rounded w-full"
          onClick={
            currentQuestion === questions.length - 1
              ? handleEndQuiz
              : handleNextQuestion
          }
        >
          {currentQuestion === questions.length - 1 ? "End Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
}
