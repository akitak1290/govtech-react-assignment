import { renderHook, waitFor } from "@testing-library/react";
import { QueryResult } from "@utils/interface";
import { fetchQueryResult, useFetchQueryResult } from "./getQueryResult";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).fetch = jest.fn();

const mockData: QueryResult = {
  TotalNumberOfResults: 2,
  Page: 1,
  PageSize: 10,
  ResultItems: [
    {
      DocumentId: "8f09d0d0898e5470189120415158f7b5",
      DocumentTitle: {
        Text: "Choose a Child Care Centre",
        Highlights: [
          {
            BeginOffset: 9,
            EndOffset: 14,
          },
        ],
      },
      DocumentExcerpt: {
        Text: "...as partners to optimise the child physical, intellectual, emotional and social development. Choosing a Child Care Centre for Your Child In choosing the appropriate child care arrangement, the age and personality of your child are important factors for consideration...",
        Highlights: [
          {
            BeginOffset: 31,
            EndOffset: 36,
          },
          {
            BeginOffset: 106,
            EndOffset: 111,
          },
          {
            BeginOffset: 133,
            EndOffset: 138,
          },
          {
            BeginOffset: 167,
            EndOffset: 172,
          },
          {
            BeginOffset: 223,
            EndOffset: 228,
          },
        ],
      },
      DocumentURI:
        "https://www.ecda.gov.sg/Parents/Pages/ParentsChooseCCC.aspx",
    },
    {
      DocumentId: "0a055db5880a278d8734750c0925420f",
      DocumentTitle: {
        Text: "ICA | Child (aged under 21) of a Singapore Citizen (SC) or Singapore Permanent Resident (PR)",
        Highlights: [
          {
            BeginOffset: 6,
            EndOffset: 11,
          },
        ],
      },
      DocumentExcerpt: {
        Text: "...Child (aged under 21) of a Singapore Citizen (SC) or Singapore Permanent Resident (PR) Child (aged under 21) of a Singapore Citizen (SC) or Singapore Permanent Resident (PR) From the foreign child (applicant) Birth Certificate and adoption documents (if any) The applicant recent passport...",
        Highlights: [
          {
            BeginOffset: 3,
            EndOffset: 8,
          },
          {
            BeginOffset: 90,
            EndOffset: 95,
          },
          {
            BeginOffset: 194,
            EndOffset: 199,
          },
        ],
      },
      DocumentURI:
        "https://www.ica.gov.sg/reside/LTVP/apply/child-(aged-under-21)-of-a-singapore-citizen-(sc)-or-singapore-permanent-resident-(pr)",
    },
  ],
};

describe("fetchQueryResult", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return filtered data when API call is successful", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchQueryResult("child");
    expect(result.data).toEqual(mockData);
  });

  it("should return an error when API call fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await fetchQueryResult("test");
    expect(result.data).toBeNull();
    expect(result.error).toContain("Failed to retrieve data from server");
  });

  it("should handle fetch exceptions", async () => {
    const result = await fetchQueryResult("test");
    expect(result.data).toBeNull();
    expect(result.error).toBe("❌ Fetch error");
  });

  it("should return proper error message when no data is found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ok: true, json: jest.fn().mockResolvedValue({})});

    const result = await fetchQueryResult("test");

    expect(result.data).toBeNull();
    expect(result.error).toBe("No data found for test");
  })
});

describe("useFetchQueryResult", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data when searchString is provided", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });
    const { result } = renderHook(() => useFetchQueryResult("child"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it("should be able to handle errors when fetch fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });
    const { result } = renderHook(() => useFetchQueryResult("wrong string"));

    await waitFor(() =>
      expect(result.current.error).toContain(
        "Failed to retrieve data from server"
      )
    );
  });

  it("clears data when search string is empty", () => {
    const { result } = renderHook(() => useFetchQueryResult(""));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
