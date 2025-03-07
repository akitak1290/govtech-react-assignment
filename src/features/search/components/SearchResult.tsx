import { useState, useMemo } from "react";

import Spinner from "@/components/Spinner";
import { useFetchQueryResult } from "../api/getQueryResult";
import { highlightQueryResult } from "../utils/parseHighlight";

type PropType = {
  searchString: string;
};

function SearchResult(props: PropType) {
  const { searchString } = props;
  const { data, loading, error } = useFetchQueryResult(searchString);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => (data ? Math.ceil(data.TotalNumberOfResults / data.PageSize) : 1),
    [data]
  );

  const onPageChange = function (index: number) {
    if (index !== currentPage - 1) setCurrentPage(index + 1);
  };

  return (
    <>
      {error && (
        <span
          aria-label="search-result-error"
          className="w-full flex justify-center"
        >
          {error}
        </span>
      )}
      {loading && (
        <span className="w-full flex justify-center">
          <Spinner />
        </span>
      )}
      {data && (
        <div>
          <p className="pb-14 text-xl font-medium">
            Showing {(currentPage - 1) * data.PageSize + 1}-
            {Math.min(currentPage * data.PageSize, data.TotalNumberOfResults)}{" "}
            of {data.TotalNumberOfResults} results
          </p>
          <ul>
            {data.ResultItems.slice(
              (currentPage - 1) * data.PageSize,
              Math.min(currentPage * data.PageSize, data.TotalNumberOfResults)
            ).map((result, index) => (
              <li
                key={index}
                aria-label="search-result-item"
                className="mb-12 *:my-3"
              >
                <a
                  className="text-[#1C76D5] text-xl font-medium"
                  href={result.DocumentURI}
                  target="_blank"
                >
                  {highlightQueryResult(result.DocumentTitle)}
                </a>
                <span>{highlightQueryResult(result.DocumentExcerpt)}</span>
                <a
                  className="text-[#686868] break-all sm:break-normal"
                  target="_blank"
                  href={result.DocumentURI}
                >
                  {result.DocumentURI}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-row items-center justify-center mb-4 gap-3">
            {Array(totalPages)
              .fill(0)
              .map((_, index) => (
                <li key={index}>
                  <button
                    className={`py-2 px-4 rounded-4xl text-gray-400 hover:bg-gray-200 hover ${
                      index === currentPage - 1
                        ? "bg-gray-300 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4"
                        : "hover:cursor-pointer"
                    }`}
                    onClick={() => onPageChange(index)}
                    disabled={index === currentPage - 1}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default SearchResult;