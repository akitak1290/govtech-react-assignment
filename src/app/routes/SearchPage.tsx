import Search from "@/features/search/SearchContainer";
import ErrorBoundary from "@/features/errorBoundary/ErrorBoundary";

function SearchPage() {
  return (
    <ErrorBoundary>
      <Search />
    </ErrorBoundary>
  );
}

export default SearchPage;
