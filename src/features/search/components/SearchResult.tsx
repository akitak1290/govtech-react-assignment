import { useMemo } from "react";

import json from "@/mock/queryResult.mock.json";
import { QueryResult } from "@utils/interface";

type PropType = {
  searchString: string;
};

function SearchResult(props: PropType) {
  const { searchString } = props;

  // TODO: mock, replace later
  const data: QueryResult | null = useMemo(
    () =>
      searchString && searchString.length > 0
        ? {
            ...json,
            suggestions: json.ResultItems.slice(0, 2),
          }
        : null,
    [searchString]
  );

  return (
    <>
      {data && (
        <div>
          <p className="pb-14 text-xl font-medium">
            Showing 1-{Math.min(data.TotalNumberOfResults, data.PageSize)} of{" "}
            {data.TotalNumberOfResults} results
          </p>
          <ul>
            {data.ResultItems.map((result, index) => (
              <li key={index} className="mb-12 *:my-3">
                <a
                  className="text-[#1C76D5] text-xl font-medium"
                  href={result.DocumentURI}
                  target="_blank"
                >
                  {result.DocumentTitle.Text}
                </a>
                <p>{result.DocumentExcerpt.Text}</p>
                <a
                  className="text-[#686868]"
                  target="_blank"
                  href={result.DocumentURI}
                >
                  {result.DocumentURI}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default SearchResult;
