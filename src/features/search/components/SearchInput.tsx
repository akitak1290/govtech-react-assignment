import { useRef, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SearchIcon from "./SearchIcon";
import useFetchSuggestionResult from "../api/getSuggestion";
import Spinner from "@/components/Spinner";

type PropType = {
  onSubmit: (newSearchString: string) => void;
};

function SearchInput(props: PropType) {
  const { onSubmit: onSubmitProp } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [showTypeahead, setShowTypeahead] = useState(true);
  const [searchString, setSearchString] = useState("");

  const { data: suggestions, loading } = useFetchSuggestionResult(searchString);

  const onInputChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);

    if (suggestions) setShowTypeahead(true);
  };

  const handleClearInput = function () {
    setSearchString("");
    setShowTypeahead(false);
    inputRef.current?.focus();
  };

  const onClickSuggestion = function (suggestion: string) {
    setShowTypeahead(false);
    setSearchString(suggestion);
    onSubmitProp(suggestion);
  };

  return (
    <form
      className="flex w-full relative"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitProp(searchString);
      }}
    >
      <div className="relative grow">
        <Input
          aria-label="search-input"
          ref={inputRef}
          value={searchString}
          onChange={onInputChange}
        />
        {searchString.length > 0 && (
          <button
            type="button"
            className="absolute inset-y-0 right-4 flex items-center justify-center cursor-pointer"
            onClick={handleClearInput}
            aria-label="clear-input-button"
          >
            x
          </button>
        )}
        {loading && (
          <span className="absolute inset-y-0 right-9 flex items-center justify-center">
            <Spinner />
          </span>
        )}
        {showTypeahead && suggestions && (
          <ul className="absolute w-full z-10 mt-1 bg-white rounded-b-xl shadow-md">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-3 hover:bg-blue-100 cursor-pointer"
                onClick={() => onClickSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit">
        <SearchIcon />
        Search
      </Button>
    </form>
  );
}

export default SearchInput;
