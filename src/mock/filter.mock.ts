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

  return filteredResults.length > 0
    ? {
        ...copiedData,
        TotalNumberOfResults: filteredResults.length,
        ResultItems: filteredResults,
      }
    : null;
}
