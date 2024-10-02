interface statusProps {
  status: string;
}
const Status = ({ status }: statusProps) => {
  let statusColor = "";

  switch (status.toLowerCase()) {
    case "in_progress":
      statusColor = "bg-progress";
      break;
    case "completed":
      statusColor = "bg-success";
      break;
    default:
      statusColor = "bg-not_yet";
      break;
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-[10px] md:text-sm ${statusColor}`}
    >
      {status}
    </span>
  );
};

export default Status;
