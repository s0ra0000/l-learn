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
    <>
      <div
        className={`block md:hidden h-full rounded-full w-2 ${statusColor}`}
      ></div>
      <span
        className={`hidden md:block px-3 py-1 rounded-full text-white text-[10px] md:text-sm ${statusColor}`}
      >
        {status}
      </span>
    </>
  );
};

export default Status;
