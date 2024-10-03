"use client";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import Status from "./Status";
import DeleteConfirmationDialog from "./DeleteDialog";
import EditWordDialog from "./EditWordDialog";

interface WordData {
  id: number; // Added id field to uniquely identify each word for deletion
  word: string;
  definition: string;
  translation: string;
  status: string;
  createdAt: string;
}

interface WordTableProps {
  data: WordData[];
}

const WordTable = ({ data }: WordTableProps) => {
  const [words, setWords] = useState<WordData[]>(data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);

  const handleEdit = (wordData: WordData) => {
    setSelectedWord(wordData);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (updatedData: {
    word: string;
    definition: string;
    translation: string;
    status: string;
  }) => {
    if (selectedWord) {
      try {
        const response = await fetch("/api/words", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedWord.id,
            word: updatedData.word,
            definition: updatedData.definition,
            translation: updatedData.translation,
            status: updatedData.status,
          }),
        });

        if (response.ok) {
          console.log("Successfully updated word:", updatedData);
          setWords((prevWords) =>
            prevWords.map((word) =>
              word.id === selectedWord.id ? { ...word, ...updatedData } : word
            )
          );
        } else {
          console.error("Failed to update word:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating word:", error);
      } finally {
        setIsEditDialogOpen(false);
        setSelectedWord(null);
      }
    }
  };

  const handleDelete = (wordData: WordData) => {
    setSelectedWord(wordData);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedWord) {
      try {
        const response = await fetch("/api/words", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedWord.id }),
        });

        if (response.ok) {
          console.log(`Successfully deleted: ${selectedWord.word}`);
          setWords((prevWords) =>
            prevWords.filter((word) => word.id !== selectedWord.id)
          );
        } else {
          console.error("Failed to delete word:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting word:", error);
      } finally {
        setIsDialogOpen(false);
        setSelectedWord(null);
      }
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedWord(null);
  };
  const [openWordIds, setOpenWordIds] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Toggle dropdown visibility for a specific word by its id
  const toggleDropdown = (id: number) => {
    setOpenWordIds((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the current word's open state
    }));
  };

  return (
    <div>
      <div className="grid grid-cols-6 gap-4 p-2 font-semibold text-[#4b4b4b] border-b hidden md:grid">
        <div>Word</div>
        <div>Definition</div>
        <div>Translation</div>
        <div>Status</div>
        <div>Created Date</div>
        <div className="text-center">Actions</div>
      </div>
      {words.length === 0 && <p className="mt-4">No words...</p>}
      {words.map((row, index) => (
        <>
          <div
            key={row.id}
            className="md:hidden flex flex-col bg-white px-4 py-2 gap-2 mb-2 rounded"
          >
            {/* Word Header Section (Clickable to Toggle Dropdown) */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown(row.id)}
            >
              <div className="flex">
                <div className="text-center md:text-left">
                  <Status status={row.status} />
                </div>
                <div className="text-[20px] md:text-[16px] font-bold ml-4">
                  {row.word}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <EditButton onClick={() => handleEdit(row)} />
                <DeleteButton onClick={() => handleDelete(row)} />
              </div>
            </div>

            {/* Dropdown Content (Definition and Translation) */}
            {openWordIds[row.id] && (
              <div className="ml-4">
                <div className="text-light">
                  <p className="md:hidden text-[12px] text-[#4b4b4b] mt-2">
                    Definition:
                  </p>
                  {row.definition}
                </div>
                <div className="text-light">
                  <p className="md:hidden text-[12px] text-[#4b4b4b] mt-2">
                    Translation:
                  </p>
                  {row.translation}
                </div>
              </div>
            )}
          </div>
          <div
            key={row.id}
            className={`hidden md:grid md:grid-cols-6 md:gap-4 px-4 p-2 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-gray-100 border-b`}
          >
            <div className="text-[20px] md:text-[16px] font-bold">
              {row.word}
            </div>
            <div className="text-light">
              <p className="md:hidden text-[12px] text-[#4b4b4b] mt-2">
                Defination:
              </p>
              {row.definition}
            </div>
            <div className="text-light">
              <p className="md:hidden text-[12px] text-[#4b4b4b] mt-2">
                Translation:
              </p>
              {row.translation}
            </div>
            <div className="text-center md:text-left mb-2 md:mb-0 hidden md:block w-fit">
              <Status status={row.status} />
            </div>
            <div className="hidden md:block">
              {new Date(row.createdAt).toLocaleDateString()}
            </div>
            <div className="flex justify-center space-x-2">
              <EditButton onClick={() => handleEdit(row)} />
              <DeleteButton onClick={() => handleDelete(row)} />
            </div>
          </div>
        </>
      ))}

      {/* Delete Confirmation Dialog */}
      {isDialogOpen && selectedWord && (
        <DeleteConfirmationDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onConfirm={confirmDelete}
          itemName={selectedWord.word}
        />
      )}
      {isEditDialogOpen && selectedWord && (
        <EditWordDialog
          title="Edit Word"
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={selectedWord}
        />
      )}
    </div>
  );
};

export default WordTable;
