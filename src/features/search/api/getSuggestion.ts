import { SuggestionResult, SuggestionResultWrapper } from "@/utils/interface";
import { useEffect, useState } from "react";

export async function fetchSuggestionResult(
  searchString: string
): Promise<SuggestionResultWrapper> {
  const mock = {
    suggestions: {
      "Lorem ipsum odor amet": 1,
      "Consectetuer adipiscing elit": 1,
      "Tempus rhoncus elit aenean": 1,
      child: 1,
    },
    synonyms: {},
  };

  return {
    data: mock,
    error: null,
  };
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
        setData(Object.keys(data!.suggestions));
      }
      setLoading(false);
    };

    getData();
  }, [searchString]);

  return { data, loading, error };
}
