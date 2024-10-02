"use client";
import { useState, MouseEvent } from "react";

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    word: string;
    definition: string;
    translation: string;
    status: string;
  }) => void; // Callback to handle the submitted data
  initialData: {
    word: string;
    definition: string;
    translation: string;
    status: string;
  }; // Initial data to populate the form
}

const EditWordDialog = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: DialogProps) => {
  const [word, setWord] = useState(initialData.word);
  const [definition, setDefinition] = useState(initialData.definition);
  const [translation, setTranslation] = useState(initialData.translation);
  const [status, setStatus] = useState(initialData.status);

  // This will handle the form submission inside the dialog
  const handleSubmit = () => {
    const formData = { word, definition, translation, status };
    console.log("Submitted Data:", formData);

    // Call the onSubmit callback provided by the parent with the form data
    onSubmit(formData);

    // Close the dialog
    onClose();
  };

  // Handle clicking outside of the dialog to close
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
      <div className="bg-background p-6 rounded-xl shadow-md w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Word</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full border border-[#CFCFCF] py-2 rounded px-4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Definition</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className="w-full border border-[#CFCFCF] py-2 px-4 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Translation</label>
          <textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full border border-[#CFCFCF] py-2 px-4 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-[#CFCFCF] py-2 rounded px-4"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Complted</option>
            <option value="NOT_YET">Not Started</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-[#4b4b4b] px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWordDialog;
