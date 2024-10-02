import { useState, useEffect, MouseEvent } from "react";

interface AddWordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedWordId: number) => void;
}

type Word = {
  id: number;
  word: string;
};

const AddWordToFolderDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: AddWordDialogProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch("/api/words", {
          method: "GET",
        });
        if (response.ok) {
          const data: Word[] = await response.json();
          setWordList(data);
          setFilteredWords(data);
        } else {
          console.error("Failed to fetch words");
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  // Function to handle the search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filtered = wordList.filter((word) =>
      word.word.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredWords(filtered);
  };

  // Function to handle the submission of a word
  const handleSubmit = (wordId: number) => {
    onSubmit(wordId);
    onClose();
  };

  // Close the dialog if clicking outside of it
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
        <h2 className="text-lg font-bold mb-4">Add New Word</h2>

        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Search Word</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border border-gray-300 py-2 rounded px-4"
            placeholder="Search word..."
          />
        </div>

        {/* List of Filtered Words */}
        <div className="max-h-40 overflow-y-auto">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => (
              <button
                key={word.id}
                onClick={() => handleSubmit(word.id)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {word.word}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No words found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWordToFolderDialog;
