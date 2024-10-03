"use client";
import { useState, MouseEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter from next/navigation

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    word: string;
    definition: string;
    translation: string;
  }) => void;
}

const AddWordDialog = ({ title, isOpen, onClose, onSubmit }: DialogProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [translation, setTranslation] = useState("");

  const handleSubmit = async () => {
    const formData = { word, definition, translation };
    console.log("Word added successfully:", formData);
    try {
      // Send POST request using Axios
      const response = await axios.post("/api/words", formData);

      if (response.status !== 200) {
        throw new Error("Failed to create word");
      }

      const data = response.data;
      console.log("Word added successfully:", data);
      toast.success("Word added successfully!");

      // Reset form fields
      setWord("");
      setDefinition("");
      setTranslation("");

      // Close the dialog
      onClose();

      if (pathname === "/dashboard/words") {
        console.log("wtf");
        window.location.reload();
      } else {
        router.push("/dashboard/words");
      }
    } catch (error) {
      console.error("Error adding word:", error);
      toast.error("Failed to add word. Please try again.");
    }
  };

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
          <label className="block text-gray-700 mb-2">New word</label>
          <input
            placeholder="apple..."
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full border border-[#CFCFCF] py-2 rounded px-4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Definition</label>
          <textarea
            placeholder="a rounded fruit with a red, yellow, or green skin, firm white flesh and a seedy core..."
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className="w-full border border-[#CFCFCF] py-2 px-4 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Translation</label>
          <textarea
            placeholder="улаан, шар, ногоон арьстай, хатуу цагаан махтай, үртэй цөмтэй дугуй хэлбэртэй жимс..."
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full border border-[#CFCFCF] py-2  px-4 rounded"
          />
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWordDialog;
