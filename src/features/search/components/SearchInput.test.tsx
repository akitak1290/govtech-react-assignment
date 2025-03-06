import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SearchInput from "./SearchInput";
import useFetchSuggestionResult from "../api/getSuggestionResult";

jest.mock("../api/getSuggestionResult", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe(SearchInput, () => {
  let onSubmitMock: jest.Mock;

  beforeEach(() => {
    onSubmitMock = jest.fn();
    (useFetchSuggestionResult as jest.Mock).mockResolvedValue({
      data: [],
      loading: false,
    });
  });

  it("should render search input and button initially", () => {
    render(<SearchInput onSubmit={onSubmitMock} />);
    const input = screen.getByLabelText("search-input");

    expect(input).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should update input value on typing", async () => {
    render(<SearchInput onSubmit={onSubmitMock} />);
    const input = screen.getByRole("textbox", { name: /search-input/i });

    await userEvent.type(input, "hello");

    expect(input).toHaveValue("hello");
  });

  it("should show the clear button when >= 1 character is typed in search bar", async () => {
    render(<SearchInput onSubmit={onSubmitMock} />);

    const input = screen.getByRole("textbox", { name: /search-input/i });
    await userEvent.type(input, "h");
    expect(input).toHaveValue("h");

    const clearButton = screen.getByLabelText("clear-input-button");
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(input).toHaveValue("");
    expect(clearButton).not.toBeInTheDocument();
  });

  it("should clear the input field when clear button is pressed", async () => {
    render(<SearchInput onSubmit={onSubmitMock} />);

    const input = screen.getByRole("textbox", { name: /search-input/i });
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");

    const clearButton = screen.getByLabelText("clear-input-button");
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("should be able to handle keyboard navigation (ArrowDown, ArrowUp, Enter)", async () => {
    (useFetchSuggestionResult as jest.Mock).mockReturnValue({
      data: ["apple", "banana", "cherry"],
    });

    render(<SearchInput onSubmit={onSubmitMock} />);
    const input = screen.getByLabelText("search-input");

    await userEvent.type(input, "app");
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("apple");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(listItems[0]).toHaveClass("bg-blue-100");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveValue("apple");
  });

  it("should update input field, hide suggestion list, and update searchResult", async () => {
    (useFetchSuggestionResult as jest.Mock).mockReturnValue({
      data: ["apple", "banana", "cherry"],
    });

    render(<SearchInput onSubmit={onSubmitMock} />);
    const input = screen.getByLabelText("search-input");

    await userEvent.type(input, "app");
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("apple");

    fireEvent.click(screen.getByText(/Search/i));
    expect(listItems[0]).not.toBeVisible();
    expect(onSubmitMock).toHaveBeenCalled();
  });
});
