import { SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="w-full min-w-[340px] max-w-[480px] mx-auto py-3 ">
      <div className="flex items-center bg-uni-gray-200 rounded-[12px] h-12 w-full">
        <button className="text-uni-black">
          <SearchIcon size={24} className="ml-4 my-3"></SearchIcon>
        </button>
        <input
          type="text"
          placeholder="검색"
          className="w-full ml-2 my-3 bg-transparent outline-none placeholder-[#5E738C] text-16 text-uni-black"
        />
      </div>
    </div>
  );
};
export default Search;