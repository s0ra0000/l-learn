import { useState, MouseEvent } from "react";

interface AddFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
}

const AddFolderDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: AddFolderDialogProps) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = () => {
    if (folderName.trim() === "") return; // Prevent empty folder names
    onSubmit(folderName);
    onClose();
    setFolderName(""); // Reset the input after submit
  };

  // Handle clicking outside the dialog to close
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
        <h2 className="text-lg font-bold mb-4">Create New Folder</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Folder Name</label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full border border-gray-300 py-2 rounded px-4"
            placeholder="Enter folder name"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-700 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolderDialog;
