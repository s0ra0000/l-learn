"use client";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import DeleteConfirmationDialog from "./DeleteDialog";
import RenameDialog from "./RenameDialog";

interface FolderCardProps {
  id: number;
  name: string;
  quantity: number;
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

const FolderCard = ({
  id,
  name,
  quantity,
  onRename,
  onDelete,
}: FolderCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [folderName, setFolderName] = useState(name);
  const [renameInput, setRenameInput] = useState(name);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  // Toggle dropdown menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Handle delete action
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    setIsMenuOpen(false);
  };

  // Confirm delete action
  const confirmDelete = () => {
    onDelete(id); // Notify parent to delete
    setIsDeleteDialogOpen(false);
  };

  // Handle rename action
  const handleEdit = () => {
    setRenameInput(folderName); // Set the current folder name when opening the rename dialog
    setIsRenameDialogOpen(true);
    setIsMenuOpen(false);
  };

  // Submit rename action
  const submitRename = (newName: string) => {
    if (newName.trim() && newName !== folderName) {
      onRename(id, newName); // Notify parent to rename
    }
    setIsRenameDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-lg px-4 py-4 flex w-[280px] h-[90px] items-center justify-between relative">
      <div className="flex h-full items-center w-full">
        <div className="bg-primary w-1 h-full rounded-full"></div>
        <div className="h-full flex flex-col justify-around ml-4">
          <Link href={`/dashboard/folders/${id}`}>
            <p className="text-[24px] font-regular text-black">{folderName}</p>
          </Link>
          <p className="text-[16px] text-[#4b4b4b]">{quantity} words</p>
        </div>
      </div>

      {/* Dropdown button */}
      <div
        className="absolute top-4 right-4 dropdown-button cursor-pointer"
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
        itemName={folderName}
      />

      {/* Rename Dialog */}
      <RenameDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        onSubmit={submitRename}
        initialName={renameInput}
      />
    </div>
  );
};

export default FolderCard;
