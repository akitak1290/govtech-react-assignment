import mockResultJson from "@/mock/queryResult.mock.json";

import { filterQueryResult } from "./filter.mock";

describe(filterQueryResult, () => {
  it("should filter out results that does not include searchString", () => {
    const parsedResult = filterQueryResult(mockResultJson, "child care");
    expect(parsedResult?.TotalNumberOfResults).toBe(2);
  });
});
