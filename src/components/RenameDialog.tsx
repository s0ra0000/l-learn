import { useState, MouseEvent } from "react";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
  initialName: string; // The current folder name to be renamed
}

const RenameDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
}: RenameDialogProps) => {
  const [newName, setNewName] = useState(initialName);

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(newName);
    onClose();
  };

  // Close the dialog when clicking outside
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
        <h2 className="text-lg font-bold mb-4">Rename Folder</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Folder Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border border-gray-300 py-2 rounded px-4"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-700 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameDialog;
