import { render } from "@testing-library/react";

import SearchResult from "./SearchResult";
import mockJson from "@/mock/queryResult.mock.json";
import { highlightQueryResult } from "../utils/parseHighlight";

describe(SearchResult, () => {
  it("parseHighlightText()", async () => {
    const result = mockJson.ResultItems[2];

    const { container } = render(highlightQueryResult(result.DocumentTitle));

    // Check that the first part is bold
    const boldElements = container.querySelectorAll("b");
    expect(boldElements.length).toBe(1);
    expect(boldElements[0].textContent).toBe("Child");

    // Check that the comma and space are not bold
    expect(container.textContent).toBe(result.DocumentTitle.Text);
  });
});
