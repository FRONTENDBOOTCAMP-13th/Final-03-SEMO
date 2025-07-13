import { SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="flex items-center gap-3 min-w-[360px] max-w-[480px] bg-uni-gray-200 rounded-[12px] px-4 h-12 w-full">
      <button className="text-uni-black">
        <SearchIcon size={24}></SearchIcon>
      </button>
      <input
        type="text"
        placeholder="검색"
        className="w-full bg-transparent outline-none placeholder-[#5E738C] text-16 text-uni-black"
      />
    </div>
  );
};
export default Search;
