"use client";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import DeleteConfirmationDialog from "./DeleteDialog";
import RenameDialog from "./RenameDialog";

interface QuizCardProps {
  id: number;
  name: string;
  quantity: number;
  score: number;
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

const QuizCard = ({
  id,
  name,
  quantity,
  score,
  onRename,
  onDelete,
}: QuizCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizName, setQuizName] = useState(name);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  // Function to toggle dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Function to handle delete action
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    setIsMenuOpen(false);
  };

  // Confirm delete action
  const confirmDelete = () => {
    onDelete(id); // Notify parent to delete
    setIsDeleteDialogOpen(false);
  };

  // Function to handle rename action
  const handleEdit = () => {
    setIsRenameDialogOpen(true);
    setIsMenuOpen(false);
  };

  // Submit rename action
  const submitRename = (newName: string) => {
    if (newName && newName !== quizName) {
      onRename(id, newName); // Notify parent to rename
    }
    setIsRenameDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-lg px-8 py-4 flex flex-col w-[280px] h-[180px] items-center justify-between relative">
      <h1 className="text-[24px] font-medium text-black mt-4">{quizName}</h1>
      <p className="text-[16px] text-light text-[#4b4b4b]">
        Your score: {score}/{quantity}
      </p>

      <Link href={`/dashboard/quizzes/${id}`} className="w-full">
        <button className="bg-primary text-white py-2 rounded text-center w-full">
          Start
        </button>
      </Link>

      {/* Dropdown button */}
      <div
        className="absolute top-4 right-4 dropdown-button"
        onClick={toggleMenu}
      >
        <BsThreeDotsVertical />
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-10 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200 dropdown-menu">
          <button
            onClick={handleEdit}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Rename
          </button>
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-not_yet"
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={quizName}
      />

      {/* Rename Dialog */}
      <RenameDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        onSubmit={submitRename}
        initialName={quizName}
      />
    </div>
  );
};

export default QuizCard;
