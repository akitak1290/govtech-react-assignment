import { render, screen } from "@testing-library/react";

import SearchResult from "./SearchResult";
import mockJson from "@/mock/queryResult.mock.json";
import { highlightQueryResult } from "../utils/parseHighlight";
import { useFetchQueryResult } from "../api/getQueryResult";
import { FETCH_NO_DATA_FOUND } from "@/utils/constant";

jest.mock("../api/getQueryResult", () => ({
  __esModule: true,
  useFetchQueryResult: jest.fn(),
}));

describe(SearchResult, () => {
  it("parseHighlightText()", async () => {
    const result = mockJson.ResultItems[2];

    const { container } = render(highlightQueryResult(result.DocumentTitle));

    const boldElements = container.querySelectorAll("b");
    expect(boldElements.length).toBe(1);
    expect(boldElements[0].textContent).toBe("Child");

    expect(container.textContent).toBe(result.DocumentTitle.Text);
  });

  it("search result should show when a valid query string is entered", async () => {
    (useFetchQueryResult as jest.Mock).mockReturnValue({ data: mockJson });

    const searchString = "child";
    render(<SearchResult searchString={searchString} />);

    const searchResult = screen.queryAllByLabelText("search-result-item");
    expect(searchResult[0]).toBeInTheDocument();
  });

  it("should display error when an error is returned", () => {
    const errorMessage = "Something went wrong";
    (useFetchQueryResult as jest.Mock).mockReturnValue({
      data: null,
      error: errorMessage,
    });

    const searchString = "random words go!";
    render(<SearchResult searchString={searchString} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should display loading when loading state is true", () => {
    (useFetchQueryResult as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
    });

    const searchString = "";
    render(<SearchResult searchString={searchString} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should display no results found when the result is empty", () => {
    const searchString = "another random string";
    (useFetchQueryResult as jest.Mock).mockReturnValue({ data: null, error: `${FETCH_NO_DATA_FOUND} for ${searchString}` });

    render(<SearchResult searchString={searchString} />);

    expect(screen.getByLabelText("search-result-error")).toBeInTheDocument();
  });
});
