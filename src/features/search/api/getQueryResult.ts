import { useState, useEffect } from "react";

import { queryResultEndpoint as mockQueryREsultEndpoint } from "@/mock/api.mock";
import { QueryResult, QueryResultWrapper } from "@utils/interface";
import { filterQueryResult } from "@/mock/filter.mock";
import { FETCH_NO_DATA_FOUND, FETCH_RETURN_NOT_OK } from "@utils/constant";

const queryResultEndpoint = mockQueryREsultEndpoint;

export async function fetchQueryResult(
  searchString: string
): Promise<QueryResultWrapper> {
  try {
    const response = await fetch(queryResultEndpoint);

    if (!response.ok) {
      return {
        data: null,
        error: `${FETCH_RETURN_NOT_OK}, got code ${response.status}`,
      };
    }

    const data: QueryResult = await response.json();

    if (Object.keys(data).length === 0) {
      return {
        data: null,
        error: `${FETCH_NO_DATA_FOUND} for ${searchString}`,
      };
    }

    const filteredData = filterQueryResult(data, searchString);

    if (!filteredData) {
      return {
        data: null,
        error: `${FETCH_NO_DATA_FOUND} for ${searchString}`,
      };
    }

    return {
      data: filteredData,
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
      setData(null);
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
