import { useState, useEffect } from "react";

import { queryResultEndpoint as mockQueryREsultEndpoint } from "@/mock/api.mock";
import { QueryResult, QueryResultWrapper } from "@utils/interface";

const queryResultEndpoint = mockQueryREsultEndpoint;

export async function fetchQueryResult(
  searchString: string
): Promise<QueryResultWrapper> {
  try {
    const response = await fetch(queryResultEndpoint);

    if (!response.ok) {
      return {
        data: null,
        error: `Failed to retrieve data from server, got code ${response.status}`,
      };
    }

    const data: QueryResult = await response.json();
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
    };
  }
}

export function useFetchQueryResult(searchString: string) {
  const [data, setData] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchString) {
      setData(null);
      setError(null);
      return;
    }

    const getData = async function () {
      setError(null);
      setLoading(true);
      const { data, error } = await fetchQueryResult(searchString);
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