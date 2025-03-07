import { useEffect, useRef, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SearchIcon from "./SearchIcon";
import useFetchSuggestionResult from "../api/getSuggestionResult";
import Spinner from "@/components/Spinner";
import { highlightSuggestion } from "../utils/parseHighlight";

type PropType = {
  onSubmit: (newSearchString: string) => void;
};

function SearchInput(props: PropType) {
  const { onSubmit: onSubmitProp } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [showTypeahead, setShowTypeahead] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  const [isFocus, setIsFocus] = useState(false);

  const { data, loading } = useFetchSuggestionResult(searchString);
  const { suggestions, synonymSuggestions } = data || {};

  useEffect(() => {
    if (data) setShowTypeahead(true);
  }, [data]);

  const onInputChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
    setSuggestionIndex(-1);
  };

  const onKeyDown = function (e: React.KeyboardEvent<HTMLElement>) {
    switch (e.key) {
      case "ArrowUp":
        if (!suggestions) return;

        if (suggestionIndex === -1) {
          setSuggestionIndex(suggestions.length - 1);
        } else {
          setSuggestionIndex((prev) => prev - 1);
        }
        break;
      case "ArrowDown":
        if (!suggestions) return;

        if (suggestionIndex === suggestions.length - 1) {
          setSuggestionIndex(-1);
        } else {
          setSuggestionIndex((prev) => prev + 1);
        }
        break;

      case "Enter":
        if (!searchString) return;

        if (suggestions && suggestionIndex !== -1) {
          onClickSuggestion(suggestions[suggestionIndex]);
          return;
        }

        setShowTypeahead(false);
        onSubmitProp(searchString);
        break;
      default:
        break;
    }
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
        setShowTypeahead(false);
        onSubmitProp(searchString);
      }}
    >
      <div className="relative grow">
        <Input
          aria-label="search-input"
          ref={inputRef}
          value={searchString}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          className={`rounded-r-none`}
        />
        {searchString.length > 0 && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center justify-center cursor-pointer px-5 my-[1px] hover:bg-gray-100"
            onClick={handleClearInput}
            aria-label="clear-input-button"
          >
            x
          </button>
        )}
        {loading && (
          <span className="absolute inset-y-0 right-12 flex items-center justify-center">
            <Spinner />
          </span>
        )}
        {showTypeahead && suggestions && (
          <ul className="absolute w-full z-10 mt-1 bg-white rounded-b-xl shadow-md">
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <li
                key={index}
                className={`px-4 py-3 cursor-pointer ${
                  index === suggestionIndex ? "bg-blue-100" : ""
                }`}
                onClick={() => onClickSuggestion(suggestion)}
                onMouseOver={() => setSuggestionIndex(index)}
                onMouseLeave={() => setSuggestionIndex(-1)}
              >
                {highlightSuggestion(suggestion, searchString)}
              </li>
            ))}
            {synonymSuggestions && (
              <span>
                <hr className="w-[98%] m-auto my-3 border-gray-300" />
                <p className="px-4 text-gray-500">related results</p>
                <ul className="flex flex-wrap gap-3 px-4 pt-3 pb-6">
                  {synonymSuggestions.slice(0, 7).map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py3 bg-gray-200 rounded-lg hover:cursor-pointer hover:bg-gray-300"
                      onClick={() => onClickSuggestion(suggestion)}
                    >
                      {suggestion.length > 30
                        ? `${suggestion.slice(0, 30)}...`
                        : suggestion}
                    </li>
                  ))}
                </ul>
              </span>
            )}
          </ul>
        )}
      </div>
      <Button
        type="submit"
        className={`rounded-l-none items-center ${
          isFocus ? "ring-1 ring-blue-500 border-blue-500 outline-none" : ""
        }`}
      >
        <SearchIcon />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}

export default SearchInput;
