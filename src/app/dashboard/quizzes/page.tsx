"use client";
import { useState, useEffect } from "react";
import QuizCard from "@/components/QuizCard";
import { IoIosSearch } from "react-icons/io";
import CreateQuizDialog from "@/components/CreateQuizDialog";
import { MdAdd } from "react-icons/md";

type Quiz = {
  id: number;
  quizName: string;
  quantity: number;
  score: number;
};

export default function Quizzes() {
  const [isCreateQuizDialogOpen, setIsCreateQuizDialogOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search input value

  // Fetch quizzes from the server
  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/quizzes", { method: "GET" });
      if (response.ok) {
        const data: Quiz[] = await response.json();
        setQuizzes(data);
        setFilteredQuizzes(data); // Initialize filtered quizzes with all data
      } else {
        console.error("Failed to fetch quizzes");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Immediately filter quizzes based on the search value
    if (searchValue === "") {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
  };

  // Create a new quiz
  const handleCreateQuiz = async (
    quizName: string,
    selectedWordIds: number[]
  ) => {
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizName, wordIds: selectedWordIds }),
      });

      if (response.ok) {
        // Refetch quizzes after successfully creating a new quiz
        fetchQuizzes();
      } else {
        console.error("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  // Open and close dialogs
  const openCreateQuizDialog = () => setIsCreateQuizDialogOpen(true);
  const closeCreateQuizDialog = () => setIsCreateQuizDialogOpen(false);

  // Handle rename operation
  const handleRenameQuiz = async (id: number, newName: string) => {
    try {
      const response = await fetch(`/api/quizzes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizName: newName }),
      });

      if (response.ok) {
        fetchQuizzes(); // Refetch quizzes after renaming
      } else {
        console.error("Failed to rename quiz");
      }
    } catch (error) {
      console.error("Error renaming quiz:", error);
    }
  };

  // Handle delete operation
  const handleDeleteQuiz = async (id: number) => {
    try {
      const response = await fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchQuizzes(); // Refetch quizzes after deleting
      } else {
        console.error("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <section className="flex w-full p-[30px] items-center z-20">
      <div className="w-full min-h-screen">
        <h1 className="text-[28px] mb-[16px]">Quizzes</h1>
        <div className="mb-[30px] flex justify-between items-center">
          <form className="flex items-center" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="px-4 py-2 rounded-l h-10 w-[200px] md:w-[360px]"
              placeholder="Search quiz..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit" className="bg-white py-2 h-10 px-4 rounded-r">
              <IoIosSearch className="text-[20px]" />
            </button>
          </form>
          <button
            onClick={openCreateQuizDialog}
            className="bg-primary px-2 md:px-3 py-2 rounded-full md:rounded text-white flex items-center justify-center"
          >
            <span className="block md:hidden">
              <MdAdd className="text-2xl" />
            </span>
            <span className="hidden md:block">Create quiz</span>
          </button>
        </div>

        {/* Render quizzes or loading indicator */}
        {isLoading ? (
          <p>Loading quizzes...</p>
        ) : (
          <div className="w-full flex gap-[30px] items-center flex-col md:flex-row md:items-start md:flex-wrap">
            {filteredQuizzes.length === 0 && <p>No quizzes...</p>}
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                name={quiz.quizName}
                quantity={quiz.quantity}
                score={quiz.score}
                onRename={handleRenameQuiz}
                onDelete={handleDeleteQuiz}
              />
            ))}
          </div>
        )}

        {/* Create Quiz Dialog */}
        {isCreateQuizDialogOpen && (
          <CreateQuizDialog
            isOpen={isCreateQuizDialogOpen}
            onClose={closeCreateQuizDialog}
            onSubmit={handleCreateQuiz}
          />
        )}
      </div>
    </section>
  );
}
