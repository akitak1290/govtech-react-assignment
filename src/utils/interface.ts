interface Highlight {
  BeginOffset: number;
  EndOffset: number;
}

interface DocumentText {
  Text: string;
  Highlights: Highlight[];
}

interface QueryResultItem {
  DocumentId: string;
  DocumentTitle: DocumentText;
  DocumentExcerpt: DocumentText;
  DocumentURI: string;
}

export interface QueryResult {
  TotalNumberOfResults: number;
  Page: number;
  PageSize: number;
  ResultItems: QueryResultItem[];
}

interface Suggestion {
  [key: string]: number;
}

interface Synonym {
  [key: string]: string[];
}

export interface SuggestionResult {
  suggestions: Suggestion;
  synonyms: Synonym;
}
