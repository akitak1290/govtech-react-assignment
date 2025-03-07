import { QueryResult } from "@utils/interface";

export function filterQueryResult(
  data: QueryResult,
  searchString: string
): QueryResult | null {
  const copiedData: QueryResult = JSON.parse(JSON.stringify(data));
  const filteredResults = copiedData.ResultItems.filter(
    (item) =>
      item.DocumentTitle.Text.toLowerCase().includes(
        searchString.toLowerCase()
      ) ||
      item.DocumentExcerpt.Text.toLowerCase().includes(
        searchString.toLowerCase()
      )
  );

    // modify highlight list if the search string is different from what is given by the mock api
  const KEY_WORD = "child";
  if (KEY_WORD !== searchString.toLowerCase()) {
    for (let i = 0; i < filteredResults.length; ++i) {
      const regex = new RegExp(searchString, "g");
      let matches;
      let startIndices;

      matches = Array.from(
        filteredResults[i].DocumentTitle.Text.toLowerCase().matchAll(regex)
      );
      startIndices = matches.map((match) => match.index);
      filteredResults[i].DocumentTitle.Highlights = startIndices.map(
        (startIndex) => {
          return {
            BeginOffset: startIndex,
            EndOffset: startIndex + searchString.length,
          };
        }
      );

      matches = Array.from(
        filteredResults[i].DocumentExcerpt.Text.toLowerCase().matchAll(regex)
      );
      startIndices = matches.map((match) => match.index);
      filteredResults[i].DocumentExcerpt.Highlights = startIndices.map(
        (startIndex) => {
          return {
            BeginOffset: startIndex,
            EndOffset: startIndex + searchString.length,
          };
        }
      );
    }
  }

  return filteredResults.length > 0
    ? {
        ...copiedData,
        TotalNumberOfResults: filteredResults.length,
        ResultItems: filteredResults,
      }
    : null;
}
