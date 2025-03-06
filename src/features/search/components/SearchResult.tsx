import Spinner from "@/components/Spinner";
import { useFetchQueryResult } from "../api/getQueryResult";
import { parseHighlightText } from "../utils/parseHighlight";

type PropType = {
  searchString: string;
};

function SearchResult(props: PropType) {
  const { searchString } = props;
  const { data, loading, error } = useFetchQueryResult(searchString);

  return (
    <>
      {error && <span className="w-full flex justify-center">{error}</span>}
      {loading && (
        <span className="w-full flex justify-center">
          <Spinner />
        </span>
      )}
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
                  {parseHighlightText(result.DocumentTitle)}
                </a>
                <span>{parseHighlightText(result.DocumentExcerpt)}</span>
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
