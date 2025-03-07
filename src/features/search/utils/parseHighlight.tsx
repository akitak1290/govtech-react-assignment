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

export function highlightSuggestion(text: string, searchString: string) {
  const searchWords = searchString.trim().split(/\s+/g);
  let result = text;

  // ASSUMPTIONS
  // should be case-insensitive for a more robust result
  // should only match the start of a word, not the middle
  searchWords.forEach((word) => {
    const regex = new RegExp(`\\b(${word})`, "gi");
    result = result.replace(regex, `<b>$1</b>`);
  });

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}