import { useEffect, useState } from "react";

import { suggestionEndpoint as mockSuggestionEndpoint } from "@/mock/api.mock";
import {
  ParsedSuggestionResult,
  SuggestionResult,
  SuggestionResultWrapper,
} from "@/utils/interface";
import { FETCH_NO_DATA_FOUND, FETCH_RETURN_NOT_OK } from "@/utils/constant";
import { useError } from "@/hooks/useError";

const suggestionEndpoint = mockSuggestionEndpoint;

function findFromSynonym(
  searchWords: string[],
  suggestions: string[],
  synonyms: Record<string, string[]>
) {
  let result: Record<string, string[]> = {};
  searchWords.forEach((word) => {
    if (word in synonyms) {
      result[word] = [];
      synonyms[word].forEach((synonym) => {
        result[word].push(
          ...suggestions.filter((suggestion) => suggestion.includes(synonym))
        );
      });
    }
  });

  // ! to simplify the logic, only return the first word that has synonym
  return Object.values(result).find((array) => array.length > 0);
}

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
      searchWords.every((word) =>
        // suggestion.toLowerCase().includes(word)
        new RegExp(`\\b${word.toLowerCase()}`).test(suggestion.toLowerCase())
      )
    );
    suggestions.sort((a, b) => data.suggestions[b] - data.suggestions[a]);

    let synonymSuggestions =
      findFromSynonym(
        searchWords,
        Object.keys(data.suggestions),
        data.synonyms
      ) || null;

    if (synonymSuggestions) {
      synonymSuggestions = synonymSuggestions.filter((suggestion) => {
        return !suggestions.includes(suggestion);
      });
    }

    return {
      data: {
        suggestions,
        synonymSuggestions,
      },
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
  const [data, setData] = useState<ParsedSuggestionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, setError, clearError } = useError();

  const [searchStringDebounced, setSearchStringDebounced] =
    useState(searchString);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchStringDebounced(searchString);
    }, 200);

    return () => clearTimeout(timerId);
  }, [searchString]);

  useEffect(() => {
    if (!searchStringDebounced || searchStringDebounced.length < 3) {
      setData(null);
      clearError();
      return;
    }

    const getData = async function () {
      clearError();
      setLoading(true);

      const { data, error } = await fetchSuggestionResult(
        searchStringDebounced
      );
      if (error) {
        setError(error);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    getData();
  }, [searchStringDebounced, setError, clearError]);

  return { data, loading, error };
}
