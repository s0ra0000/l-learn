"use client";
import { useState, MouseEvent, useEffect } from "react";

interface CreateQuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quizName: string, selectedWordIds: number[]) => void;
}

type Word = {
  id: number;
  word: string;
};

const CreateQuizDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuizDialogProps) => {
  const [quizName, setQuizName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);

  // Fetch words from the server
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch("/api/words", { method: "GET" });
        if (response.ok) {
          const words: Word[] = await response.json();
          setWordList(words);
          setFilteredWords(words); // Initially show all words
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  // Filter words based on the search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filtered = wordList.filter((word) =>
      word.word.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredWords(filtered);
  };

  // Add a word to the selected list
  const handleSelectWord = (word: Word) => {
    if (!selectedWords.some((w) => w.id === word.id)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Remove a word from the selected list
  const handleRemoveWord = (wordId: number) => {
    setSelectedWords(selectedWords.filter((w) => w.id !== wordId));
  };

  // Handle form submission
  const handleSubmit = () => {
    const selectedWordIds = selectedWords.map((w) => w.id);
    onSubmit(quizName, selectedWordIds);
    onClose();
    setQuizName("");
    setSearchTerm("");
    setSelectedWords([]);
  };

  // Close the dialog when clicking outside of it
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-xl shadow-md w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Create New Quiz</h2>

        {/* Quiz Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Quiz Name</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full border border-gray-300 py-2 rounded px-4"
            placeholder="Enter quiz name..."
          />
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Search Words</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border border-gray-300 py-2 rounded px-4"
            placeholder="Search words..."
          />
        </div>

        {/* List of Filtered Words */}
        <div className="max-h-32 overflow-y-auto mb-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => (
              <button
                key={word.id}
                onClick={() => handleSelectWord(word)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {word.word}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No words found.</p>
          )}
        </div>

        {/* Selected Words */}
        {selectedWords.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Selected Words:</h3>
            <ul className="list-disc pl-5">
              {selectedWords.map((word) => (
                <li key={word.id} className="text-sm text-gray-700">
                  {word.word}
                  <button
                    onClick={() => handleRemoveWord(word.id)}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Create Button */}
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-700 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded"
            disabled={!quizName || selectedWords.length === 0}
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizDialog;
