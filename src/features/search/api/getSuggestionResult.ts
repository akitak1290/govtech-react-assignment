import { useEffect, useState } from "react";

import { suggestionEndpoint as mockSuggestionEndpoint } from "@/mock/api.mock";
import { SuggestionResult, SuggestionResultWrapper } from "@/utils/interface";
import { FETCH_NO_DATA_FOUND, FETCH_RETURN_NOT_OK } from "@/utils/constant";

const suggestionEndpoint = mockSuggestionEndpoint;

export async function fetchSuggestionResult(
  searchString: string
): Promise<SuggestionResultWrapper> {
  try {
    const response = await fetch(suggestionEndpoint);

    if (!response.ok) {
      return {
        data: null,
        error: `${FETCH_RETURN_NOT_OK}, got code ${response.status}`,
      };
    }

    const data: SuggestionResult = await response.json();

    if (Object.keys(data).length === 0) {
      return {
        data: null,
        error: `${FETCH_NO_DATA_FOUND} for ${searchString}`,
      };
    }

    const searchWords = searchString.trim().split(/\s+/g);
    let suggestions = Object.keys(data.suggestions);
    suggestions = suggestions.filter((suggestion) =>
      searchWords.every((word) => suggestion.toLowerCase().includes(word))
    );
    suggestions.sort((a, b) => data.suggestions[b] - data.suggestions[a]);

    return {
      data: suggestions,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
    };
  }
}

export default function useFetchSuggestionResult(searchString: string) {
  const [data, setData] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchString || searchString.length < 3) {
      setData(null);
      setError(null);
      return;
    }

    const getData = async function () {
      setData(null);
      setError(null);
      setLoading(true);

      const { data, error } = await fetchSuggestionResult(searchString);
      if (error) {
        setError(error);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    getData();
  }, [searchString]);

  return { data, loading, error };
}
