"use client";
import { useState, useEffect } from "react";
import FolderCard from "@/components/FolderCard";
import { IoIosSearch } from "react-icons/io";
import AddFolderDialog from "@/components/AddFolderDialog";
import { MdAdd } from "react-icons/md";
// Define the Folder type
type Folder = {
  id: number;
  folderName: string;
  wordCount: number;
};

export default function Folders() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch folders from the server
  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/folders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: Folder[] = await response.json();
        setFolders(data);
      } else {
        console.error("Failed to fetch folders");
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // Create a new folder
  const handleAddFolder = async (folderName: string) => {
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderName }),
      });

      if (response.ok) {
        fetchFolders(); // Refetch folders after adding
      } else {
        console.error("Failed to create folder");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsAddDialogOpen(false);
    }
  };

  // Handle rename operation
  const handleRenameFolder = async (id: number, newName: string) => {
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderName: newName }),
      });

      if (response.ok) {
        fetchFolders(); // Refetch folders after renaming
      } else {
        console.error("Failed to rename folder");
      }
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  // Handle delete operation
  const handleDeleteFolder = async (id: number) => {
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchFolders(); // Refetch folders after deleting
      } else {
        console.error("Failed to delete folder");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  // Open and close dialogs
  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);

  return (
    <section className="flex w-full p-[30px] items-center z-20">
      <div className="w-full min-h-screen">
        <h1 className="text-[28px] mb-[16px]">Folders</h1>
        <div className="mb-[30px] flex justify-between items-center">
          <form className="flex items-center">
            <input
              type="search"
              className="px-4 py-2 rounded-l h-10 w-[200px] md:w-[360px]"
              placeholder="Search folder..."
            />
            <button type="submit" className="bg-white py-2 h-10 px-4 rounded-r">
              <IoIosSearch className="text-[20px]" />
            </button>
          </form>
          <button
            onClick={openAddDialog}
            className="bg-primary px-2 md:px-3 py-2 rounded-full md:rounded text-white flex items-center justify-center"
          >
            {/* Show the plus icon only when the screen width is <= 400px */}
            <span className="block md:hidden">
              <MdAdd className="text-2xl" />
            </span>
            {/* Show the "Create folder" text when the screen width is > 400px */}
            <span className="hidden md:block">Create folder</span>
          </button>
        </div>

        {/* Render folders or loading indicator */}
        {isLoading ? (
          <p>Loading folders...</p>
        ) : (
          <div className="w-full flex gap-[30px] flex-wrap">
            {folders.length === 0 && <p>No folders...</p>}
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                id={folder.id}
                name={folder.folderName}
                quantity={folder.wordCount}
                onRename={handleRenameFolder}
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>
        )}

        {/* Create Folder Dialog */}
        {isAddDialogOpen && (
          <AddFolderDialog
            isOpen={isAddDialogOpen}
            onClose={closeAddDialog}
            onSubmit={handleAddFolder}
          />
        )}
      </div>
    </section>
  );
}
