import { useState } from "react";
import SearchInput from "./components/SearchInput";
import SearchResult from "./components/SearchResult";

function Search() {
  const [searchString, setSearchString] = useState("");

  const onSubmit = function (newSearchString: string) {
    setSearchString(newSearchString);
  };

  return (
    <div>
      <div className="w-full m-auto py-14 shadow-lg">
        <div className="max-w-6xl px-4 m-auto">
          <SearchInput onSubmit={onSubmit} />
        </div>
      </div>

      <div className="w-full max-w-6xl px-4 m-auto pt-14">
        <SearchResult searchString={searchString} />
      </div>
    </div>
  );
}

export default Search;
