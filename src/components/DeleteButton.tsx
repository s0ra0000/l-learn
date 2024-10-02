import { MdDelete } from "react-icons/md";
interface ButtonProps {
  onClick: () => void;
}
const DeleteButton = ({ onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-not_yet font-bold py-1 px-4 rounded text-[20px]"
    >
      <MdDelete />
    </button>
  );
};

export default DeleteButton;
