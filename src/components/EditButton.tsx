"use client";
import { MdEdit } from "react-icons/md";
interface ButtonProps {
  onClick: () => void;
}

const EditButton = ({ onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-blue-300 font-bold py-1 px-4 rounded text-[20px]"
    >
      <MdEdit />
    </button>
  );
};

export default EditButton;
