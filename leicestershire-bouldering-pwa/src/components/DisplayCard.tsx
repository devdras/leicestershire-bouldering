import SimpleBarChart from "./SimpleBarChart";
import { gradeMap } from "../utils/gradeMap";

const DisplayCard = ({
  displayName,
  image,
  url,
  data,
}: {
  displayName: string;
  image: string;
  url: string;
  data: any;
}) => {
  const sortedArray = gradeMap(data);

  return (
    <a href={url} className="flex gap-x-2">
      <img src={image} alt="" className="w-48 h-48 rounded flex-shrink-0" />
      <div className="flex flex-col flex-grow overflow-hidden">
        <p className="font-bold">{displayName}</p>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2 flex-grow">
          <div className="scroll-smooth touch-pan-x touch-pan-y overflow-x-auto p-1 h-full">
            <SimpleBarChart data={sortedArray} />
          </div>
        </div>
      </div>
    </a>
  );
};
export default DisplayCard;
