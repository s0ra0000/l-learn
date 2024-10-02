interface InfoCardProps {
  count: number;
  text: string;
}
const InfoCard = ({ count, text }: InfoCardProps) => {
  return (
    <div className="bg-white rounded md:rounded-xl pl-2 py-2 md:px-4 md:py-4 flex w-[140px] h-[74px] md:w-[280px] md:h-[148px]">
      <div className="bg-primary w-1 md:w-2 h-full rounded-full"></div>
      <div className="h-full flex items-between flex-col justify-around ml-2 md:ml-4">
        <p className="text-[12px] md:text-[20px] font-light text-[#4b4b4b]">
          {text}
        </p>
        <p className="text-[32px] md:text-[64px] text-black">{count}</p>
      </div>
    </div>
  );
};

export default InfoCard;
