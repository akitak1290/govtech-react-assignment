import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SearchInput from "./SearchInput";

describe(SearchInput, () => {
  let onSubmitMock: jest.Mock;

  beforeEach(() => {
    onSubmitMock = jest.fn();
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
});
