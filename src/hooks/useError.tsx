import { useCallback, useState } from "react";

export const useError = () => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, setError, clearError };
};
