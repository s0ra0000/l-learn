"use client";
import { useState, useEffect } from "react";
import WordTable from "@/components/WordTable";
import { IoIosSearch } from "react-icons/io";
import AddWordToFolderDialog from "@/components/AddWordToFolderDialog";

type Word = {
  id: number;
  word: string;
  definition: string;
  translation: string;
  status: string;
  createdAt: string;
  folderId?: number | null;
};

export default function Folders1({ params }: { params: { id: string } }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const folderId = params.id;

  // Fetch words from the folder when the component mounts or after adding a new word
  const fetchWords = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(`/api/folders/${folderId}/word`, {
        method: "GET",
      });
      if (response.ok) {
        const data: Word[] = await response.json();
        setWords(data);
      } else {
        console.error("Failed to fetch words");
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchWords();
  }, [folderId]);

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleAddWord = async (wordId: number) => {
    try {
      const response = await fetch(`/api/folders/${folderId}/word`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordId }),
      });

      if (response.ok) {
        await fetchWords(); // Refetch words to update the list
      } else {
        console.error("Failed to add word to folder");
      }
    } catch (error) {
      console.error("Error adding word to folder:", error);
    }
  };

  return (
    <section className="flex w-full p-[30px] items-center z-20">
      <div className="w-[1200px] w-full h-screen">
        <h1 className="text-2xl font-semibold mb-8">TOEFL</h1>
        <div className="mb-[30px] flex items-center justify-between">
          <form className="flex items-center">
            <input
              type="search"
              className="px-4 py-2 rounded-l h-10 w-[360px]"
              placeholder="word..."
            />
            <button type="submit" className="bg-white py-2 h-10 px-4 rounded-r">
              <IoIosSearch className="text-[20px]" />
            </button>
          </form>
          <button
            onClick={openAddDialog}
            className="bg-primary px-4 py-2 rounded text-white"
          >
            Add word
          </button>
        </div>

        {/* Render loading indicator or WordTable */}
        {isLoading ? (
          <p>Loading...</p> // You could replace this with a loading spinner if preferred
        ) : (
          <WordTable data={words} />
        )}

        {isAddDialogOpen && (
          <AddWordToFolderDialog
            isOpen={isAddDialogOpen}
            onClose={closeAddDialog}
            onSubmit={handleAddWord}
          />
        )}
      </div>
    </section>
  );
}
