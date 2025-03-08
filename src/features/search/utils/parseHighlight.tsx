import { JSX } from "react";

import { DocumentText } from "@/utils/interface";

export function highlightQueryResult(documentText: DocumentText) {
  const text = documentText.Text;
  const parsedText: (string | JSX.Element)[] = [];

  let cur = 0;
  documentText.Highlights.forEach((highlight) => {
    parsedText.push(text.substring(cur, highlight.BeginOffset));
    parsedText.push(
      <b>{text.substring(highlight.BeginOffset, highlight.EndOffset)}</b>
    );
    cur = highlight.EndOffset;
  });

  if (cur < text.length) parsedText.push(text.substring(cur));

  return <p>{...parsedText}</p>;
}

export function highlightSuggestion(suggestion: string, searchString: string) {
  const searchWords = searchString.toLowerCase().trim().split(/\s+/); 
  const suggestionWords = suggestion.trim().split(/\s+/);

  const highlightedText = suggestionWords.map((word, index) => {
    const lowerWord = word.toLowerCase();
    const match = searchWords.find((term) => lowerWord.startsWith(term));

    if (match) {
      return (
        <span key={index}>
          <span className="font-semibold">{word.substring(0, match.length)}</span>
          {word.substring(match.length)}{" "}
        </span>
      );
    }

    return <span key={index}>{word} </span>;
  });


  return <div>{highlightedText}</div>;
}
