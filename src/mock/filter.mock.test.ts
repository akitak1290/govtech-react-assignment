import mockResultJson from "@/mock/queryResult.mock.json";

import { filterQueryResult } from "./filter.mock";

describe(filterQueryResult, () => {
  it("should filter out results that does not include searchString", () => {
    const parsedResult = filterQueryResult(mockResultJson, "child care");
    expect(parsedResult?.TotalNumberOfResults).toBe(2);
  });

  it("should modify the highlight list to match searchString instead", () => {
    let parsedResult = filterQueryResult(mockResultJson, "child");
    let title = parsedResult?.ResultItems[0].DocumentTitle;
    expect(title?.Highlights[0]).toEqual({ BeginOffset: 9, EndOffset: 14 });

    parsedResult = filterQueryResult(mockResultJson, "child care");
    title = parsedResult?.ResultItems[0].DocumentTitle;
    expect(title?.Highlights[0]).toEqual({ BeginOffset: 9, EndOffset: 19 });
  });
});
