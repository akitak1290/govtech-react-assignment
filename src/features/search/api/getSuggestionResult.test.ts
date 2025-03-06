import { renderHook, waitFor } from "@testing-library/react";
import useFetchSuggestionResult, {
  fetchSuggestionResult,
} from "./getSuggestionResult";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).fetch = jest.fn();

describe("fetchSuggestionResult", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return filtered, sorted, suggestions on success", async () => {
    const mockResponse = {
      suggestions: {
        "apple bee": 1,
        banana: 2,
        "apple bee fox": 3,
        blueberry: 4,
        apple: 100,
      },
      synonyms: { apple: "red slightly round fruit" },
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchSuggestionResult("apple bee");

    expect(result.data).toEqual(["apple bee fox", "apple bee"]);
    expect(result.error).toBeNull();
  });

  it("should be able to handle failed API response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await fetchSuggestionResult("ap");

    expect(result.data).toBeNull();
    expect(result.error).toBe(
      "Failed to retrieve data from server, got code 500"
    );
  });

  it("should be able to handle network error", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await fetchSuggestionResult("ap");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Network error");
  });
});

describe("useFetchSuggestionResult", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not fetch if input is empty or less than 3 characters", () => {
    const { result } = renderHook(() => useFetchSuggestionResult("ap"));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should fetch data correctly", async () => {
    const mockResponse = {
      suggestions: {
        "apple bee": 1,
        banana: 2,
        "apple bee fox": 3,
        blueberry: 4,
        apple: 100,
      },
      synonyms: { apple: "red slightly round fruit" },
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const { result } = renderHook(() => useFetchSuggestionResult("apple bee"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(["apple bee fox", "apple bee"]);
    expect(result.current.error).toBe(null);
  });

  it("should be able to handle API errors", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useFetchSuggestionResult("apple"));

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Failed to retrieve data from server, got code 500"
      );
    });
  });

  it("should be able to handle network errors gracefully", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useFetchSuggestionResult("appleasdads")
    );

    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe("Network error");
      expect(result.current.loading).toBe(false);
    });
  });
});
